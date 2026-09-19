/* ══════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════ */
const canvas=document.getElementById('bg-canvas'),ctx=canvas.getContext('2d');
const calmMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let W,H,pts=[];
function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight}
function mkP(){return{x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+.5,a:Math.random()*.5+.1}}
resize();for(let i=0;i<110;i++)pts.push(mkP());
function drawBg(){
  ctx.clearRect(0,0,W,H);
  pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(0,212,255,${p.a})`;ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1});
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(0,212,255,${.05*(1-d/120)})`;ctx.lineWidth=.5;ctx.stroke()}}
  if(!calmMotion.matches) requestAnimationFrame(drawBg);
}
drawBg();window.addEventListener('resize',resize);

/* ══════════════════════════════════
   CURSOR
══════════════════════════════════ */
const cur=document.getElementById('cursor'),fol=document.getElementById('cursor-follower');
let mx=0,my=0,fx=0,fy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx-6}px,${my-6}px)`});
(function af(){fx+=(mx-fx-18)*.12;fy+=(my-fy-18)*.12;fol.style.transform=`translate(${fx}px,${fy}px)`;if(!calmMotion.matches)requestAnimationFrame(af)})();
document.querySelectorAll('a,button,.cert-arrow,.quick-q,.cert-dot,.cert-card,.cert-modal-close').forEach(el=>{el.addEventListener('mouseenter',()=>{fol.style.width='56px';fol.style.height='56px'});el.addEventListener('mouseleave',()=>{fol.style.width='36px';fol.style.height='36px'})});

const hero=document.getElementById('hero');
const heroGlow=document.getElementById('hero-pointer-glow');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(hero && !reduceMotion){
  hero.addEventListener('mousemove',event=>{
    const rect=hero.getBoundingClientRect();
    const x=event.clientX-rect.left;
    const y=event.clientY-rect.top;
    hero.style.setProperty('--hero-glow-x', `${x}px`);
    hero.style.setProperty('--hero-glow-y', `${y}px`);

    const rx=(x/rect.width-.5);
    const ry=(y/rect.height-.5);
    hero.style.setProperty('--hero-pan-x', `${rx*14}px`);
    hero.style.setProperty('--hero-pan-y', `${ry*14}px`);
  });

  hero.addEventListener('mouseleave',()=>{
    if(heroGlow){
      hero.style.setProperty('--hero-glow-x','55vw');
      hero.style.setProperty('--hero-glow-y','45vh');
    }
    hero.style.setProperty('--hero-pan-x','0px');
    hero.style.setProperty('--hero-pan-y','0px');
  });
}

/* ══════════════════════════════════
   SCROLL PROGRESS
══════════════════════════════════ */
const pb=document.getElementById('progress-bar');
window.addEventListener('scroll',()=>{pb.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'});

/* ══════════════════════════════════
   INTERSECTION OBSERVERS
══════════════════════════════════ */
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible')}),{threshold:.15});
document.querySelectorAll('.section-header,.skill-card,.profile-card,.project-card,.timeline-item,.contact-info-item,.social-link').forEach(el=>io.observe(el));
const aboutObs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){const r=document.getElementById('about-av-side'),t=document.getElementById('about-txt');if(r){r.style.opacity='1';r.style.transform='none'}if(t){t.style.opacity='1';t.style.transform='none'}startAboutCycle()}}),{threshold:.15});
const as=document.getElementById('about');if(as)aboutObs.observe(as);

/* ══════════════════════════════════
   TYPED HERO TEXT
══════════════════════════════════ */
const words=['Software Developer','Web Developer','DevOps Enthusiast','Full-Stack Learner'];
let wI=0,cI=0,del=false;
const typedEl=document.getElementById('hero-typed');
function type(){const base='Career-focused ';const suf=' building responsive web apps, platform skills, and deployment-ready projects.';const w=words[wI];if(!del){typedEl.innerHTML=base+`<span style="color:var(--accent)">${w.slice(0,cI)}<span style="border-right:2px solid var(--accent)"> </span></span>`+suf;cI++;if(cI>w.length){del=true;setTimeout(type,1600);return}}else{typedEl.innerHTML=base+`<span style="color:var(--accent)">${w.slice(0,cI)}<span style="border-right:2px solid var(--accent)"> </span></span>`+suf;cI--;if(cI<0){del=false;wI=(wI+1)%words.length;cI=0}}setTimeout(type,del?55:95)}
if(typedEl){
  if(calmMotion.matches) typedEl.textContent='Career-focused Software Developer building responsive web apps, platform skills, and deployment-ready projects.';
  else setTimeout(type,1800);
}

/* ══════════════════════════════════
   PORTFOLIO KNOWLEDGE BASE
══════════════════════════════════ */
const portfolioData={
  name:'M. Kathiravan',
  preferredName:'Kathiravan',
  role:'Software Developer',
  location:'Ariyalur, Tamil Nadu, India',
  phone:'+91 9092356332',
  email:'kathiravan12082004@gmail.com',
  github:'https://github.com/kathiravan-sk',
  linkedin:'https://linkedin.com/in/m-kathiravan-b67a30297',
  instagram:'https://instagram.com/mr.mickey.12',
  education:[
    'B.E. Computer Science & Engineering — Mahendra Engineering College, Namakkal (2023–2027)',
    'Higher Secondary — Govt. Higher Secondary School, Keelapalur (2022–2023) — 85.5%',
    'Secondary School — Govt. Higher Secondary School, Keelapalur (2020–2021) — 95%'
  ],
  skills:['C','Java','C++','Python','HTML','CSS','JavaScript','React','Next.js','Node.js','Tailwind CSS','MongoDB','MySQL','Git','GitHub','VS Code','Vibe Coding','Prompt Engineering','Data Structures','Algorithms','OOP','OS','AWS basics'],
  interests:['Web Development','Artificial Intelligence','Machine Learning','Full-Stack Development','Cybersecurity'],
  projects:[
    {name:'Fire Fighting Robot',description:'An autonomous robot designed to detect fire, navigate toward it, and extinguish it using sensors and a water-spraying mechanism.'},
    {name:'Portfolio Website',description:'A modern personal portfolio website built with HTML, CSS, JavaScript, and interactive UI elements.'}
  ],
  internships:['ServiceNow Virtual Internship Program','Salesforce Developer with Agentblazer Champion Program','Infosys Internship 6.0 HireHelper','Deloitte Technology Job Simulation'],
  certifications:['Introduction to Artificial Intelligence','Salesforce Developer with Agentblazer Champion Program','MongoDB Basics for Students','Deloitte Technology Job Simulation','NPTEL Cloud Computing','NPTEL IoT','NPTEL Programming In Java'],
  careerGoal:'Currently seeking software developer, full-stack developer, AI/ML, internship, and graduate opportunities.',
  achievement:'Runner-up in the Inter-School Chess Competition.'
};

const assistantState={
  conversation:[],
  lastProject:null,
  voiceMuted:false,
  isBusy:false,
  lastAnswer:''
};

function getTimeGreeting(){
  const hour=new Date().getHours();
  if(hour>=5&&hour<=11) return 'Good morning';
  if(hour>=12&&hour<=16) return 'Good afternoon';
  if(hour>=17&&hour<=20) return 'Good evening';
  return 'Good night';
}

function buildIntroMessage(){
  const greeting=getTimeGreeting();
  return `${greeting}! Welcome to Kathiravan's portfolio. I'm Kathiravan's AI assistant. How can I help you today?`;
}

