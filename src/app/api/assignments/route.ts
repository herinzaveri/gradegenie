import {NextResponse} from 'next/server';
import {createAssignment, getAllAssignmentsByUser} from '@/app/api/server-actions/assignments.actions';
import {validateToken} from '@/utils/auth.utils';

// Helper function to extract and validate the Bearer token
function getUserIdFromAuthHeader(headers: Headers): string {
  const authHeader = headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized'); // Missing or invalid Authorization header
  }

  const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
  const {decoded} = validateToken(token); // Validate the token and decode it
  return (decoded as any)._id; // Extract the userId from the decoded token
}

// GET: Fetch all assignments for the logged-in user
export async function GET(request: Request) {
  try {
    const userId = getUserIdFromAuthHeader(request.headers); // Extract user ID from token

    const assignments = await getAllAssignmentsByUser(userId);
    return NextResponse.json(assignments, {status: 200});
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: error.message === 'Unauthorized' ? 401 : 500});
  }
}

// POST: Create a new assignment
export async function POST(request: Request) {
  try {
    const userId = getUserIdFromAuthHeader(request.headers); // Extract user ID from token
    const body = await request.json();

    const assignmentData = {...body, createdBy: userId};
    const newAssignment = await createAssignment(assignmentData);
    return NextResponse.json(newAssignment, {status: 201});
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: error.message === 'Unauthorized' ? 401 : 500});
  }
}
