import {NextResponse} from 'next/server';
import {createCourse, getAllCoursesByUser} from '../server-actions/courses.actions';
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

// GET: Fetch all courses for the logged-in user
export async function GET(request: Request) {
  try {
    const userId = getUserIdFromAuthHeader(request.headers); // Extract user ID from token

    const courses = await getAllCoursesByUser(userId);
    return NextResponse.json(courses, {status: 200});
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: error.message === 'Unauthorized' ? 401 : 500});
  }
}

// POST: Create a new course
export async function POST(request: Request) {
  try {
    const userId = getUserIdFromAuthHeader(request.headers); // Extract user ID from token
    const body = await request.json();

    const courseData = {...body, createdBy: userId};
    const newCourse = await createCourse(courseData);
    return NextResponse.json(newCourse, {status: 201});
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: error.message === 'Unauthorized' ? 401 : 500});
  }
}
