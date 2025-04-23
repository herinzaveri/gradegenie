import jwt from 'jsonwebtoken';
import {decryptText} from '@/utils/encryption';
import mongoDB from '../db/mongodb';
import User from '../db/models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use a secure secret key

export async function POST(request: Request) {
  try {
    // Parse the request body
    const {email, password} = await request.json();

    // Validate the input
    if (!email || !password) {
      return new Response(JSON.stringify({error: 'Email and password are required.'}), {status: 400});
    }

    // Connect to the database
    await mongoDB.connect();

    // Find the user by email
    const user = await User.findOne({email});
    if (!user) {
      return new Response(JSON.stringify({error: 'Invalid email or password.'}), {status: 401});
    }

    // Decrypt the stored password and compare it with the provided password
    const decryptedPassword = decryptText(user.password);
    if (decryptedPassword !== password) {
      return new Response(JSON.stringify({error: 'Invalid email or password.'}), {status: 401});
    }

    // Exclude the password from the user object
    const {password: _, ...userWithoutPassword} = user.toObject();

    // Generate a JWT token
    const token = jwt.sign(
        {id: user._id, ...userWithoutPassword}, // Payload
        JWT_SECRET, // Secret key
    );

    // Return the JWT token in the response
    return new Response(JSON.stringify({token}), {status: 200});
  } catch (error: any) {
    // Handle errors
    return new Response(JSON.stringify({error: error.message || 'Internal Server Error'}), {status: 500});
  }
}
