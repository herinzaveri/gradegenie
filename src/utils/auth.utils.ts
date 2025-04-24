import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use a secure secret key

export function validateToken(token: string) {
  if (!token) {
    throw new Error('Token is required.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {valid: true, decoded};
  } catch (err) {
    throw new Error('Invalid or expired token.');
  }
}
