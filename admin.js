const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],clone=x=>JSON.parse(JSON.stringify(x));
const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const EMPTY={
 about:{eyebrow:'Profile',heading:'Building a career at the intersection of <em>cybersecurity</em>, technology and creativity.',paragraphs:['I am a motivated cybersecurity undergraduate at NSBM Green University with a strong foundation in network security, ethical hacking, risk assessment, access control, vulnerability assessment and incident response.','Alongside my technical studies, I create promotional content, photographs and videos for university activities. I enjoy transforming ideas into clear digital experiences, collaborating with teams and continuously improving my technical and communication skills.'],links:[{id:'l1',label:'Email me ↗',url:'mailto:abhishekparindya2007@gmail.com'},{id:'l2',label:'LinkedIn ↗',url:'https://www.linkedin.com/in/abhishek-parindya-326512411/'},{id:'l3',label:'GitHub ↗',url:'https://github.com/abhishekparindya2004'},{id:'l4',label:'Devpost ↗',url:'https://devpost.com/abhishekparindya2007may3?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav'},{id:'l5',label:'Unstop ↗',url:'https://unstop.com/u/abhispar56183'}]},
 projects:[{id:'p1',title:'Red Pulse',meta:'HTML • CSS • JavaScript',description:'Responsive online news platform with category-based sections, modern UI, mobile-friendly layouts and interactive navigation.',url:'https://github.com/abhishekparindya2004',image:''},{id:'p2',title:'Zey-AI',meta:'Artificial Intelligence Project',description:'AI-powered assistant prototype focused on improving user interaction and productivity through an accessible interface.',url:'https://github.com/abhishekparindya2004',image:''},{id:'p3',title:'Citadel',meta:'Cybersecurity / Technology Project',description:'Technology-focused application demonstrating secure development principles and structured project architecture.',url:'https://github.com/abhishekparindya2004',image:''}],
 education:[{id:'e1',period:'2026 — Present',title:'Major in Cyber Security',details:'NSBM Green University • Victoria University affiliated degree'},{id:'e2',period:'2024 — 2025',title:'Information Technology Diploma Level',details:'ESOFT Metro Campus'},{id:'e3',period:'2023',title:'G.C.E. Ordinary Level Examination',details:'Ecole International School, Kandy'},{id:'e4',period:'2017',title:'G.C.E. Scholarship Examination',details:'Gamini Dissanayake College, Hasalaka'}],
 coreSkills:['Project Management','Cybersecurity Fundamentals','Teamwork','Time Management','Leadership','Effective Communication','Critical Thinking','Digital Marketing'],tools:['Java','Python','JavaScript','HTML5','CSS3','SQL','Git','GitHub','VS Code','Microsoft Office','Wireshark','VirtualBox','Linux','Azure SQL'],cyberSkills:['Network Security','Ethical Hacking','Risk Assessment','Access Control','Vulnerability Assessment','Security Fundamentals','Incident Response'],languages:['English — Fluent','Sinhala — Fluent','Tamil — Basic'],
 process:[{id:'s1',number:'01',icon:'⌕',title:'Discover',description:'Understand the goals, audience, risks and success criteria.'},{id:'s2',number:'02',icon:'◇',title:'Plan',description:'Define scope, structure, tools and a practical delivery path.'},{id:'s3',number:'03',icon:'✎',title:'Design',description:'Create clear layouts and secure, user-focused solutions.'},{id:'s4',number:'04',icon:'</>',title:'Build',description:'Develop, test and refine with attention to detail.'},{id:'s5',number:'05',icon:'➤',title:'Deliver',description:'Document, communicate and improve from feedback.'}],
 activities:[{id:'c1',type:'club',title:'NSBM NFORCE Club',meta:'2026 — Present',description:'Content Creator, Photographer & Videographer. Create promotional content, capture event media, edit multimedia and collaborate with the media team.'},{id:'c2',type:'club',title:'NSBM Speakers Club',meta:'2025',description:'Active Member. Participate in public-speaking sessions, communication workshops, competitions and collaborative learning activities.'},{id:'w1',type:'workshop',title:'HackOps Cybersecurity Workshop',meta:'2025 • NSBM Green University',description:''},{id:'w2',type:'workshop',title:'Cybersecurity Awareness Workshop',meta:'2025 • NSBM Green University',description:''},{id:'w3',type:'workshop',title:'AI Puppet Master Workshop',meta:'2024 • ESOFT Metro Campus',description:''}],
 approach:{quote:'Good security is not only about stopping threats. It is also about creating systems people can trust.',signature:'Abhishek'},
 achievements:[{id:'a1',year:'2025',title:'Speech Olympics',details:'Semi-finalist • NSBM Green University',certificateUrl:'',certificateData:''},{id:'a2',year:'2024',title:'AI Puppet Master Certification',details:'Participation • ESOFT Metro Campus',certificateUrl:'',certificateData:''},{id:'a3',year:'2023',title:'Inter-School Basketball Championship',details:'Second place • Ecole International School',certificateUrl:'',certificateData:''},{id:'a4',year:'2017',title:'Inter-School Chess Tournament',details:'Second place • Sri Sumangala College, Kandy',certificateUrl:'',certificateData:''}],gallery:[],feedback:[],
 contact:{heading:'LET’S BUILD\nSOMETHING <em>SECURE.</em>',intro:'I’m open to cybersecurity internships, collaborative projects, creative media work and opportunities where I can learn, contribute and grow.',buttonText:'Start a conversation',email:'abhishekparindya2007@gmail.com',phone1:'+94 76 224 2905',phone2:'+94 77 824 8434',location:'274, Ampitiya, Kandy, Sri Lanka',links:[]},
 settings:{quote:'“Security is strongest when thoughtful design and responsible technology work together.”',intro:'I combine cybersecurity knowledge, creative media and web development to build secure, useful and visually engaging digital experiences.',projectSuffix:'+'}
};
function mergeData(raw={}){return {...clone(EMPTY),...raw,about:{...clone(EMPTY.about),...(raw.about||{})},approach:{...clone(EMPTY.approach),...(raw.approach||{})},contact:{...clone(EMPTY.contact),...(raw.contact||{})},settings:{...clone(EMPTY.settings),...(raw.settings||{})}}}
let data=clone(EMPTY);
async function saveData(){
  const snapshot=clone(data);
  delete snapshot.feedback;
  try{
    await PortfolioAPI.saveData(snapshot);
    const remote=await PortfolioAPI.getData();
    data=mergeData(remote||data);
    renderAdmin();
    showSaveStatus('Saved to the shared website on every device.','success');
  }catch(err){
    await syncFromServer(false);
    showSaveStatus('Not saved: '+err.message,'error');
    alert('The update was not saved to the website. '+err.message);
    throw err;
  }
}
function showSaveStatus(message,type='success'){
  let el=document.querySelector('#sharedSaveStatus');
  if(!el){el=document.createElement('div');el.id='sharedSaveStatus';el.style.cssText='position:fixed;right:18px;bottom:18px;z-index:9999;padding:12px 16px;border-radius:10px;background:#111;color:#fff;box-shadow:0 8px 30px rgba(0,0,0,.25);max-width:360px';document.body.appendChild(el)}
  el.textContent=message;el.style.background=type==='error'?'#8b1e1e':'#166534';el.hidden=false;clearTimeout(el._timer);el._timer=setTimeout(()=>el.hidden=true,3500)
}
function fileToData(file){return new Promise((res,rej)=>{if(!file)return res('');const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}

async function prepareGalleryImage(file){
  if(!file)return null;
  const allowed=['image/jpeg','image/png','image/webp','image/gif'];
  if(!allowed.includes(file.type))throw new Error('Please use JPG, PNG, WebP or GIF. Convert HEIC images before uploading.');
  if(file.size>12*1024*1024)throw new Error('Image is too large. Maximum size is 12 MB.');
  if(file.type==='image/gif'||file.size<1500000)return file;
  const bitmap=await createImageBitmap(file);
  const max=1800,scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
  canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
  const blob=await new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error('Could not process image.')),'image/webp',.86));
  return new File([blob],(file.name.replace(/\.[^.]+$/,'')||'gallery')+'.webp',{type:'image/webp'});
}

