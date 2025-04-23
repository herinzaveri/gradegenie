import type {Metadata} from 'next';
import ClassroomPage from './classroom-page';

export const metadata: Metadata = {
  title: 'Classroom Management | GradeGenie',
  description: 'Manage your classroom, students, and co-teachers',
};

const Page = () => {
  return <ClassroomPage />;
};

export default Page;
