import Assignment from '../db/models/assignment.model';
import mongoDB from '../db/mongodb';

type QuizSettingsType = {
  numberOfQuestions?: number;
  timeLimit?: number;
  randomizeQuestions?: boolean;
  showCorrectAnswers?: boolean;
};

type GroupSettingsType = {
  groupSize?: number;
  groupFormation?: string;
  includePeerEvaluation?: boolean;
};

type AssignmentType = {
  title: string;
  courseId: string;
  dueDate: Date;
  description: string;
  learningObjectives: string;
  quizSettings?: QuizSettingsType; // Optional
  groupSettings?: GroupSettingsType; // Optional
  createdBy: string; // User ID of the creator
};

// Create a new assignment
export async function createAssignment(assignmentData: AssignmentType) {
  await mongoDB.connect();

  // Input validation
  if (
    !assignmentData.title ||
    !assignmentData.courseId ||
    !assignmentData.dueDate ||
    !assignmentData.description ||
    !assignmentData.learningObjectives ||
    !assignmentData.createdBy
  ) {
    throw new Error(
        'All required fields (title, courseId, dueDate, description, learningObjectives, createdBy) must be provided.',
    );
  }

  // Create a new assignment
  const assignment = new Assignment(assignmentData);
  await assignment.save();

  return JSON.parse(JSON.stringify(assignment));
}

// Get an assignment by ID
export async function getAssignmentById(assignmentId: string, userId: string) {
  await mongoDB.connect();

  const assignment = await Assignment.findOne({_id: assignmentId, createdBy: userId});
  if (!assignment) {
    throw new Error('Assignment not found or you do not have access.');
  }

  return JSON.parse(JSON.stringify(assignment));
}

// Get all assignments for a user
export async function getAllAssignmentsByUser(userId: string) {
  await mongoDB.connect();

  const assignments = await Assignment.find({createdBy: userId});
  return JSON.parse(JSON.stringify(assignments));
}

// Update an assignment by ID
export async function updateAssignment(assignmentId: string, userId: string, updatedData: Partial<AssignmentType>) {
  await mongoDB.connect();

  const assignment = await Assignment.findOneAndUpdate({_id: assignmentId, createdBy: userId}, updatedData, {
    new: true,
  });
  if (!assignment) {
    throw new Error('Assignment not found or you do not have access.');
  }

  return JSON.parse(JSON.stringify(assignment));
}

// Delete an assignment by ID
export async function deleteAssignment(assignmentId: string, userId: string) {
  await mongoDB.connect();

  const assignment = await Assignment.findOneAndDelete({_id: assignmentId, createdBy: userId});
  if (!assignment) {
    throw new Error('Assignment not found or you do not have access.');
  }

  return JSON.parse(JSON.stringify(assignment));
}
