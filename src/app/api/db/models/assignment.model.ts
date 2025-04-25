import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
    {
      assignmentType: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses',
        required: true,
      },
      dueDate: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      learningObjectives: {
        type: String,
        required: true,
      },
      quizSettings: {
        type: new mongoose.Schema({
          numberOfQuestions: {
            type: Number,
            required: true,
          },
          timeLimit: {
            type: Number,
            required: true,
          },
          randomizeQuestions: {
            type: Boolean,
            required: true,
          },
          showCorrectAnswers: {
            type: Boolean,
            required: true,
          },
        }, {_id: false}),
        required: false, // optional at the parent level
      },
      groupSettings: {
        type: new mongoose.Schema({
          groupSize: {
            type: Number,
            required: true,
          },
          groupFormation: {
            type: String,
            required: true,
          },
          includePeerEvaluation: {
            type: Boolean,
            required: true,
          },
        }, {_id: false}),
        required: false, // optional at the parent level
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    },
    {
      timestamps: true,
    },
);

const Assignment = mongoose.models.assignments || mongoose.model('assignments', AssignmentSchema);

export default Assignment;