function showAdmin(){$('#adminLogin').hidden=true;$('#adminDashboard').hidden=false;renderAdmin()}
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(e.target),button=e.target.querySelector('button');button.disabled=true;$('#loginError').textContent='';try{await PortfolioAPI.login(fd.get('username'),fd.get('password'));showAdmin();await syncFromServer(true)}catch(err){$('#loginError').textContent=err.message||'Incorrect username or password.'}finally{button.disabled=false}});
async function syncFromServer(seedIfEmpty=false){
  try{
    const remote=await PortfolioAPI.getData();
    if(remote){data=mergeData(remote);removeGalleryDuplicates();renderAdmin()}
    else if(seedIfEmpty){await PortfolioAPI.saveData(data);renderAdmin()}
  }catch(err){console.error('Shared data sync failed:',err);showSaveStatus('Cannot connect to shared storage: '+err.message,'error')}
}
(async()=>{try{const status=await PortfolioAPI.session();if(status.authenticated){showAdmin();await syncFromServer(true)}}catch(err){console.error(err)}})();
$('#logoutAdmin').onclick=async()=>{try{await PortfolioAPI.logout()}catch{}$('#adminDashboard').hidden=true;$('#adminLogin').hidden=false};function goToPortfolio(e){e?.preventDefault();window.location.href='./index.html'}$$('.portfolio-nav').forEach(link=>link.addEventListener('click',goToPortfolio));$$('.admin-tabs button').forEach(b=>b.onclick=()=>{$$('.admin-tabs button').forEach(x=>x.classList.remove('active'));$$('.admin-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.tab).classList.add('active')});
function item(id,title,sub,type){return `<div class="admin-item"><div><h4>${esc(title)}</h4><p>${esc(sub||'')}</p></div><div class="admin-actions"><button data-edit-type="${type}" data-id="${id}">Edit</button><button class="delete" data-delete-type="${type}" data-id="${id}">Delete</button></div></div>`}
function renderAdmin(){if(!$('#adminMetrics'))return;const counts=[['About links',data.about.links.length],['Projects',data.projects.length],['Education',data.education.length],['Skills',data.coreSkills.length+data.tools.length+data.cyberSkills.length+data.languages.length],['Approach items',data.process.length+data.activities.length],['Achievements',data.achievements.length],['Gallery',data.gallery.length],['Feedback',data.feedback.length]];$('#adminMetrics').innerHTML=counts.map(([n,v])=>`<div class="metric"><strong>${v}</strong><span>${n}</span></div>`).join('');
 $('#adminAboutLinkList').innerHTML=data.about.links.map(x=>item(x.id,x.label,x.url,'aboutLink')).join('')||'<div class="empty-state">No links.</div>';
 $('#adminProjectList').innerHTML=data.projects.map(x=>item(x.id,x.title,x.meta,'project')).join('')||'<div class="empty-state">No projects.</div>';
 $('#adminEducationList').innerHTML=data.education.map(x=>item(x.id,x.title,`${x.period} • ${x.details}`,'education')).join('')||'<div class="empty-state">No education records.</div>';
 const skills=[];[['coreSkills','Core skill'],['tools','Tool'],['cyberSkills','Cybersecurity'],['languages','Language']].forEach(([cat,label])=>(data[cat]||[]).forEach((v,i)=>skills.push(item(`${cat}:${i}`,v,label,'skill'))));$('#adminSkillList').innerHTML=skills.join('')||'<div class="empty-state">No skills.</div>';
 $('#adminProcessList').innerHTML=data.process.map(x=>item(x.id,`${x.number} ${x.title}`,x.description,'process')).join('')||'<div class="empty-state">No process steps.</div>';
 $('#adminActivityList').innerHTML=data.activities.map(x=>item(x.id,x.title,`${x.type} • ${x.meta}`,'activity')).join('')||'<div class="empty-state">No activities.</div>';
 $('#adminAchievementList').innerHTML=data.achievements.map(x=>item(x.id,x.title,`${x.year} • ${x.details}`,'achievement')).join('')||'<div class="empty-state">No achievements.</div>';
 $('#adminGalleryList').innerHTML=data.gallery.map(x=>item(x.id,x.title,x.category,'gallery')).join('')||'<div class="empty-state">No gallery items.</div>';
 $('#adminFeedbackList').innerHTML=data.feedback.map(x=>item(x.id,x.name,`${x.category} • ${x.rating}/5 • ${x.message}`,'feedback')).join('')||'<div class="empty-state">No feedback.</div>';
 $('#adminContactLinkList').innerHTML=data.contact.links.map(x=>item(x.id,x.label,x.url,'contactLink')).join('')||'<div class="empty-state">No extra contact links.</div>';
 fillStaticForms();attachButtons()}
function fillStaticForms(){let f=$('#aboutForm');f.eyebrow.value=data.about.eyebrow;f.heading.value=data.about.heading;f.paragraphs.value=data.about.paragraphs.join('\n');f=$('#approachSettingsForm');f.quote.value=data.approach.quote;f.signature.value=data.approach.signature;f=$('#contactForm');Object.keys(data.contact).forEach(k=>{if(f.elements[k]&&typeof data.contact[k]==='string')f.elements[k].value=data.contact[k]})}
function attachButtons(){$$('[data-edit-type]').forEach(b=>b.onclick=()=>editItem(b.dataset.editType,b.dataset.id));$$('[data-delete-type]').forEach(b=>b.onclick=()=>deleteItem(b.dataset.deleteType,b.dataset.id))}
function upsert(arr,obj){const i=arr.findIndex(x=>x.id===obj.id);if(i>=0)arr[i]=obj;else arr.push(obj)}
async function deleteItem(type,id){
 if(type==='feedback'){
  const selected=data.feedback.find(x=>String(x.id)===String(id));
  if(!confirm(`Delete ${selected?.name||'this visitor'}'s feedback? It will be removed from the public index page too.`))return;
  try{
    await PortfolioAPI.deleteFeedback(id);
    await syncFromServer(false);
    showSaveStatus('Feedback permanently deleted from admin and index.','success');
  }catch(err){
    showSaveStatus('Delete failed: '+err.message,'error');
    alert('The feedback was not deleted. '+err.message);
  }
  return;
 }
 if(!confirm('Delete this item?'))return;
 if(type==='skill'){const [cat,i]=id.split(':');data[cat].splice(Number(i),1)}else{const map={aboutLink:['about','links'],project:['projects'],education:['education'],process:['process'],activity:['activities'],achievement:['achievements'],gallery:['gallery'],contactLink:['contact','links']},p=map[type];if(!p)return;if(p.length===1)data[p[0]]=data[p[0]].filter(x=>x.id!==id);else data[p[0]][p[1]]=data[p[0]][p[1]].filter(x=>x.id!==id)}
 await saveData();
}
function setForm(formId,obj){const f=$(formId);Object.entries(obj).forEach(([k,v])=>{if(f.elements[k])f.elements[k].value=v??''});f.scrollIntoView({behavior:'smooth',block:'start'})}
function editItem(type,id){const maps={aboutLink:['#aboutLinkForm',data.about.links],project:['#projectAdminForm',data.projects],education:['#educationForm',data.education],process:['#processForm',data.process],activity:['#activityForm',data.activities],achievement:['#achievementAdminForm',data.achievements],gallery:['#galleryAdminForm',data.gallery],feedback:['#feedbackAdminForm',data.feedback],contactLink:['#contactLinkForm',data.contact.links]};if(type==='skill'){const [category,i]=id.split(':');setForm('#skillForm',{id,category,value:data[category][Number(i)]});return}const [form,arr]=maps[type];setForm(form,arr.find(x=>x.id===id))}
function fdObj(form){return Object.fromEntries(new FormData(form).entries())}
$('#aboutForm').onsubmit=e=>{e.preventDefault();const o=fdObj(e.target);data.about.eyebrow=o.eyebrow;data.about.heading=o.heading;data.about.paragraphs=o.paragraphs.split('\n').map(x=>x.trim()).filter(Boolean);saveData()};
$('#aboutLinkForm').onsubmit=e=>{e.preventDefault();const o=fdObj(e.target);upsert(data.about.links,{id:o.id||crypto.randomUUID(),label:o.label,url:o.url});e.target.reset();saveData()};
$('#projectAdminForm').onsubmit=async e=>{
 e.preventDefault();
 const form=e.target,button=form.querySelector('button'),original=button.textContent;
 button.disabled=true;button.textContent='Saving cover…';
 try{
  const o=fdObj(form),old=data.projects.find(x=>x.id===o.id)||{},file=$('#projectCoverFile')?.files[0];
  let image=(o.image||old.image||'').trim();
  if(file){const processed=await prepareGalleryImage(file);const uploaded=await PortfolioAPI.uploadImage(processed,'projects');image=uploaded.url}
  upsert(data.projects,{id:o.id||crypto.randomUUID(),title:o.title,meta:o.meta,description:o.description,url:o.url,image});
  form.reset();await saveData();
 }catch(err){showSaveStatus('Project cover could not be saved: '+err.message,'error')}finally{button.disabled=false;button.textContent=original}
};
$('#educationForm').onsubmit=e=>{e.preventDefault();const o=fdObj(e.target);upsert(data.education,{id:o.id||crypto.randomUUID(),period:o.period,title:o.title,details:o.details});e.target.reset();saveData()};
$('#skillForm').onsubmit=e=>{e.preventDefault();const o=fdObj(e.target);if(o.id){const [cat,i]=o.id.split(':');data[cat].splice(Number(i),1);if(cat===o.category)data[o.category].splice(Number(i),0,o.value);else data[o.category].push(o.value)}else data[o.category].push(o.value);e.target.reset();saveData()};
$('#processForm').onsubmit=e=>{e.preventDefault();const o=fdObj(e.target);upsert(data.process,{id:o.id||crypto.randomUUID(),number:o.number,icon:o.icon,title:o.title,description:o.description});e.target.reset();saveData()};
$('#activityForm').onsubmit=e=>{e.preventDefault();const o=fdObj(e.target);upsert(data.activities,{id:o.id||crypto.randomUUID(),type:o.type,title:o.title,meta:o.meta,description:o.description});e.target.reset();saveData()};
$('#approachSettingsForm').onsubmit=e=>{e.preventDefault();const o=fdObj(e.target);data.approach={quote:o.quote,signature:o.signature};saveData()};
$('#achievementAdminForm').onsubmit=async e=>{e.preventDefault();const o=fdObj(e.target),old=data.achievements.find(x=>x.id===o.id)||{},file=$('#certificateFile').files[0];upsert(data.achievements,{id:o.id||crypto.randomUUID(),year:o.year,title:o.title,details:o.details,certificateUrl:o.certificateUrl,certificateData:file?await fileToData(file):(old.certificateData||'')});data.achievements.sort((a,b)=>String(b.year).localeCompare(String(a.year)));e.target.reset();saveData()};
let gallerySaving=false;
function galleryFingerprint(item={}){const image=String(item.image||'').trim();return image?'image||'+image:['meta',String(item.title||'').trim().toLowerCase(),String(item.category||'').trim().toLowerCase()].join('||')}
function removeGalleryDuplicates(){const seen=new Set();data.gallery=(data.gallery||[]).filter(item=>{const key=galleryFingerprint(item);if(seen.has(key))return false;seen.add(key);return true})}
$('#galleryAdminForm').onsubmit=async e=>{
  e.preventDefault();
  if(gallerySaving)return;
  gallerySaving=true;
  const form=e.target,button=form.querySelector('button[type="submit"],button:not([type])'),originalText=button?.textContent||'';
  if(button){button.disabled=true;button.textContent='Uploading…'}
  try{
    const o=fdObj(form),existing=data.gallery.find(x=>x.id===o.id)||{},file=$('#galleryFile').files[0];
    let image=(o.image||existing.image||'').trim();
    if(file){
      const processed=await prepareGalleryImage(file);
      const uploaded=await PortfolioAPI.uploadImage(processed,'gallery');
      image=uploaded.url;
    }
    const item={id:o.id||crypto.randomUUID(),title:o.title.trim(),category:o.category.trim(),description:(o.description||'').trim(),technologies:(o.technologies||'').trim(),url:(o.url||'').trim(),image,created:existing.created||new Date().toISOString()};
    const duplicate=data.gallery.find(x=>x.id!==item.id&&galleryFingerprint(x)===galleryFingerprint(item));
    if(duplicate){showSaveStatus('This image is already in the gallery.','error');return}
    upsert(data.gallery,item);
    removeGalleryDuplicates();
    await saveData();
    form.reset();
  }catch(err){console.error(err)}finally{
    gallerySaving=false;
    if(button){button.disabled=false;button.textContent=originalText}
  }
};
$('#feedbackAdminForm').onsubmit=async e=>{
  e.preventDefault();
  const o=fdObj(e.target);
  const existing=data.feedback.find(x=>x.id===o.id);
  const feedback={
    id:o.id||crypto.randomUUID(),
    name:(o.name||'').trim(),
    email:(o.email||'').trim(),
    category:(o.category||'').trim(),
    rating:o.rating,
    message:(o.message||'').trim(),
    avatar:(o.avatar||'').trim(),
    created:existing?.created||new Date().toISOString()
  };
  if (!feedback.name || !feedback.message) {
    showSaveStatus('Name and message are required to save feedback.','error');
    return;
  }
  const button=e.target.querySelector('button');
  if(button)button.disabled=true;
  try{
    await PortfolioAPI.addFeedback(feedback);
    await syncFromServer(false);
    e.target.reset();
    showSaveStatus(existing ? 'Feedback updated successfully.' : 'Feedback added successfully.','success');
  }catch(err){
    showSaveStatus('Feedback save failed: '+err.message,'error');
    alert('Could not save feedback. '+err.message);
  }finally{
    if(button)button.disabled=false;
  }
};
$('#contactForm').onsubmit=e=>{e.preventDefault();const o=fdObj(e.target);data.contact={...data.contact,...o};saveData()};
$('#contactLinkForm').onsubmit=e=>{e.preventDefault();const o=fdObj(e.target);upsert(data.contact.links,{id:o.id||crypto.randomUUID(),label:o.label,url:o.url});e.target.reset();saveData()};
$('#exportReport').onclick=async()=>{
 const button=$('#exportReport');button.disabled=true;button.textContent='Preparing PDF…';
 try{
  await syncFromServer(false);
  if(!window.jspdf?.jsPDF)throw new Error('PDF library could not load. Check the internet connection and try again.');
  const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'mm',format:'a4'});let y=18,page=1;
  const margin=16,width=178,line=6;
  const footer=()=>{doc.setFontSize(8);doc.setTextColor(120);doc.text(`Abhishek Parindya Portfolio Report • Page ${page}`,105,292,{align:'center'});doc.setTextColor(0)};
  const ensure=(needed=12)=>{if(y+needed>282){footer();doc.addPage();page++;y=18}};
  const title=(text)=>{ensure(16);doc.setFont('helvetica','bold');doc.setFontSize(16);doc.text(text,margin,y);y+=9;doc.setDrawColor(190);doc.line(margin,y-3,194,y-3)};
  const text=(value,indent=0)=>{const lines=doc.splitTextToSize(String(value||'—'),width-indent);ensure(lines.length*line+2);doc.setFont('helvetica','normal');doc.setFontSize(10);doc.text(lines,margin+indent,y);y+=lines.length*line+2};
  const entry=(heading,body)=>{ensure(14);doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text(String(heading||'Untitled'),margin,y);y+=6;if(body)text(body,3)};
  doc.setFont('helvetica','bold');doc.setFontSize(22);doc.text('ABHISHEK PARINDYA',margin,y);y+=9;doc.setFontSize(14);doc.text('Complete Portfolio Website Report',margin,y);y+=8;doc.setFont('helvetica','normal');doc.setFontSize(10);doc.text(`Generated: ${new Date().toLocaleString()}`,margin,y);y+=12;
  title('Website Summary');text(`Projects: ${data.projects.length} | Education records: ${data.education.length} | Gallery items: ${data.gallery.length} | Feedback entries: ${data.feedback.length}`);
  title('01 / About');entry(data.about.eyebrow,data.about.heading.replace(/<[^>]+>/g,''));(data.about.paragraphs||[]).forEach(p=>text(p));(data.about.links||[]).forEach(x=>entry(x.label,x.url));
  title('02 / Selected Projects');(data.projects||[]).forEach(x=>entry(`${x.title} — ${x.meta}`,`${x.description}${x.url?`\nLink: ${x.url}`:''}${x.image?`\nImage: ${x.image}`:''}`));
  title('03 / Education & Skills');(data.education||[]).forEach(x=>entry(`${x.period} — ${x.title}`,x.details));entry('Core skills',(data.coreSkills||[]).join(', '));entry('Tools',(data.tools||[]).join(', '));entry('Cybersecurity skills',(data.cyberSkills||[]).join(', '));entry('Languages',(data.languages||[]).join(', '));
  title('04 / My Approach');text(data.approach.quote);(data.process||[]).forEach(x=>entry(`${x.number} ${x.title}`,x.description));(data.activities||[]).forEach(x=>entry(`${x.title} — ${x.meta}`,x.description||x.type));
  title('05 / Learning Beyond the Classroom');(data.achievements||[]).forEach(x=>entry(`${x.year} — ${x.title}`,`${x.details}${x.certificateUrl?`\nCertificate: ${x.certificateUrl}`:''}`));
  title('06 / Project Gallery');(data.gallery||[]).forEach(x=>entry(`${x.title} — ${x.category}`,`${x.description||'No description'}${x.technologies?`\nTechnologies: ${x.technologies}`:''}${x.url?`\nProject link: ${x.url}`:''}${x.image?`\nImage source: ${String(x.image).startsWith('data:')?'Uploaded image stored in website':x.image}`:''}`));
  title('07 / Community Feedback');(data.feedback||[]).forEach(x=>entry(`${x.name} — ${x.category||'Feedback'} — ${x.rating||0}/5`,`${x.message}${x.email?`\nEmail: ${x.email}`:''}${x.created?`\nDate: ${new Date(x.created).toLocaleString()}`:''}`));
  title('08 / Contact');entry('Heading',String(data.contact.heading||'').replace(/<[^>]+>/g,' ').replace(/\n/g,' '));text(data.contact.intro);entry('Email',data.contact.email);entry('Phone',`${data.contact.phone1||''}${data.contact.phone2?` / ${data.contact.phone2}`:''}`);entry('Location',data.contact.location);(data.contact.links||[]).forEach(x=>entry(x.label,x.url));
  footer();doc.save(`Abhishek_Portfolio_Report_${new Date().toISOString().slice(0,10)}.pdf`);showSaveStatus('Complete website report downloaded as PDF.','success');
 }catch(err){showSaveStatus(err.message,'error');alert(err.message)}finally{button.disabled=false;button.textContent='Export report'}
};

setInterval(()=>{PortfolioAPI.session().then(s=>{if(s.authenticated)syncFromServer(false)}).catch(()=>{})},10000);
