const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const FORCE_HTTPS = process.env.FORCE_HTTPS === 'true';
const apiHits = new Map();

const portfolioData = {
  name: 'M. Kathiravan',
  preferredName: 'Kathiravan',
  role: 'Software Developer',
  location: 'Ariyalur, Tamil Nadu, India',
  phone: '+91 9092356332',
  email: 'kathiravan12082004@gmail.com',
  github: 'https://github.com/kathiravan-sk',
  linkedin: 'https://linkedin.com/in/m-kathiravan-b67a30297',
  skills: ['C', 'Java', 'C++', 'Python', 'HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Tailwind CSS', 'MongoDB', 'MySQL', 'Git', 'GitHub', 'Data Structures', 'Algorithms', 'OOP', 'OS'],
  interests: ['Web Development', 'Artificial Intelligence', 'Machine Learning', 'Full-Stack Development', 'Cybersecurity'],
  projects: [
    { name: 'Fire Fighting Robot', description: 'An autonomous robot designed to detect fire, navigate toward it, and extinguish it using sensors and a water-spraying mechanism.' },
    { name: 'Portfolio Website', description: 'A modern personal portfolio website built with HTML, CSS, JavaScript, and interactive UI elements.' }
  ],
  internships: ['ServiceNow Virtual Internship Program', 'Salesforce Developer with Agentblazer Champion Program', 'Infosys Internship 6.0 HireHelper', 'Deloitte Technology Job Simulation'],
  certifications: ['Introduction to Artificial Intelligence', 'Salesforce Developer with Agentblazer Champion Program', 'MongoDB Basics for Students', 'Deloitte Technology Job Simulation'],
  education: [
    'B.E. Computer Science & Engineering — Mahendra Engineering College, Namakkal (2023–2027)',
    'Higher Secondary — Govt. Higher Secondary School, Keelapalur (2022–2023) — 85.5%',
    'Secondary School — Govt. Higher Secondary School, Keelapalur (2020–2021) — 95%'
  ],
  careerGoal: 'Currently seeking software developer, full-stack developer, AI/ML, internship, and graduate opportunities.',
  achievement: 'Runner-up in the Inter-School Chess Competition.'
};

function normalizeQuestion(raw) {
  return String(raw || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 11) return 'Good morning';
  if (hour >= 12 && hour <= 16) return 'Good afternoon';
  if (hour >= 17 && hour <= 20) return 'Good evening';
  return 'Good night';
}

function generateLocalAnswer(question) {
  const q = normalizeQuestion(question);
  const fallback = "I don't have that information in Kathiravan's portfolio. You can contact Kathiravan directly if you'd like to know more.";

  if (!q) return fallback;
  if (q.includes('who is kathiravan') || q.includes('who are you') || q.includes('tell me about kathiravan')) {
    return `${portfolioData.name} is a ${portfolioData.role} passionate about web development, artificial intelligence, and practical digital solutions.`;
  }
  if (q.includes('what are his skills') || q.includes('what technologies') || q.includes('what skills') || q.includes('skills')) {
    return `Kathiravan works with ${portfolioData.skills.slice(0, 12).join(', ')}, and is especially interested in ${portfolioData.interests.join(', ')}.`;
  }
  if (q.includes('project') || q.includes('projects') || q.includes('work')) {
    return `Kathiravan has worked on ${portfolioData.projects.map(p => p.name).join(', ')}. His notable project is the Fire Fighting Robot, which is an autonomous robot designed to detect and extinguish fire using sensors and a water-spraying mechanism.`;
  }
  if (q.includes('open to opportunities') || q.includes('job') || q.includes('looking for') || q.includes('internship') || q.includes('opportunities')) {
    return 'Yes. Kathiravan is currently open to software development, full-stack development, AI/ML, internship, and graduate opportunities.';
  }
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('github') || q.includes('linkedin')) {
    return `You can contact Kathiravan at ${portfolioData.email} or call ${portfolioData.phone}. His GitHub is ${portfolioData.github} and LinkedIn is ${portfolioData.linkedin}.`;
  }
  if (q.includes('education') || q.includes('academic') || q.includes('college') || q.includes('cgpa') || q.includes('degree')) {
    return `Kathiravan is pursuing B.E. Computer Science & Engineering at Mahendra Engineering College, Namakkal, with a current CGPA of 7.85+. He also completed his HSC with 85.5% and SSLC with 95%.`;
  }
  if (q.includes('location') || q.includes('where is') || q.includes('from')) {
    return `Kathiravan is based in ${portfolioData.location}.`;
  }
  if (q.includes('internship') || q.includes('certification') || q.includes('certs')) {
    return `Kathiravan has completed internships and certifications including ${portfolioData.internships.join(', ')} and ${portfolioData.certifications.join(', ')}.`;
  }
  if (q.includes('achievement') || q.includes('award') || q.includes('chess')) {
    return `Kathiravan's notable achievement is being the runner-up in the Inter-School Chess Competition.`;
  }
  if (q.includes('interest') || q.includes('passion') || q.includes('field')) {
    return `Kathiravan is interested in ${portfolioData.interests.join(', ')} and enjoys building practical digital experiences that solve real problems.`;
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return `${getTimeGreeting()}! I can help with Kathiravan's skills, education, projects, internship experience, and contact details.`;
  }

  return fallback;
}

function sanitizeConversation(conversation = []) {
  if (!Array.isArray(conversation)) return [];

  return conversation
    .filter(item => item && ['user', 'assistant'].includes(item.role))
    .slice(-8)
    .map(item => ({
      role: item.role,
      content: String(item.content || '').slice(0, 500)
    }))
    .filter(item => item.content.trim());
}

function rateLimitAssistant(req, res, next) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 20;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const hits = (apiHits.get(ip) || []).filter(timestamp => now - timestamp < windowMs);

  if (hits.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  hits.push(now);
  apiHits.set(ip, hits);
  return next();
}

async function generateSecureLLMAnswer(question, conversation = []) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const systemPrompt = `You are the AI assistant for Kathiravan's personal portfolio. Answer only using the provided portfolio facts. Never invent personal or professional details. If info is missing, say that it is not in the portfolio and suggest contacting the person directly.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        ...sanitizeConversation(conversation),
        { role: 'user', content: question }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

async function generateElevenLabsAudio(text) {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
    return null;
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.25,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    return null;
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  return `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;
}

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((req, res, next) => {
  if (IS_PRODUCTION && FORCE_HTTPS && req.headers['x-forwarded-proto'] === 'http') {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), geolocation=(), payment=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
      "img-src 'self' data:",
      "media-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests'
    ].join('; ')
  );

  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return next();
});

app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  if (/^\/(?:\.env|server\.js|package(?:-lock)?\.json)(?:$|[/?#])/i.test(req.url)) {
    return res.status(404).send('Not found');
  }
  return next();
});
app.use(express.static(__dirname, {
  dotfiles: 'deny',
  index: false
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'kathiravan-portfolio-ai-assistant' });
});

app.post('/api/assistant', rateLimitAssistant, async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message is too long.' });
    }

    let answer = null;
    try {
      answer = await generateSecureLLMAnswer(message, sanitizeConversation(req.body?.conversation));
    } catch (err) {
      answer = null;
    }

    const finalAnswer = answer || generateLocalAnswer(message);
    const audioData = await generateElevenLabsAudio(finalAnswer);

    return res.json({
      answer: finalAnswer,
      audioData: audioData || null,
      voiceMode: audioData ? 'custom-elevenlabs' : 'browser-fallback'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to process request.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio AI assistant running on http://localhost:${PORT}`);
});
