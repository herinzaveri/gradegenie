import {NextResponse} from 'next/server';
import {getCourseById, updateCourse, deleteCourse} from '@/app/api/server-actions/courses.actions';
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

// PUT: Update a course by ID
export async function PUT(request: Request, {params}: { params: { id: string } }) {
  try {
    const userId = getUserIdFromAuthHeader(request.headers); // Extract user ID from token
    const body = await request.json();

    const updatedCourse = await updateCourse(params.id, userId, body);
    return NextResponse.json(updatedCourse, {status: 200});
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: error.message === 'Unauthorized' ? 401 : 500});
  }
}

// DELETE: Delete a course by ID
export async function DELETE(request: Request, {params}: { params: { id: string } }) {
  try {
    const userId = getUserIdFromAuthHeader(request.headers); // Extract user ID from token

    await deleteCourse(params.id, userId);
    return NextResponse.json({message: 'Course deleted successfully'}, {status: 200});
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: error.message === 'Unauthorized' ? 401 : 500});
  }
}
