import {createUser} from '../server-actions/users.actions';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use a secure secret key

export async function POST(request: Request) {
  try {
    // Parse the request body
    const {name, email, password, billingCycle, selectedPlan} = await request.json();

    // Validate the input
    if (!name || !email || !password || !billingCycle || !selectedPlan) {
      return new Response(JSON.stringify({error: 'All fields are required.'}), {status: 400});
    }

    // Create the user
    const user = await createUser({name, email, password, billingCycle, selectedPlan});

    // Exclude the password from the user object
    const {password: _, ...userWithoutPassword} = user;

    // Generate a JWT token
    const token = jwt.sign(
        {id: user._id, ...userWithoutPassword}, // Payload
        JWT_SECRET, // Secret key
    );

    // Return the JWT token in the response
    return new Response(JSON.stringify({token}), {status: 201});
  } catch (error: any) {
    // Handle errors
    return new Response(JSON.stringify({error: error.message || 'Internal Server Error'}), {status: 500});
  }
}
