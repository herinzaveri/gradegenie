import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use a secure secret key

export async function POST(request: Request) {
  try {
    // Parse the request body
    const {token} = await request.json();

    // Validate the input
    if (!token) {
      return new Response(JSON.stringify({valid: false, error: 'Token is required.'}), {status: 400});
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return new Response(JSON.stringify({valid: true, decoded}), {status: 200});
    } catch (err) {
      return new Response(JSON.stringify({valid: false, error: 'Invalid or expired token.'}), {status: 401});
    }
  } catch (error: any) {
    // Handle unexpected errors
    return new Response(JSON.stringify({valid: false, error: error.message || 'Internal Server Error'}), {status: 500});
  }
}
