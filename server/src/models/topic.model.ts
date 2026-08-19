import mongoose, { Schema, Document, Model } from 'mongoose';

export type TopicDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ITopic extends Document {
  subjectId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  classLevel: number;
  difficulty: TopicDifficulty;
  parentTopicId?: mongoose.Types.ObjectId;
  prerequisiteTopicIds: mongoose.Types.ObjectId[];
  learningObjectives: string[];
  estimatedLearningMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema: Schema<ITopic> = new Schema(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    classLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    parentTopicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      index: true,
    },
    prerequisiteTopicIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
    learningObjectives: {
      type: [String],
      default: [],
    },
    estimatedLearningMinutes: {
      type: Number,
      default: 30,
      min: [0, 'Estimated minutes cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

export const Topic: Model<ITopic> = mongoose.model<ITopic>('Topic', TopicSchema);
