<?php
declare(strict_types=1);

session_start([
  'cookie_httponly' => true,
  'cookie_samesite' => 'Lax',
  'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
]);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

const ADMIN_USERNAME = 'admin';
// Password: admin@123 — change this hash before production if you change the password.
const ADMIN_PASSWORD_HASH = '$2y$12$GIMV9bgW4h1Jqhv4rNDsOePWIuoOsFhMw8bknL6pgw7aMzmskkn0G';
const MAX_BODY_BYTES = 16000000;

$dataDir = __DIR__ . DIRECTORY_SEPARATOR . 'data';
$dataFile = $dataDir . DIRECTORY_SEPARATOR . 'portfolio.json';
$lockFile = $dataDir . DIRECTORY_SEPARATOR . 'portfolio.lock';

function respond(array $body, int $status = 200): never {
  http_response_code($status);
  echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}
function body(): array {
  $length = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
  if ($length > MAX_BODY_BYTES) respond(['ok' => false, 'error' => 'Upload is too large. Use image URLs for large images.'], 413);
  $raw = file_get_contents('php://input');
  $decoded = json_decode($raw ?: '{}', true);
  if (!is_array($decoded)) respond(['ok' => false, 'error' => 'Invalid JSON request.'], 400);
  return $decoded;
}
function requireAdmin(): void {
  if (empty($_SESSION['portfolio_admin'])) respond(['ok' => false, 'error' => 'Please log in again.'], 401);
}
function readData(string $file): ?array {
  if (!is_file($file)) return null;
  $handle = fopen($file, 'rb');
  if (!$handle) return null;
  flock($handle, LOCK_SH);
  $json = stream_get_contents($handle);
  flock($handle, LOCK_UN);
  fclose($handle);
  $data = json_decode($json ?: 'null', true);
  return is_array($data) ? $data : null;
}

function withDataLock(string $dir, string $lockFile, callable $callback) {
  if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
    respond(['ok' => false, 'error' => 'Could not create the server data folder.'], 500);
  }
  $lock = fopen($lockFile, 'c+');
  if (!$lock || !flock($lock, LOCK_EX)) {
    if ($lock) fclose($lock);
    respond(['ok' => false, 'error' => 'Could not lock shared website data.'], 500);
  }
  try {
    return $callback();
  } finally {
    flock($lock, LOCK_UN);
    fclose($lock);
  }
}
function galleryKey(array $item): string {
  $image = trim((string)($item['image'] ?? ''));
  if ($image !== '') return 'image||' . hash('sha256', $image);
  return 'meta||' . strtolower(trim((string)($item['title'] ?? ''))) . '||' . strtolower(trim((string)($item['category'] ?? '')));
}
function uniqueGallery(array $gallery): array {
  $seen = [];
  $unique = [];
  foreach ($gallery as $item) {
    if (!is_array($item)) continue;
    $key = galleryKey($item);
    if (isset($seen[$key])) continue;
    $seen[$key] = true;
    $unique[] = $item;
  }
  return $unique;
}
function mergeFeedback(array $incoming, array $current): array {
  $merged = [];
  $seen = [];
  foreach (array_merge($incoming, $current) as $item) {
    if (!is_array($item)) continue;
    $id = trim((string)($item['id'] ?? ''));
    $key = $id !== '' ? 'id:' . $id : 'body:' . hash('sha256', json_encode([
      $item['name'] ?? '', $item['email'] ?? '', $item['message'] ?? '', $item['created'] ?? ''
    ], JSON_UNESCAPED_UNICODE));
    if (isset($seen[$key])) continue;
    $seen[$key] = true;
    $merged[] = $item;
  }
  usort($merged, static fn(array $a, array $b): int => strcmp((string)($b['created'] ?? ''), (string)($a['created'] ?? '')));
  return array_slice($merged, 0, 250);
}

function writeData(string $dir, string $file, array $data): void {
  if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) respond(['ok' => false, 'error' => 'Could not create the server data folder.'], 500);
  $temp = $file . '.tmp';
  $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  if ($json === false || file_put_contents($temp, $json, LOCK_EX) === false || !rename($temp, $file)) {
    @unlink($temp);
    respond(['ok' => false, 'error' => 'Could not save website data. Check PHP folder permissions.'], 500);
  }
}


function safeUploadFolder(string $folder): string {
  return in_array($folder, ['gallery', 'certificates', 'avatars'], true) ? $folder : 'gallery';
}
function uploadImageFile(string $baseDir): array {
  if (empty($_FILES['file']) || !is_array($_FILES['file'])) respond(['ok' => false, 'error' => 'No image file received.'], 400);
  $file = $_FILES['file'];
  if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) respond(['ok' => false, 'error' => 'Image upload failed. Check hosting upload limits.'], 400);
  if (($file['size'] ?? 0) > 12 * 1024 * 1024) respond(['ok' => false, 'error' => 'Image is larger than 12 MB.'], 413);
  $tmp = (string)$file['tmp_name'];
  $finfo = new finfo(FILEINFO_MIME_TYPE);
  $mime = $finfo->file($tmp) ?: '';
  $extensions = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
  if (!isset($extensions[$mime])) respond(['ok' => false, 'error' => 'Unsupported image type. Use JPG, PNG, WebP or GIF.'], 415);
  $folder = safeUploadFolder((string)($_POST['folder'] ?? 'gallery'));
  $dir = $baseDir . DIRECTORY_SEPARATOR . $folder;
  if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) respond(['ok' => false, 'error' => 'Could not create upload folder.'], 500);
  $name = gmdate('Ymd_His') . '_' . bin2hex(random_bytes(8)) . '.' . $extensions[$mime];
  $target = $dir . DIRECTORY_SEPARATOR . $name;
  if (!move_uploaded_file($tmp, $target)) respond(['ok' => false, 'error' => 'Could not save uploaded image. Check folder permissions.'], 500);
  return ['url' => 'uploads/' . $folder . '/' . $name, 'mime' => $mime, 'size' => filesize($target) ?: 0];
}