function setBubble(state,label,text){
  const bubbleLabel=document.getElementById('bubble-label');
  const bubbleText=document.getElementById('bubble-text');
  if(bubbleLabel) bubbleLabel.textContent=label;
  if(bubbleText) bubbleText.textContent=text;
  const ab=document.getElementById('about-speech');
  if(ab && text && !ab.hasAttribute('data-rotating-caption')) ab.textContent=text.length>80?text.slice(0,80)+'…':text;
  const stateMap={idle:'', listening:'listening', thinking:'thinking', talking:'talking'};
  const bubble=document.getElementById('speech-bubble');
  if(bubble){
    bubble.classList.remove('idle','listening','thinking','talking');
    if(stateMap[state]) bubble.classList.add(stateMap[state]);
  }
}

function setAssistantState(state){
  const bubble=document.getElementById('speech-bubble');
  if(bubble){ bubble.classList.remove('idle','listening','thinking','talking'); if(state) bubble.classList.add(state); }
  const avatar=document.getElementById('av-face');
  const ring=document.getElementById('av-ring');
  const status=document.getElementById('av-status');
  if(avatar) avatar.className='avatar-img-wrap '+(state||'idle');
  if(ring) ring.className='avatar-ring '+(state||'idle');
  if(status) status.className='avatar-status '+(state||'idle');
}

