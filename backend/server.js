import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const {
  GOOGLE_CLIENT_ID,
  GEMINI_API_KEY,
  JWT_SECRET,
  PORT = 3001,
  ADMIN_EMAILS = ""
} = process.env;

if (!GOOGLE_CLIENT_ID || !JWT_SECRET) {
  console.error("Missing GOOGLE_CLIENT_ID or JWT_SECRET in .env");
  process.exit(1);
}

const ADMIN_SET = new Set(
  ADMIN_EMAILS.split(',').map(s => s.trim()).filter(Boolean)
);

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const client = new OAuth2Client();

async function verifyGoogleIdToken(idToken) {
  const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
  return ticket.getPayload(); // {email, name, picture, ...}
}

function signJWT(user){
  // The user object here has email, name, picture
  const payload = {
    sub: user.email, // Use 'sub' (subject) for user identifier, standard JWT claim
    name: user.name,
    picture: user.picture,
    isAdmin: ADMIN_SET.has(user.email)
  };
  return jwt.sign(
    payload,
    JWT_SECRET, { expiresIn: '7d' }
  );
}

function requireAuth(req, res, next){
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: "Invalid token" }); }
}

function requireAdmin(req, res, next){
  return req.user?.isAdmin ? next() : res.status(403).json({ error: "Forbidden" });
}

// Google Sign-In -> App JWT
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: "idToken required" });
    const payload = await verifyGoogleIdToken(idToken);
    const user = { email: payload.email, name: payload.name, picture: payload.picture };
    const appToken = signJWT(user);
    
    // The script's frontend expects a token and a user object.
    // The user object can be the decoded payload of the token itself.
    res.json({ token: appToken });
  } catch(e) { 
      console.error("Google Auth Error:", e)
      res.status(401).json({ error: "Google token invalid" }); 
  }
});

// Me / Users
app.get('/api/me', requireAuth, (req, res) => res.json({ user: req.user }));
app.get('/api/users', requireAuth, requireAdmin, (req, res) => {
    // This is a placeholder. A real implementation would fetch from a database.
    const mockUsers = [...ADMIN_SET].map(email => ({
        id: email,
        name: 'Admin User',
        email: email,
        avatar: '',
        credits: 999999,
        role: 'admin',
        joinDate: '2024-01-01',
    }));
    res.json({ items: mockUsers });
});

// TTS async (demo, in-memory)
const jobs = new Map();
const rid = () => Math.random().toString(36).slice(2, 10);

app.post('/api/tts/jobs', requireAuth, async (req, res) => {
  const { text, voiceId } = req.body || {};
  if (!text || !voiceId) return res.status(400).json({ error: "text & voiceId required" });
  
  const id = rid(); 
  jobs.set(id, { id, status: "queued", userId: req.user.sub });

  // Simulate async processing
  setTimeout(() => {
    const job = jobs.get(id); if (!job) return;
    try { 
        job.status = "done"; 
        // Use a real sample URL
        job.url = `https://cloud.google.com/text-to-speech/docs/audio/vi-VN-Standard-A.wav`; 
    }
    catch { 
        job.status = "error"; 
        job.error = "TTS failed"; 
    }
    jobs.set(id, job);
  }, 2000 + Math.floor(Math.random()*2000));

  res.status(202).json({ id, status: "queued" });
});

app.get('/api/tts/jobs/:id', requireAuth, (req, res) => {
  const job = jobs.get(req.params.id);
  
  if (!job) {
      return res.status(404).json({ error: "Not found" });
  }
  
  // Security check: user can only access their own jobs unless they are an admin
  if (job.userId !== req.user.sub && !req.user.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
  }
  
  return res.json(job);
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.listen(Number(PORT), '0.0.0.0', () => console.log(`API listening on :${PORT}`));
