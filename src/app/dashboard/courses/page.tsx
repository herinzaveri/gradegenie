import Link from 'next/link';
import {Plus} from 'lucide-react';
import {cookies} from 'next/headers'; // To access cookies on the server side

import {Button} from '@/components/ui/button';
import {PageHeader} from '@/components/page-header';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {getAllCoursesByUser} from '@/app/api/server-actions/courses.actions';
import {validateToken} from '@/utils/auth.utils';

const CoursesPage = async () => {
  try {
    // Get the auth token from cookies
    const authToken = (await cookies()).get('authToken')?.value;

    if (!authToken) {
      throw new Error('Authorization token is missing.');
    }

    // Validate the token and extract the user ID
    const {decoded} = validateToken(authToken);
    const userId = (decoded as any)._id;

    // Fetch courses for the user
    const courses = await getAllCoursesByUser(userId);

    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <PageHeader heading="Courses" subheading="Manage your courses and create new ones" />
          <Button asChild>
            <Link href="/dashboard/courses/create" title="Create a new course with details and AI-generated syllabus">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Card key={course._id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{course.students || 0}</span> Students
                  </div>
                  <div>
                    <span className="font-medium">{course.assignments || 0}</span> Assignments
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  asChild
                  className="w-full"
                >
                  <Link href={`/dashboard/courses/${course._id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader heading="Courses" subheading="Manage your courses and create new ones" />
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }
};

export default CoursesPage;