function showWelcomeWelcomeOnce(){
  const key='mkAssistantWelcomeShown';
  const alreadyShown=sessionStorage.getItem(key);
  const intro=buildIntroMessage();
  setBubble('idle','MK says',intro);
  if(!alreadyShown){
    sessionStorage.setItem(key,'true');
  }
}

const projectTrack=document.getElementById('project-track');
const projectDots=document.querySelectorAll('.project-dot');
const projectArrows=document.querySelectorAll('.project-arrow');

function scrollProjects(dir){
  if(!projectTrack){return}
  const firstCard=projectTrack.querySelector('.project-card');
  if(!firstCard){return}
  const gap=parseFloat(getComputedStyle(projectTrack).gap)||24;
  projectTrack.scrollBy({left:dir*(firstCard.offsetWidth+gap),behavior:'smooth'});
}

function updateProjectDots(){
  if(!projectTrack||!projectDots.length){return}
  const cards=[...projectTrack.querySelectorAll('.project-card')];
  if(!cards.length){return}
  const trackLeft=projectTrack.getBoundingClientRect().left;
  let closestIndex=0,closestDistance=Infinity;

  cards.forEach((card,index)=>{
    const distance=Math.abs(card.getBoundingClientRect().left-trackLeft);
    if(distance<closestDistance){closestDistance=distance;closestIndex=index;}
  });

  projectDots.forEach((dot,index)=>dot.classList.toggle('active',index===closestIndex));
}

if(projectTrack){
  projectTrack.addEventListener('scroll',updateProjectDots,{passive:true});
  projectTrack.addEventListener('pointerdown',e=>{
    projectTrack.dataset.dragging='true';
    projectTrack.dataset.startX=String(e.clientX);
    projectTrack.dataset.startScrollLeft=String(projectTrack.scrollLeft);
  });
  projectTrack.addEventListener('pointermove',e=>{
    if(projectTrack.dataset.dragging!=='true'){return}
    const startX=Number(projectTrack.dataset.startX||0);
    const startScrollLeft=Number(projectTrack.dataset.startScrollLeft||0);
    projectTrack.scrollLeft=startScrollLeft-(e.clientX-startX);
  });
  ['pointerup','pointerleave','pointercancel'].forEach(type=>{
    projectTrack.addEventListener(type,()=>{
      projectTrack.dataset.dragging='false';
      updateProjectDots();
    });
  });
}

projectArrows.forEach(button=>{
  button.addEventListener('click',()=>scrollProjects(Number(button.dataset.dir||1)));
});

projectDots.forEach((dot,index)=>{
  dot.addEventListener('click',()=>{
    const cards=[...document.querySelectorAll('#project-track .project-card')];
    const target=cards[index];
    if(target){target.scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});}
  });
});