$action = $_GET['action'] ?? 'data';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') respond(['ok' => true]);

switch ($action) {
  case 'upload_image':
    requireAdmin();
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['ok' => false, 'error' => 'POST required.'], 405);
    $result = uploadImageFile(__DIR__ . DIRECTORY_SEPARATOR . 'uploads');
    respond(['ok' => true] + $result);

  case 'data':
    respond(['ok' => true, 'data' => readData($dataFile), 'updatedAt' => is_file($dataFile) ? gmdate('c', filemtime($dataFile)) : null]);

  case 'session':
    respond(['ok' => true, 'authenticated' => !empty($_SESSION['portfolio_admin'])]);

  case 'login':
    $input = body();
    $username = (string)($input['username'] ?? '');
    $password = (string)($input['password'] ?? '');
    if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
      session_regenerate_id(true);
      $_SESSION['portfolio_admin'] = true;
      respond(['ok' => true]);
    }
    usleep(350000);
    respond(['ok' => false, 'error' => 'Incorrect username or password.'], 401);

  case 'logout':
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
      $p = session_get_cookie_params();
      setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    respond(['ok' => true]);

  case 'save':
    requireAdmin();
    $input = body();
    $incoming = $input['data'] ?? null;
    if (!is_array($incoming)) respond(['ok' => false, 'error' => 'Website data is missing.'], 400);
    withDataLock($dataDir, $lockFile, function () use ($dataDir, $dataFile, $incoming): void {
      $current = readData($dataFile) ?? [];
      // Feedback is intentionally server-owned. General admin saves can never
      // restore or overwrite a feedback entry that was deleted separately.
      unset($incoming['feedback']);
      $merged = array_replace($current, $incoming);
      $merged['feedback'] = isset($current['feedback']) && is_array($current['feedback']) ? $current['feedback'] : [];
      if (isset($merged['gallery']) && is_array($merged['gallery'])) $merged['gallery'] = uniqueGallery($merged['gallery']);
      writeData($dataDir, $dataFile, $merged);
    });
    respond(['ok' => true, 'updatedAt' => gmdate('c')]);

  case 'feedback':
    $input = body();
    $feedback = $input['feedback'] ?? null;
    if (!is_array($feedback)) respond(['ok' => false, 'error' => 'Feedback is missing.'], 400);
    $feedback['id'] = trim((string)($feedback['id'] ?? ''));
    if ($feedback['id'] === '') $feedback['id'] = bin2hex(random_bytes(16));
    $feedback['name'] = trim(substr((string)($feedback['name'] ?? ''), 0, 100));
    $feedback['email'] = trim(substr((string)($feedback['email'] ?? ''), 0, 180));
    $feedback['message'] = trim(substr((string)($feedback['message'] ?? ''), 0, 1500));
    $feedback['created'] = (string)($feedback['created'] ?? gmdate('c'));
    if ($feedback['name'] === '' || $feedback['message'] === '') respond(['ok' => false, 'error' => 'Name and feedback message are required.'], 422);
    withDataLock($dataDir, $lockFile, function () use ($dataDir, $dataFile, $feedback): void {
      $data = readData($dataFile);
      if (!is_array($data)) respond(['ok' => false, 'error' => 'The website has not been initialized by the administrator yet.'], 409);
      $current = isset($data['feedback']) && is_array($data['feedback']) ? $data['feedback'] : [];
      $data['feedback'] = mergeFeedback([$feedback], $current);
      writeData($dataDir, $dataFile, $data);
    });
    respond(['ok' => true]);

  case 'delete_feedback':
    requireAdmin();
    $input = body();
    $id = trim((string)($input['id'] ?? ''));
    if ($id === '') respond(['ok' => false, 'error' => 'Feedback ID is required.'], 422);
    $remaining = [];
    withDataLock($dataDir, $lockFile, function () use ($dataDir, $dataFile, $id, &$remaining): void {
      $data = readData($dataFile) ?? [];
      $feedback = isset($data['feedback']) && is_array($data['feedback']) ? $data['feedback'] : [];
      $found = false;
      $remaining = array_values(array_filter($feedback, static function ($item) use ($id, &$found): bool {
        if (!is_array($item)) return false;
        if ((string)($item['id'] ?? '') === $id) { $found = true; return false; }
        return true;
      }));
      if (!$found) respond(['ok' => false, 'error' => 'Feedback was not found or was already deleted.'], 404);
      $data['feedback'] = $remaining;
      writeData($dataDir, $dataFile, $data);
    });
    respond(['ok' => true, 'feedback' => $remaining]);

  default:
    respond(['ok' => false, 'error' => 'Unknown action.'], 404);
}
