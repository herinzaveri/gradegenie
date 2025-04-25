import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
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
      },
      groupSettings: {
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
