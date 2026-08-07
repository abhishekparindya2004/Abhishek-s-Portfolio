/* Shared website storage: keeps every phone/computer synchronized through api.php. */
window.PortfolioAPI = (() => {
  const endpoint = new URL('api.php', document.baseURI).href;
  async function request(action, options = {}) {
    const isForm = options.body instanceof FormData;
    const response = await fetch(`${endpoint}?action=${encodeURIComponent(action)}`, {
      credentials: 'same-origin',
      cache: 'no-store',
      ...options,
      headers: isForm ? (options.headers || {}) : { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    let payload = {};
    try { payload = await response.json(); } catch (_) {}
    if (!response.ok || payload.ok === false) throw new Error(payload.error || `Server error (${response.status})`);
    return payload;
  }
  return {
    async getData() { return (await request('data')).data || null; },
    async login(username, password) {
      return request('login', { method: 'POST', body: JSON.stringify({ username, password }) });
    },
    async logout() { return request('logout', { method: 'POST', body: '{}' }); },
    async session() { return request('session'); },
    async saveData(data, preserveServerFeedback = true) { return request('save', { method: 'POST', body: JSON.stringify({ data, preserveServerFeedback }) }); },
    async addFeedback(feedback) { return request('feedback', { method: 'POST', body: JSON.stringify({ feedback }) }); },
    async deleteFeedback(id) { return request('delete_feedback', { method: 'POST', body: JSON.stringify({ id }) }); },
    async uploadImage(file, folder = 'gallery') {
      const form = new FormData();
      form.append('file', file, file.name || 'image.jpg');
      form.append('folder', folder);
      return request('upload_image', { method: 'POST', body: form });
    }
  };
})();
