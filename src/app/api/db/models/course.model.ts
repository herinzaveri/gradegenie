import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      instructorName: {
        type: String,
        required: true,
      },
      term: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      gradeLevel: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      learningObjectives: [{
        type: String,
        required: true,
      }],
      requiredMaterials: [{
        title: {
          type: String,
          required: true,
        },
        author: {
          type: String,
          required: true,
        },
        publisher: {
          type: String,
          required: true,
        },
        year: {
          type: String,
          required: true,
        },
        required: {
          type: Boolean,
          required: true,
        },
      }],
      gradingPolicy: [{
        description: {
          type: String,
          required: true,
        },
        percentage: {
          type: Number,
          required: true,
        },
      }],
      weeklySchedule: [{
        topic: {
          type: String,
          required: true,
        },
        readings: {
          type: String,
          required: true,
        },
        assignments: {
          type: String,
          required: true,
        },
      }],
      coursePolicies: [{
        type: String,
        required: true,
      }],
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

const Course = mongoose.models.courses || mongoose.model('courses', CourseSchema);

export default Course;