function normalizeQuestion(raw){
  return String(raw||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}

function isMentionOfProject(input, projectName){
  const q=normalizeQuestion(input);
  const name=normalizeQuestion(projectName);
  return q.includes(name) || (projectName==='Fire Fighting Robot' && (q.includes('fire fighting robot')||q.includes('robot')));
}

function generateLocalAnswer(question, conversation=[]){
  const q=normalizeQuestion(question);
  const fallback=`I don't have that information in Kathiravan's portfolio. You can contact Kathiravan directly if you'd like to know more.`;
  if(!q) return fallback;

  if(q.includes('who is kathiravan')||q.includes('who are you')||q.includes('tell me about kathiravan')){
    return `${portfolioData.name} is a ${portfolioData.role} passionate about web development, artificial intelligence, and practical digital solutions.`;
  }

  if(q.includes('what are his skills')||q.includes('what technologies')||q.includes('what skills')||q.includes('skills')){
    return `Kathiravan works with ${portfolioData.skills.slice(0,12).join(', ')}, and is especially interested in ${portfolioData.interests.join(', ')}.`;
  }

  if(q.includes('projects')||q.includes('project')||q.includes('work')){
    const projectSummary=portfolioData.projects.map(p=>p.name).join(', ');
    assistantState.lastProject = portfolioData.projects[0].name;
    return `Kathiravan has worked on ${projectSummary}. His notable project is the Fire Fighting Robot, which is an autonomous robot designed to detect and extinguish fire using sensors and a water-spraying mechanism.`;
  }

  if((q.includes('first one')||q.includes('first project')||q.includes('first item')) && assistantState.lastProject){
    const project = portfolioData.projects.find(p => p.name === assistantState.lastProject) || portfolioData.projects[0];
    return `${project.name}: ${project.description}`;
  }

  if(q.includes('open to opportunities')||q.includes('looking for')||q.includes('job')||q.includes('opportunities')||q.includes('internship')){
    return `Yes. Kathiravan is currently open to software development, full-stack development, AI/ML, internship, and graduate opportunities.`;
  }

  if(q.includes('contact')||q.includes('email')||q.includes('phone')||q.includes('github')||q.includes('linkedin')){
    return `You can contact Kathiravan at ${portfolioData.email} or call ${portfolioData.phone}. His GitHub is ${portfolioData.github} and LinkedIn is ${portfolioData.linkedin}.`;
  }

  if(q.includes('education')||q.includes('academic')||q.includes('college')||q.includes('cgpa')||q.includes('degree')){
    return `Kathiravan is pursuing B.E. Computer Science & Engineering at Mahendra Engineering College, Namakkal, with a current CGPA of 7.85+. He also completed his HSC with 85.5% and SSLC with 95%.`;
  }

  if(q.includes('location')||q.includes('where is')||q.includes('from')){
    return `Kathiravan is based in ${portfolioData.location}.`;
  }

  if(q.includes('internship')||q.includes('certification')||q.includes('certs')){
    return `Kathiravan has completed internships and certifications including ${portfolioData.internships.join(', ')} and ${portfolioData.certifications.join(', ')}.`;
  }

  if(q.includes('achievement')||q.includes('award')||q.includes('chess')){
    return `Kathiravan's notable achievement is being the runner-up in the Inter-School Chess Competition.`;
  }

  if(q.includes('interest')||q.includes('passion')||q.includes('field')){
    return `Kathiravan is interested in ${portfolioData.interests.join(', ')} and enjoys building practical digital experiences that solve real problems.`;
  }

  if(q.includes('hi')||q.includes('hello')||q.includes('hey')){
    return `${getTimeGreeting()}! I can help with Kathiravan's skills, education, projects, internship experience, and contact details.`;
  }

  return fallback;
}

function startTalking(){
  setAssistantState('talking');
  let open=false;
  clearInterval(window.talkInterval);
  window.talkInterval=setInterval(()=>{
    open=!open;
    const mouthClosed=document.getElementById('mouth-closed');
    const mouthOpenEl=document.getElementById('mouth-open');
    const mouthTeeth=document.getElementById('mouth-teeth');
    if(mouthClosed) mouthClosed.setAttribute('opacity', open ? '0' : '1');
    if(mouthOpenEl) mouthOpenEl.setAttribute('opacity', open ? '1' : '0');
    if(mouthTeeth) mouthTeeth.setAttribute('opacity', open ? '0.9' : '0');
  },120+Math.random()*80);
}

function stopTalking(){
  clearInterval(window.talkInterval);
  setAssistantState('idle');
  const mouthClosed=document.getElementById('mouth-closed');
  const mouthOpenEl=document.getElementById('mouth-open');
  const mouthTeeth=document.getElementById('mouth-teeth');
  if(mouthClosed) mouthClosed.setAttribute('opacity','1');
  if(mouthOpenEl) mouthOpenEl.setAttribute('opacity','0');
  if(mouthTeeth) mouthTeeth.setAttribute('opacity','0');
}

function speakText(text){
  if(!('speechSynthesis' in window)) return;
  if(assistantState.voiceMuted) return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.rate=0.95;
  utterance.pitch=1.05;
  utterance.volume=1;
  const voices=window.speechSynthesis.getVoices();
  const preferred=voices.find(v=>/en-(IN|US|GB)/i.test(v.lang)&&/male|guy|man/i.test(v.name))||voices.find(v=>/en/i.test(v.lang));
  if(preferred) utterance.voice=preferred;
  utterance.onstart=()=>startTalking();
  utterance.onend=()=>stopTalking();
  utterance.onerror=()=>stopTalking();
  window.speechSynthesis.speak(utterance);
}

if(window.speechSynthesis && window.speechSynthesis.onvoiceschanged!==undefined){
  window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices();
}

function playCustomAudio(audioData){
  if(!audioData || assistantState.voiceMuted) return false;
  try{
    const audio=new Audio(audioData);
    audio.play();
    return true;
  }catch(error){
    return false;
  }
}

async function askQuestion(question){
  const prompt=String(question||'').trim();
  if(!prompt || assistantState.isBusy) return;
  assistantState.isBusy=true;
  assistantState.conversation.push({role:'user', content:prompt});
  setAssistantState('listening');
  setBubble('thinking','🤔 Thinking...', 'Let me answer based on Kathiravan\'s portfolio.');

  let answer = generateLocalAnswer(prompt, assistantState.conversation);
  let audioData = null;

  try{
    const response=await fetch('/api/assistant', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ message:prompt, conversation:assistantState.conversation })
    });
    if(response.ok){
      const data=await response.json();
      if(data && data.answer) answer=data.answer;
      if(data && data.audioData) audioData=data.audioData;
    }
  }catch(error){
    // Fallback already set locally. No crash.
  }

  assistantState.lastAnswer=answer;
  setBubble('talking','MK says',answer);

  if(audioData && !assistantState.voiceMuted){
    playCustomAudio(audioData);
    startTalking();
  } else {
    speakText(answer);
  }

  assistantState.conversation.push({role:'assistant', content:answer});
  assistantState.isBusy=false;
}

