import mongoose, { Schema, Document, Model } from 'mongoose';

export type EngagementEventType =
  | 'lesson_started'
  | 'lesson_completed'
  | 'question_asked'
  | 'practice_started'
  | 'practice_completed'
  | 'quiz_started'
  | 'quiz_completed'
  | 'resource_opened';

export interface IEngagementEvent extends Document {
  studentId: mongoose.Types.ObjectId;
  eventType: EngagementEventType;
  sessionId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const EngagementEventSchema: Schema<IEngagementEvent> = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventType: {
    type: String,
    enum: [
      'lesson_started',
      'lesson_completed',
      'question_asked',
      'practice_started',
      'practice_completed',
      'quiz_started',
      'quiz_completed',
      'resource_opened',
    ],
    required: true,
  },
  sessionId: {
    type: String,
    default: '',
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

EngagementEventSchema.index({ studentId: 1, timestamp: -1 });

export const EngagementEvent: Model<IEngagementEvent> = mongoose.model<IEngagementEvent>(
  'EngagementEvent',
  EngagementEventSchema
);
