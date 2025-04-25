'use client';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {CalendarDays, Clock, FileText, Plus, Search} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {useToast} from '@/hooks/use-toast';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AssignmentsPage = () => {
  const {toast} = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssignmentsAndCourses = async () => {
      setIsLoading(true);

      try {
        // Get the auth token from cookies
        const authToken = Cookies.get('authToken'); // Retrieve the token using js-cookie

        if (!authToken) {
          throw new Error('Authorization token is missing.');
        }

        // Fetch assignments from the API
        const assignmentsResponse = await axios.get('/api/assignments', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the Bearer token
          },
        });

        // Fetch courses from the API
        const coursesResponse = await axios.get('/api/courses', {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the Bearer token
          },
        });

        setAssignments(assignmentsResponse.data); // Set the fetched assignments
        setCourses(coursesResponse.data); // Set the fetched courses
      } catch (error: any) {
        console.error('Error fetching data:', error.response?.data?.error || error.message);
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to fetch data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignmentsAndCourses();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/create-assignment">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assignments..."
            className="w-[200px] pl-8 md:w-[300px]"
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => {
            const course = courses.find((course) => course._id === assignment.courseId); // Find the course by ID
            return (
              <Card key={assignment._id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>{course?.title || 'No course assigned'}</CardDescription>
                  </div>
                  <Badge>{assignment.status || 'Active'}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarDays className="mr-1 h-4 w-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <FileText className="mr-1 h-4 w-4" />
                      <span>{assignment.submissions || 0} submissions</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/assignments/${assignment._id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