function sendText(){
  const input=document.getElementById('ask-input');
  const value=input.value.trim();
  if(value){
    askQuestion(value);
    input.value='';
  }
}

const micBtn=document.getElementById('mic-btn');
const micIcon=document.getElementById('mic-icon');
const muteBtn=document.getElementById('mute-btn');
const muteIcon=document.getElementById('mute-icon');
const stopBtn=document.getElementById('stop-btn');
const askInput=document.getElementById('ask-input');
const sendBtn=document.getElementById('send-btn');
const closeBtn=document.getElementById('assistant-close');

if(muteBtn){
  muteBtn.addEventListener('click',()=>{
    assistantState.voiceMuted=!assistantState.voiceMuted;
    muteBtn.classList.toggle('muted', assistantState.voiceMuted);
    if(muteIcon){
      muteIcon.className = assistantState.voiceMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }
    setBubble('idle','MK says', assistantState.voiceMuted ? 'Voice muted. You can type your question anytime.' : 'Voice restored. Ready to help again.');
    if(assistantState.voiceMuted){
      window.speechSynthesis.cancel();
      stopTalking();
    }
  });
}

if(stopBtn){
  stopBtn.addEventListener('click',()=>{
    window.speechSynthesis.cancel();
    stopTalking();
    setBubble('idle','MK says','Speech stopped. Ask me anything anytime.');
  });
}

