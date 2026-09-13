# Kathiravan Portfolio AI Assistant

This project adds a professional personal AI assistant to the portfolio website.

## Features
- Time-based greeting
- Voice input through the browser Web Speech API
- Text input and answer generation
- Local knowledge-base fallback
- Optional secure backend integration for OpenAI-compatible APIs
- Optional ElevenLabs custom-voice TTS pipeline for your own voice
- Responsive floating assistant UI

## Folder structure
- `index.html` – portfolio page
- `index.css` – styling and assistant theme
- `index.js` – frontend logic, voice input, keyboard behavior, local fallback
- `server.js` – secure backend API and static hosting
- `.env.example` – environment example
- `package.json` – Node dependencies and scripts

## Installation

```bash
npm install
```

## Run locally

```bash
npm start
```

Open: http://localhost:3000

## Environment setup

Copy the example file:

```bash
copy .env.example .env
```

Then set your API keys:

```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_custom_voice_id_here
```

## ElevenLabs custom voice setup

For the best result, create your own custom voice in ElevenLabs from a clean recording of your voice.

Suggested sample script:

```text
Hello, welcome to my portfolio. I'm Kathiravan's personal AI assistant. I can tell you about his skills, projects, experience, and career interests. Feel free to ask me anything.
```

After creating the custom voice, copy the voice ID into `ELEVENLABS_VOICE_ID`.

The app flow is:

```text
Portfolio
  ↓
Voice/Text Question
  ↓
Backend
  ↓
LLM answer generation
  ↓
ElevenLabs custom voice TTS
  ↓
Audio response
  ↓
Portfolio
```

If the ElevenLabs key and voice ID are missing, the assistant falls back to browser speech synthesis.

## API setup

The assistant sends requests to:

```http
POST /api/assistant
```

Request body:

```json
{
  "message": "Who is Kathiravan?",
  "conversation": []
}
```

Response:

```json
{
  "answer": "Kathiravan is a software developer..."
}
```

If no key is configured, the app uses the built-in local knowledge base.

## GitHub deployment
1. Create a new repo on GitHub.
2. Run:

```bash
git init
git add .
git commit -m "Initial portfolio AI assistant"
git branch -M main
git remote add origin <your_repo_url>
git push -u origin main
```

## Vercel deployment
1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Set build settings to a Node app if needed.
4. Add environment variables in Vercel project settings.
5. Deploy.

## Netlify deployment
1. Push the project to GitHub.
2. Import the repo in Netlify.
3. Set the build command to `npm install` if needed.
4. Set the publish directory to the project root.
5. Add environment variables in Netlify site settings.

## Troubleshooting
- If the browser cannot access the microphone, check browser permissions.
- If /api/assistant returns 404, make sure the server is running.
- If the app does not start, run `node server.js` and inspect the terminal errors.
- If voice output is silent, check browser autoplay/speech support and allow permission.
- If no LLM key is configured, the app will still work with the built-in fallback knowledge base.
