import Course from '../db/models/course.model';
import mongoDB from '../db/mongodb';

type GradingPolicyType = {
  percentage: number;
  description: string;
};

type CourseType = {
  title: string;
  instructorName: string;
  term: string;
  subject: string;
  gradeLevel: string;
  description: string;
  learningObjectives: string[];
  requiredMaterials: {
    title: string;
    author: string;
    publisher: string;
    year: string;
    required: boolean;
  }[];
  gradingPolicy: GradingPolicyType[]; // Array of objects with percentage and description
  weeklySchedule: {
    topic: string;
    readings: string;
    assignments: string;
  }[];
  coursePolicies: string[];
  createdBy: string; // User ID of the creator
};

// Create a new course
export async function createCourse(courseData: CourseType) {
  await mongoDB.connect();

  // Input validation
  if (
    !courseData.title ||
    !courseData.instructorName ||
    !courseData.term ||
    !courseData.subject ||
    !courseData.gradeLevel ||
    !courseData.createdBy ||
    !courseData.gradingPolicy
  ) {
    throw new Error(
        // eslint-disable-next-line max-len
        'All required fields (title, instructorName, term, subject, gradeLevel, createdBy, gradingPolicy) must be provided.',
    );
  }

  // Create a new course
  const course = new Course(courseData);
  await course.save();

  return JSON.parse(JSON.stringify(course));
}

// Get a course by ID
export async function getCourseById(courseId: string, userId: string) {
  await mongoDB.connect();

  const course = await Course.findOne({_id: courseId, createdBy: userId});
  if (!course) {
    throw new Error('Course not found or you do not have access.');
  }

  return JSON.parse(JSON.stringify(course));
}

// Get all courses for a user
export async function getAllCoursesByUser(userId: string) {
  await mongoDB.connect();

  const courses = await Course.find({createdBy: userId});
  return JSON.parse(JSON.stringify(courses));
}

// Update a course by ID
export async function updateCourse(courseId: string, userId: string, updatedData: Partial<CourseType>) {
  await mongoDB.connect();

  const course = await Course.findOneAndUpdate({_id: courseId, createdBy: userId}, updatedData, {new: true});
  if (!course) {
    throw new Error('Course not found or you do not have access.');
  }

  return JSON.parse(JSON.stringify(course));
}

// Delete a course by ID
export async function deleteCourse(courseId: string, userId: string) {
  await mongoDB.connect();

  const course = await Course.findOneAndDelete({_id: courseId, createdBy: userId});
  if (!course) {
    throw new Error('Course not found or you do not have access.');
  }

  return JSON.parse(JSON.stringify(course));
}