if(closeBtn){
  closeBtn.addEventListener('click',()=>{
    const widget=document.getElementById('avatar-widget');
    if(widget){ widget.classList.toggle('collapsed'); }
  });
}

if(sendBtn){
  sendBtn.addEventListener('click',sendText);
}

if(askInput){
  askInput.addEventListener('keydown', (event)=>{
    if(event.key==='Enter') sendText();
  });
}

const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(micBtn && SpeechRecognition){
  const recognition = new SpeechRecognition();
  recognition.continuous=false;
  recognition.interimResults=true;
  recognition.lang='en-IN';
  let finalTranscript='';

  recognition.onstart=()=>{
    micBtn.classList.add('active');
    micIcon.className='fas fa-circle';
    setAssistantState('listening');
    setBubble('listening','🎤 Listening...', 'Speak now and I will turn it into a question.');
  };

  recognition.onresult=(event)=>{
    finalTranscript='';
    for(let i=event.resultIndex; i<event.results.length; i++){
      const transcript=event.results[i][0].transcript.trim();
      if(event.results[i].isFinal){
        finalTranscript += transcript + ' ';
      } else {
        setBubble('listening','🎤 Listening...', transcript + '…');
      }
    }
  };

  recognition.onend=()=>{
    micBtn.classList.remove('active');
    micIcon.className='fas fa-microphone';
    const spoken=finalTranscript.trim();
    if(spoken){
      askInput.value=spoken;
      askQuestion(spoken);
    } else {
      setBubble('idle','MK says','Sorry, I could not catch that. Please try again.');
    }
  };

  recognition.onerror=()=>{
    micBtn.classList.remove('active');
    micIcon.className='fas fa-microphone';
    setBubble('idle','Error','Sorry, I could not understand that. Please try again.');
  };

  micBtn.addEventListener('click',()=>{
    if(micBtn.classList.contains('active')){
      recognition.stop();
      return;
    }
    try{ recognition.start(); }catch(error){}
  });
}else if(micBtn){
  micBtn.title='Speech recognition is not supported in this browser';
  micBtn.style.opacity='.5';
}

const aboutLines=[
  "I'm Kathiravan! Software and web developer.",
  "Building responsive web apps with clean, thoughtful code.",
  "Turning real-world problems into practical software solutions.",
  "Learning new technologies and growing through every project.",
  "Open to software development internships and placement opportunities."
];
let aI=0,aboutCycleStarted=false;
function startAboutCycle(){
  if(aboutCycleStarted)return;
  const el=document.getElementById('about-speech');
  if(!el)return;
  aboutCycleStarted=true;
  el.textContent=aboutLines[aI];
  setInterval(()=>{
    if(document.hidden)return;
    aI=(aI+1)%aboutLines.length;
    if(calmMotion.matches){
      el.textContent=aboutLines[aI];
      return;
    }
    el.classList.add('caption-fading');
    setTimeout(()=>{
      el.textContent=aboutLines[aI];
      el.classList.remove('caption-fading');
    },300);
  },2000);
}

