import { NextApiRequest, NextApiResponse } from 'next';

let users: { [email: string]: { email: string; password: string } } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { action, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  if (action === 'signup') {
    if (users[email]) return res.status(400).json({ message: 'User already exists' });
    users[email] = { email, password };
    return res.status(200).json({ success: true, user: { email } });
  } else if (action === 'login') {
    if (!users[email] || users[email].password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.status(200).json({ success: true, user: { email } });
  }
  return res.status(400).json({ message: 'Invalid action' });
} 