/* ══════════════════════════════════
   CERT SCROLL
══════════════════════════════════ */
const track=document.getElementById('cert-track');
const dots=document.querySelectorAll('.cert-dot');
function scrollCert(d){const c=track.querySelector('.cert-card');if(c)track.scrollBy({left:d*(c.offsetWidth+24),behavior:'smooth'})}
let dn=false,sX,sL;
let certDragMoved=false;
track.addEventListener('mousedown',e=>{dn=true;certDragMoved=false;sX=e.pageX-track.offsetLeft;sL=track.scrollLeft});
track.addEventListener('mouseleave',()=>dn=false);
track.addEventListener('mouseup',()=>dn=false);
track.addEventListener('mousemove',e=>{if(!dn)return;e.preventDefault();const x=e.pageX-track.offsetLeft;if(Math.abs(x-sX)>6)certDragMoved=true;track.scrollLeft=sL-(x-sX)*1.5});
track.addEventListener('scroll',()=>{const cs=track.querySelectorAll('.cert-card');let cl=0,md=Infinity;cs.forEach((c,i)=>{const d=Math.abs(c.getBoundingClientRect().left-track.getBoundingClientRect().left);if(d<md){md=d;cl=i}});dots.forEach((d,i)=>d.classList.toggle('active',i===cl))});
const certObs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){setTimeout(()=>{const c=track.querySelector('.cert-card');if(c){track.scrollBy({left:c.offsetWidth*.55,behavior:'smooth'});setTimeout(()=>track.scrollBy({left:-c.offsetWidth*.55,behavior:'smooth'}),900)}},500);certObs.disconnect()}}),{threshold:.3});
const cs=document.getElementById('certifications');if(cs)certObs.observe(cs);
dots.forEach((d,i)=>d.addEventListener('click',()=>{const cs2=track.querySelectorAll('.cert-card');if(cs2[i])cs2[i].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'})}));

const certModal=document.getElementById('cert-modal');
const certModalTitle=document.getElementById('cert-modal-title');
const certModalImg=document.getElementById('cert-modal-img');
const certModalPdf=document.getElementById('cert-modal-pdf');
const certFallback=document.getElementById('cert-preview-fallback');
const certFallbackTitle=document.getElementById('cert-fallback-title');
const certFileName=document.getElementById('cert-file-name');

function openCertModal(title,imgSrc){
  if(!certModal)return;
  const isPdf=/\.pdf($|\?)/i.test(imgSrc);
  certModalTitle.textContent=title;
  certFallbackTitle.textContent=title;
  certFileName.textContent=decodeURI(imgSrc);
  certFallback.classList.add('is-hidden');
  if(isPdf){
    certModalImg.classList.add('is-hidden');
    certModalImg.removeAttribute('src');
    if(certModalPdf){
      certModalPdf.classList.remove('is-hidden');
      certModalPdf.src=imgSrc;
      certModalPdf.title=title+' certificate PDF';
    }
  }else{
    if(certModalPdf){
      certModalPdf.classList.add('is-hidden');
      certModalPdf.removeAttribute('src');
    }
    certModalImg.classList.remove('is-hidden');
    certModalImg.alt=title+' certificate';
    certModalImg.src=imgSrc;
  }
  certModal.classList.add('open');
  certModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}

function closeCertModal(){
  if(!certModal)return;
  certModal.classList.remove('open');
  certModal.setAttribute('aria-hidden','true');
  if(certModalPdf) certModalPdf.removeAttribute('src');
  document.body.style.overflow='';
}

if(certModalImg){
  certModalImg.addEventListener('error',()=>{
    certModalImg.classList.add('is-hidden');
    certFallback.classList.remove('is-hidden');
  });
}

document.querySelectorAll('.cert-card').forEach(card=>{
  card.addEventListener('click',()=>{
    if(certDragMoved)return;
    openCertModal(card.dataset.certTitle||card.querySelector('h3')?.textContent||'Certificate',card.dataset.certImage||'certificate.png');
  });
});

document.querySelectorAll('[data-cert-close]').forEach(el=>el.addEventListener('click',closeCertModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCertModal()});

showWelcomeWelcomeOnce();
