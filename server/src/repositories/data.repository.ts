import mongoose from 'mongoose';
import { isDBConnected } from '../services/db.js';
import { getInMemStudents, getInMemUserById } from '../controllers/auth.controller.js';

import { Subject, ISubject } from '../models/subject.model.js';
import { Topic, ITopic } from '../models/topic.model.js';
import { Scholarship, IScholarship } from '../models/scholarship.model.js';
import { StudentProfile, IStudentProfile } from '../models/student-profile.model.js';
import { LearningProfile, ILearningProfile } from '../models/learning-profile.model.js';
import { TopicMastery, ITopicMastery } from '../models/topic-mastery.model.js';
import { LearningGap, ILearningGap } from '../models/learning-gap.model.js';
import { EngagementEvent, IEngagementEvent } from '../models/engagement-event.model.js';
import { Class, IClass } from '../models/class.model.js';
import { StudyPlan, IStudyPlan } from '../models/study-plan.model.js';
import { ScholarshipMatch, IScholarshipMatch } from '../models/scholarship-match.model.js';
import { Conversation, IConversation } from '../models/conversation.model.js';
import { EducationalDocumentModel, IEducationalDocument } from '../models/educational-document.model.js';
import { EducationalChunkModel, IEducationalChunk } from '../models/educational-chunk.model.js';
import { LearningAnalysisEventModel, ILearningAnalysisEvent } from '../models/learning-analysis-event.model.js';
import { PracticeSessionModel, IPracticeSession } from '../models/practice-session.model.js';
import { Question, IQuestion } from '../models/question.model.js';
import { ScholarshipSourceModel, IScholarshipSource } from '../models/scholarship-source.model.js';
import { StudentScholarshipProfileModel, IStudentScholarshipProfile } from '../models/student-scholarship-profile.model.js';
import { Intervention, IIntervention } from '../models/intervention.model.js';
import { StudentSavedScholarship, IStudentSavedScholarship } from '../models/student-saved-scholarship.model.js';
import { ParentProfile, IParentProfile } from '../models/parent-profile.model.js';
import { ParentStudentLink, IParentStudentLink } from '../models/parent-student-link.model.js';
import { StudentGoal, IStudentGoal } from '../models/student-goal.model.js';
import { Achievement, IAchievement } from '../models/achievement.model.js';
import { ExamPreparationModel } from '../models/exam-preparation.model.js';
import { ExamTopicProgressModel } from '../models/exam-topic-progress.model.js';
import { CareerGoal, ICareerGoal } from '../models/career-goal.model.js';
import { NotificationModel, INotification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';

// In-Memory Storage Containers for Offline Mode
const inMemNotifications: any[] = [];
const inMemCareerGoals: any[] = [];
const inMemExamPreparations: any[] = [];
const inMemExamTopicProgresses: any[] = [];
const inMemExamPlans: Map<string, any> = new Map();
const inMemStudentGoals: any[] = [];
const inMemAchievements: any[] = [];
const inMemParentProfiles = new Map<string, any>();
const inMemParentStudentLinks: any[] = [];
const inMemParentInvitations: any[] = [];
const inMemSavedScholarships: any[] = [];
const inMemInterventions: any[] = [];
const inMemSubjects: any[] = [];
const inMemTopics: any[] = [];
const inMemScholarships: any[] = [
  {
    _id: 'sch_nmmss_08',
    id: 'sch_nmmss_08',
    name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    provider: 'Ministry of Education, Government of India',
    description: 'Financial assistance of ₹12,000 per annum to meritorious students from economically weaker sections.',
    eligibilityCriteria: [
      'Students studying in Class VIII in State Govt / Govt Aided schools',
      'Minimum 55% marks in Class VII examination',
      'Parental annual income from all sources not exceeding ₹3,50,000',
    ],
    requiredDocuments: ['Class VII Marksheet', 'Income Certificate', 'Caste Certificate (if applicable)'],
    applicationUrl: 'https://scholarships.gov.in',
    deadline: new Date('2026-10-31'),
    educationLevels: ['Class 8', 'Class 9', 'Class 10'],
    locations: ['All India'],
    incomeCriteria: 'Annual income <= ₹3,50,000',
    categoryCriteria: ['General', 'OBC', 'SC', 'ST'],
    status: 'active',
    source: 'official',
  },
  {
    _id: 'sch_samagra_08',
    id: 'sch_samagra_08',
    name: 'State Open Schooling Education Allowance',
    provider: 'Department of School Education & Literacy',
    description: 'Direct stipend, learning material kit, and mentoring support for out-of-school children (OOSC) re-entering mainstream education.',
    eligibilityCriteria: [
      'Out-of-school children enrolled via Special Training Centers',
      'Age group 6 to 14 years',
      'Registered under Samagra Shiksha OOSC portal',
    ],
    requiredDocuments: ['OOSC Registration Card', 'Aadhaar Card', 'Bank Passbook'],
    applicationUrl: 'https://samagrashiksha.gov.in',
    deadline: new Date('2026-12-31'),
    educationLevels: ['Elementary Education', 'Class 6-8'],
    locations: ['All India'],
    incomeCriteria: 'No strict income cap',
    categoryCriteria: ['All Categories'],
    status: 'active',
    source: 'official',
  },
];
const inMemStudentProfiles = new Map<string, any>();
const inMemLearningProfiles = new Map<string, any>();
const inMemTopicMasteries: any[] = [];
const inMemLearningGaps: any[] = [];
const inMemEngagementEvents: any[] = [];
const inMemClasses: any[] = [];
const inMemStudyPlans = new Map<string, any>();
const inMemConversations: any[] = [];
const inMemEducationalDocuments: any[] = [];
const inMemEducationalChunks: any[] = [];
const inMemLearningAnalysisEvents: any[] = [];
const inMemPracticeSessions: any[] = [];
const inMemQuestions: any[] = [];
const inMemScholarshipSources: any[] = [];
const inMemStudentScholarshipProfiles = new Map<string, any>();

export const dataRepository = {
  // --- SCHOLARSHIP INTELLIGENCE ---
  async getStudentScholarshipProfile(studentId: string): Promise<any> {
    if (isDBConnected()) {
      return await StudentScholarshipProfileModel.findOne({ studentId }).lean();
    }
    return inMemStudentScholarshipProfiles.get(studentId) || null;
  },

  async upsertStudentScholarshipProfile(studentId: string, profileData: Partial<IStudentScholarshipProfile>): Promise<any> {
    if (isDBConnected()) {
      return await StudentScholarshipProfileModel.findOneAndUpdate(
        { studentId },
        { $set: { ...profileData, lastUpdatedAt: new Date() } },
        { upsert: true, new: true }
      ).lean();
    }
    let existing = inMemStudentScholarshipProfiles.get(studentId);
    if (!existing) {
      existing = {
        _id: `ssp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        educationLevel: 'Class 8',
        classLevel: 8,
        board: 'NCERT',
        state: 'All India',
      };
      inMemStudentScholarshipProfiles.set(studentId, existing);
    }
    Object.assign(existing, profileData, { lastUpdatedAt: new Date() });
    return existing;
  },

  async createScholarshipSource(sourceData: Partial<IScholarshipSource>): Promise<any> {
    if (isDBConnected()) {
      return await ScholarshipSourceModel.create(sourceData);
    }
    const id = `ss_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newSource = { _id: id, id, ...sourceData, createdAt: new Date() };
    inMemScholarshipSources.push(newSource);
    return newSource;
  },

  async getScholarshipSourcesByScholarshipId(scholarshipId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ScholarshipSourceModel.find({ scholarshipId }).lean();
    }
    return inMemScholarshipSources.filter((s) => String(s.scholarshipId) === String(scholarshipId));
  },

  // --- ADAPTIVE PRACTICE ENGINE ---
  async createPracticeSession(sessionData: Partial<IPracticeSession>): Promise<any> {
    if (isDBConnected()) {
      const doc = await PracticeSessionModel.create(sessionData);
      return await PracticeSessionModel.findById(doc._id).populate('subjectId').populate('topicId').lean();
    }
    const id = `ps_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newSession = {
      _id: id,
      id,
      ...sessionData,
      currentQuestionIndex: sessionData.currentQuestionIndex || 0,
      completedQuestions: sessionData.completedQuestions || 0,
      correctAnswers: sessionData.correctAnswers || 0,
      score: sessionData.score || 0,
      status: sessionData.status || 'in_progress',
      startedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemPracticeSessions.push(newSession);
    return newSession;
  },

  async getPracticeSessions(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await PracticeSessionModel.find({ studentId }).sort({ createdAt: -1 }).populate('subjectId').populate('topicId').lean();
    }
    return inMemPracticeSessions
      .filter((s) => String(s.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getPracticeSessionById(studentId: string, sessionId: string): Promise<any> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(sessionId)) return null;
      return await PracticeSessionModel.findOne({ _id: sessionId, studentId }).populate('subjectId').populate('topicId').lean();
    }
    return inMemPracticeSessions.find(
      (s) => String(s._id || s.id) === String(sessionId) && String(s.studentId) === String(studentId)
    ) || null;
  },

  async updatePracticeSession(studentId: string, sessionId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(sessionId)) return null;
      return await PracticeSessionModel.findOneAndUpdate(
        { _id: sessionId, studentId },
        { $set: updateData },
        { new: true }
      ).populate('subjectId').populate('topicId').lean();
    }
    const existing = inMemPracticeSessions.find(
      (s) => String(s._id || s.id) === String(sessionId) && String(s.studentId) === String(studentId)
    );
    if (!existing) return null;
    Object.assign(existing, updateData, { updatedAt: new Date() });
    return existing;
  },

  async getQuestionsByTopic(topicId: string, difficulty?: string): Promise<any[]> {
    if (isDBConnected()) {
      const query: any = { topicId, status: 'validated' };
      if (difficulty) query.difficulty = difficulty;
      return await Question.find(query).lean();
    }
    return inMemQuestions.filter(
      (q) => String(q.topicId?._id || q.topicId) === String(topicId) && q.status === 'validated'
    );
  },

  // --- LEARNING INTELLIGENCE & GAP ENGINE ---
  async createLearningAnalysisEvent(eventData: Partial<ILearningAnalysisEvent>): Promise<any> {
    if (isDBConnected()) {
      return await LearningAnalysisEventModel.create(eventData);
    }
    const id = `lae_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newEvent = { _id: id, id, ...eventData, createdAt: new Date() };
    inMemLearningAnalysisEvents.push(newEvent);
    return newEvent;
  },

  async getLearningAnalysisEventByEvidenceId(evidenceId: string): Promise<any> {
    if (isDBConnected()) {
      return await LearningAnalysisEventModel.findOne({ evidenceId }).lean();
    }
    return inMemLearningAnalysisEvents.find((e) => e.evidenceId === evidenceId) || null;
  },

  async upsertTopicMastery(studentId: string, topicId: string, masteryData: Partial<ITopicMastery>): Promise<any> {
    if (isDBConnected()) {
      return await TopicMastery.findOneAndUpdate(
        { studentId, topicId },
        { $set: masteryData },
        { upsert: true, new: true }
      ).lean();
    }
    let existing = inMemTopicMasteries.find(
      (m) => String(m.studentId) === String(studentId) && String(m.topicId?._id || m.topicId) === String(topicId)
    );
    if (!existing) {
      existing = {
        _id: `tm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        id: `tm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        topicId,
        attempts: 0,
        correctAttempts: 0,
        incorrectAttempts: 0,
        masteryScore: 0,
        confidenceScore: 0,
        status: 'not_started',
      };
      inMemTopicMasteries.push(existing);
    }
    Object.assign(existing, masteryData);
    return existing;
  },

  async upsertLearningGap(studentId: string, gapData: Partial<ILearningGap>): Promise<any> {
    if (isDBConnected()) {
      return await LearningGap.findOneAndUpdate(
        { studentId, topicId: gapData.topicId, status: 'active' },
        { $set: { ...gapData, detectedAt: new Date() } },
        { upsert: true, new: true }
      ).lean();
    }
    let existing = inMemLearningGaps.find(
      (g) =>
        String(g.studentId) === String(studentId) &&
        String(g.topicId?._id || g.topicId) === String(gapData.topicId) &&
        g.status === 'active'
    );
    if (!existing) {
      existing = {
        _id: `gap_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        id: `gap_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        topicId: gapData.topicId,
        gapType: gapData.gapType || 'knowledge_gap',
        severity: gapData.severity || 'low',
        confidence: gapData.confidence || 0.5,
        evidence: gapData.evidence || '',
        status: 'active',
        detectedAt: new Date(),
      };
      inMemLearningGaps.push(existing);
    } else {
      Object.assign(existing, gapData);
    }
    return existing;
  },

  async getLearningGapById(studentId: string, gapId: string): Promise<any> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(gapId)) return null;
      return await LearningGap.findOne({ _id: gapId, studentId }).populate('topicId').lean();
    }
    return inMemLearningGaps.find(
      (g) => String(g._id || g.id) === String(gapId) && String(g.studentId) === String(studentId)
    ) || null;
  },

  async getStudentGaps(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await LearningGap.find({ studentId }).populate('topicId').lean();
    }
    return inMemLearningGaps.filter((g) => String(g.studentId) === String(studentId));
  },

  async resolveLearningGap(studentId: string, gapIdOrTopicId: string): Promise<boolean> {
    if (isDBConnected()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(gapIdOrTopicId);
      const query = isObjectId
        ? { _id: gapIdOrTopicId, studentId }
        : { studentId, topicId: gapIdOrTopicId, status: { $in: ['active', 'improving'] } };

      const res = await LearningGap.updateMany(query, {
        $set: { status: 'resolved', resolvedAt: new Date() },
      });
      return res.modifiedCount > 0;
    }
    let count = 0;
    inMemLearningGaps.forEach((g) => {
      if (
        String(g.studentId) === String(studentId) &&
        (String(g._id || g.id) === String(gapIdOrTopicId) || String(g.topicId?._id || g.topicId) === String(gapIdOrTopicId)) &&
        g.status !== 'resolved'
      ) {
        g.status = 'resolved';
        g.resolvedAt = new Date();
        count++;
      }
    });
    return count > 0;
  },

  async updateLearningProfileData(studentId: string, updateData: Partial<ILearningProfile>): Promise<any> {
    if (isDBConnected()) {
      return await LearningProfile.findOneAndUpdate(
        { studentId },
        { $set: updateData },
        { upsert: true, new: true }
      ).lean();
    }
    let existing = inMemLearningProfiles.get(studentId);
    if (!existing) {
      existing = {
        _id: `lp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        overallMastery: 0,
        confidenceScore: 0,
        strengths: [],
        weaknesses: [],
        learningGoals: [],
        recommendedTopics: [],
        currentLearningPath: [],
      };
      inMemLearningProfiles.set(studentId, existing);
    }
    Object.assign(existing, updateData);
    return existing;
  },

  // --- RAG KNOWLEDGE BASE (DOCUMENTS & CHUNKS) ---
  async createEducationalDocument(docData: Partial<IEducationalDocument>): Promise<any> {
    if (isDBConnected()) {
      return await EducationalDocumentModel.create(docData);
    }
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newDoc = { _id: id, id, ...docData, createdAt: new Date(), updatedAt: new Date() };
    inMemEducationalDocuments.push(newDoc);
    return newDoc;
  },

  async getEducationalDocumentByHash(contentHash: string): Promise<any> {
    if (isDBConnected()) {
      return await EducationalDocumentModel.findOne({ contentHash }).lean();
    }
    return inMemEducationalDocuments.find((d) => d.contentHash === contentHash) || null;
  },

  async getAllEducationalDocuments(): Promise<any[]> {
    if (isDBConnected()) {
      return await EducationalDocumentModel.find({ status: 'active' }).sort({ createdAt: -1 }).lean();
    }
    return inMemEducationalDocuments.filter((d) => d.status === 'active');
  },

  async createEducationalChunk(chunkData: Partial<IEducationalChunk>): Promise<any> {
    if (isDBConnected()) {
      return await EducationalChunkModel.create(chunkData);
    }
    const id = `chk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newChunk = { _id: id, id, ...chunkData, createdAt: new Date() };
    inMemEducationalChunks.push(newChunk);
    return newChunk;
  },

  async getEducationalChunksByDocumentId(documentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await EducationalChunkModel.find({ documentId }).sort({ chunkIndex: 1 }).lean();
    }
    return inMemEducationalChunks.filter((c) => String(c.documentId) === String(documentId));
  },

  async getEducationalChunksFilter(filter: { subject?: string; language?: string }): Promise<any[]> {
    if (isDBConnected()) {
      const query: any = {};
      if (filter.subject) query.subject = new RegExp(filter.subject, 'i');
      if (filter.language) query.language = filter.language;
      return await EducationalChunkModel.find(query).populate('documentId').lean();
    }
    return inMemEducationalChunks.filter((c) => {
      let match = true;
      if (filter.subject && !c.subject.toLowerCase().includes(filter.subject.toLowerCase())) match = false;
      if (filter.language && c.language !== filter.language) match = false;
      return match;
    });
  },

  // --- SUBJECTS ---
  async getAllSubjects(): Promise<any[]> {
    if (isDBConnected()) {
      return await Subject.find().sort({ name: 1 }).lean();
    }
    return [...inMemSubjects];
  },

  async seedSubject(subjectData: Partial<ISubject>): Promise<any> {
    if (isDBConnected()) {
      let existing = await Subject.findOne({ name: subjectData.name });
      if (!existing) {
        existing = await Subject.create(subjectData);
      }
      return existing;
    }
    let existing = inMemSubjects.find((s) => s.name === subjectData.name);
    if (!existing) {
      existing = {
        _id: `subj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        id: `subj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        ...subjectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemSubjects.push(existing);
    }
    return existing;
  },

  // --- TOPICS ---
  async getTopics(subjectId?: string, classLevel?: number): Promise<any[]> {
    if (isDBConnected()) {
      const filter: any = {};
      if (subjectId) filter.subjectId = subjectId;
      if (classLevel) filter.classLevel = classLevel;
      return await Topic.find(filter).populate('parentTopicId').populate('prerequisiteTopicIds').lean();
    }
    return inMemTopics.filter((t) => {
      let match = true;
      if (subjectId && String(t.subjectId) !== String(subjectId)) match = false;
      if (classLevel && t.classLevel !== Number(classLevel)) match = false;
      return match;
    });
  },

  async seedTopic(topicData: Partial<ITopic>): Promise<any> {
    if (isDBConnected()) {
      let existing = await Topic.findOne({ subjectId: topicData.subjectId, name: topicData.name });
      if (!existing) {
        existing = await Topic.create(topicData);
      }
      return existing;
    }
    let existing = inMemTopics.find(
      (t) => String(t.subjectId) === String(topicData.subjectId) && t.name === topicData.name
    );
    if (!existing) {
      existing = {
        _id: `top_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        id: `top_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        ...topicData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemTopics.push(existing);
    }
    return existing;
  },

  // --- SCHOLARSHIPS ---
  async getAllScholarships(): Promise<any[]> {
    if (isDBConnected()) {
      return await Scholarship.find().sort({ deadline: 1 }).lean();
    }
    return [...inMemScholarships];
  },

  async getScholarshipById(scholarshipId: string): Promise<any> {
    const list = await this.getAllScholarships();
    return list.find((s: any) => String(s._id || s.id) === String(scholarshipId)) || null;
  },

  async seedScholarship(scholarshipData: Partial<IScholarship>): Promise<any> {
    if (isDBConnected()) {
      let existing = await Scholarship.findOne({ name: scholarshipData.name });
      if (!existing) {
        existing = await Scholarship.create(scholarshipData);
      }
      return existing;
    }
    let existing = inMemScholarships.find((s) => s.name === scholarshipData.name);
    if (!existing) {
      existing = {
        _id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        ...scholarshipData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemScholarships.push(existing);
    }
    return existing;
  },

  // --- CONVERSATIONS & AI TUTOR ---
  async createConversation(
    studentId: string,
    payload: { title?: string; subjectId?: string; topicId?: string; language?: string }
  ): Promise<any> {
    const title = payload.title?.trim() || 'New Learning Doubt';

    if (isDBConnected()) {
      const conv = new Conversation({
        studentId,
        title,
        subjectId: payload.subjectId ? payload.subjectId : undefined,
        topicId: payload.topicId ? payload.topicId : undefined,
        language: payload.language || 'english',
        messages: [],
      });
      await conv.save();
      return await Conversation.findById(conv._id).populate('subjectId').populate('topicId').lean();
    } else {
      const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const now = new Date();
      const newConv = {
        _id: id,
        id,
        studentId,
        title,
        subjectId: payload.subjectId,
        topicId: payload.topicId,
        language: payload.language || 'english',
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      inMemConversations.push(newConv);
      return newConv;
    }
  },

  async getConversations(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await Conversation.find({ studentId }).sort({ updatedAt: -1 }).populate('subjectId').populate('topicId').lean();
    }
    return inMemConversations
      .filter((c) => String(c.studentId) === String(studentId))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async getConversationById(studentId: string, conversationId: string): Promise<any> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(conversationId)) return null;
      const conv = await Conversation.findOne({ _id: conversationId, studentId }).populate('subjectId').populate('topicId').lean();
      return conv;
    }
    const conv = inMemConversations.find(
      (c) => String(c._id || c.id) === String(conversationId) && String(c.studentId) === String(studentId)
    );
    return conv || null;
  },

  async deleteConversation(studentId: string, conversationId: string): Promise<boolean> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(conversationId)) return false;
      const res = await Conversation.deleteOne({ _id: conversationId, studentId });
      return res.deletedCount > 0;
    }
    const idx = inMemConversations.findIndex(
      (c) => String(c._id || c.id) === String(conversationId) && String(c.studentId) === String(studentId)
    );
    if (idx !== -1) {
      inMemConversations.splice(idx, 1);
      return true;
    }
    return false;
  },

  async addMessageToConversation(
    studentId: string,
    conversationId: string,
    message: { role: 'student' | 'tutor'; content: string; sources?: any[]; metadata?: any }
  ): Promise<any> {
    const msgObj = {
      role: message.role,
      content: message.content.trim(),
      timestamp: new Date(),
      sources: message.sources || [],
      metadata: message.metadata || {},
    };

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(conversationId)) return null;
      const conv = await Conversation.findOne({ _id: conversationId, studentId });
      if (!conv) return null;

      if (message.role === 'student' && (conv.title === 'New Learning Doubt' || !conv.title)) {
        conv.title = message.content.length > 35 ? `${message.content.substring(0, 35)}...` : message.content;
      }

      conv.messages.push(msgObj as any);
      conv.updatedAt = new Date();
      await conv.save();

      await EngagementEvent.create({
        studentId,
        eventType: message.role === 'student' ? 'question_asked' : 'resource_opened',
        metadata: { conversationId, contentSnippet: message.content.substring(0, 50) },
        timestamp: new Date(),
      });

      return await Conversation.findById(conv._id).populate('subjectId').populate('topicId').lean();
    } else {
      const conv = inMemConversations.find(
        (c) => String(c._id || c.id) === String(conversationId) && String(c.studentId) === String(studentId)
      );
      if (!conv) return null;

      if (message.role === 'student' && (conv.title === 'New Learning Doubt' || !conv.title)) {
        conv.title = message.content.length > 35 ? `${message.content.substring(0, 35)}...` : message.content;
      }

      const msgWithId = {
        _id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        ...msgObj,
      };

      conv.messages.push(msgWithId);
      conv.updatedAt = new Date();

      inMemEngagementEvents.push({
        studentId,
        eventType: message.role === 'student' ? 'question_asked' : 'resource_opened',
        metadata: { conversationId, contentSnippet: message.content.substring(0, 50) },
        timestamp: new Date(),
      });

      return conv;
    }
  },

  // --- STUDENT LEARNING DATA ---
  async getStudentProfile(studentId: string): Promise<any> {
    if (isDBConnected()) {
      return await StudentProfile.findOne({ userId: studentId }).lean();
    }
    return inMemStudentProfiles.get(studentId) || null;
  },

  async getLearningProfile(studentId: string): Promise<any> {
    if (isDBConnected()) {
      return await LearningProfile.findOne({ studentId })
        .populate({
          path: 'recommendedTopics',
          populate: { path: 'subjectId' },
        })
        .populate('currentLearningPath')
        .lean();
    }
    return inMemLearningProfiles.get(studentId) || null;
  },

  async getTopicMastery(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await TopicMastery.find({ studentId }).populate({ path: 'topicId', populate: { path: 'subjectId' } }).lean();
    }
    return inMemTopicMasteries.filter((m) => String(m.studentId) === String(studentId));
  },

  async getLearningGaps(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await LearningGap.find({ studentId }).populate({ path: 'topicId', populate: { path: 'subjectId' } }).sort({ detectedAt: -1 }).lean();
    }
    return inMemLearningGaps.filter((g) => String(g.studentId) === String(studentId));
  },

  async getEngagementEvents(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await EngagementEvent.find({ studentId }).sort({ timestamp: -1 }).limit(10).lean();
    }
    return inMemEngagementEvents
      .filter((e) => String(e.studentId) === String(studentId))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  },

  async getStudyPlan(studentId: string): Promise<any> {
    if (isDBConnected()) {
      return await StudyPlan.findOne({ studentId, status: 'active' }).populate('tasks.topicId').lean();
    }
    return inMemStudyPlans.get(studentId) || null;
  },

  async saveGeneratedStudyPlan(studentId: string, payload: any): Promise<any> {
    if (isDBConnected()) {
      // Archive older active plans for student
      await StudyPlan.updateMany({ studentId, status: 'active' }, { status: 'archived' });

      const newPlan = new StudyPlan({
        studentId,
        title: payload.title,
        description: payload.description,
        targetDate: payload.targetDate,
        goals: payload.goals,
        tasks: payload.tasks,
        status: 'active',
      });
      await newPlan.save();
      return await StudyPlan.findById(newPlan._id).populate('tasks.topicId').lean();
    } else {
      const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const tasksWithIds = (payload.tasks || []).map((t: any, idx: number) => ({
        _id: `task_${Date.now()}_${idx}`,
        id: `task_${Date.now()}_${idx}`,
        ...t,
      }));

      const planObj = {
        _id: planId,
        id: planId,
        studentId,
        title: payload.title,
        description: payload.description,
        targetDate: payload.targetDate,
        goals: payload.goals,
        tasks: tasksWithIds,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemStudyPlans.set(studentId, planObj);
      return planObj;
    }
  },

  async updateStudyPlanTask(studentId: string, taskId: string, completed: boolean): Promise<boolean> {
    if (isDBConnected()) {
      const plan = await StudyPlan.findOne({ studentId, status: 'active' });
      if (!plan) return false;
      const task = plan.tasks.find((t: any) => t._id.toString() === taskId || t.id === taskId);
      if (!task) return false;
      task.completed = completed;
      task.completedAt = completed ? new Date() : undefined;
      await plan.save();
      return true;
    } else {
      const plan = inMemStudyPlans.get(studentId);
      if (!plan || !plan.tasks) return false;
      const task = plan.tasks.find((t: any) => String(t._id || t.id) === String(taskId));
      if (!task) return false;
      task.completed = completed;
      task.completedAt = completed ? new Date() : undefined;
      return true;
    }
  },

  async getScholarshipMatches(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ScholarshipMatch.find({ studentId, status: 'potential_match' })
        .populate('scholarshipId')
        .sort({ matchScore: -1 })
        .limit(3)
        .lean();
    }
    return [];
  },

  // --- AGGREGATED DASHBOARD RESPONSE ---
  async getStudentDashboardData(studentId: string): Promise<any> {
    const [
      studentProfile,
      learningProfile,
      masteryList,
      learningGaps,
      recentActivity,
      studyPlan,
      scholarshipMatches,
      allSubjects,
    ] = await Promise.all([
      this.getStudentProfile(studentId),
      this.getLearningProfile(studentId),
      this.getTopicMastery(studentId),
      this.getLearningGaps(studentId),
      this.getEngagementEvents(studentId),
      this.getStudyPlan(studentId),
      this.getScholarshipMatches(studentId),
      this.getAllSubjects(),
    ]);

    const subjectPerformance = allSubjects.map((subj) => {
      const subjTopicsMastery = masteryList.filter((m) => {
        if (!m.topicId) return false;
        const sId = typeof m.topicId === 'object' && m.topicId.subjectId
          ? (typeof m.topicId.subjectId === 'object' ? m.topicId.subjectId._id : m.topicId.subjectId)
          : null;
        return String(sId) === String(subj._id || subj.id);
      });

      const avgMastery = subjTopicsMastery.length > 0
        ? Math.round(subjTopicsMastery.reduce((acc, curr) => acc + (curr.masteryScore || 0), 0) / subjTopicsMastery.length)
        : 0;

      return {
        subjectId: subj._id || subj.id,
        name: subj.name,
        code: subj.code,
        masteryScore: avgMastery,
        topicsAttempted: subjTopicsMastery.length,
      };
    });

    const masteredTopicsCount = masteryList.filter((m) => m.status === 'mastered' || (m.masteryScore || 0) >= 80).length;
    const needsReviewTopicsCount = masteryList.filter((m) => m.status === 'needs_review' || (m.masteryScore || 0) < 60).length;

    return {
      studentProfile: studentProfile || {
        classLevel: 8,
        educationBoard: 'NCERT',
        schoolName: '',
        preferredLanguage: 'english',
        currentStreak: 0,
        totalLearningMinutes: 0,
      },
      learningProfile: learningProfile || {
        overallMastery: 0,
        confidenceScore: 0,
        strengths: [],
        weaknesses: [],
        learningGoals: [],
        recommendedTopics: [],
        currentLearningPath: [],
      },
      stats: {
        masteredTopicsCount,
        needsReviewTopicsCount,
        activeGapsCount: learningGaps.filter((g) => g.status === 'active').length,
      },
      mastery: masteryList,
      learningGaps,
      recentActivity,
      studyPlan,
      scholarshipMatches,
      subjectPerformance,
    };
  },

  // --- TEACHER DATA ---
  async getTeacherClasses(teacherId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await Class.find({ teacherId }).populate('studentIds').populate('subjectIds').lean();
    }
    return inMemClasses.filter((c) => String(c.teacherId) === String(teacherId));
  },

  async getTeacherStudents(teacherId: string): Promise<any[]> {
    if (isDBConnected()) {
      const teacherClasses = await Class.find({ teacherId }).populate('studentIds').lean();
      const studentSet = new Map<string, any>();
      teacherClasses.forEach((cls) => {
        if (cls.studentIds && Array.isArray(cls.studentIds)) {
          cls.studentIds.forEach((std: any) => {
            if (std && std._id) studentSet.set(std._id.toString(), std);
          });
        }
      });
      const dbStudents = Array.from(studentSet.values());
      if (dbStudents.length > 0) return dbStudents;
      return await this.getStudents();
    }
    const studentSet = new Map<string, any>();
    inMemClasses.forEach((cls) => {
      if (String(cls.teacherId) === String(teacherId) && Array.isArray(cls.studentIds)) {
        cls.studentIds.forEach((std: any) => {
          const stdId = typeof std === 'string' ? std : std?._id || std?.id;
          if (stdId) studentSet.set(String(stdId), std);
        });
      }
    });
    const result = Array.from(studentSet.values());
    if (result.length > 0) return result;
    return await this.getStudents();
  },

  async validateTeacherStudentOwnership(teacherId: string, studentId: string): Promise<boolean> {
    const students = await this.getTeacherStudents(teacherId);
    return (students || []).some((s: any) => String(s._id || s.id) === String(studentId));
  },

  async getTeacherAnalyticsOverview(teacherId: string): Promise<any> {
    if (isDBConnected()) {
      const classes = await Class.find({ teacherId }).lean();
      const activeGapsCount = await LearningGap.countDocuments({ status: 'active' });
      return {
        totalClasses: classes.length,
        totalActiveGaps: activeGapsCount,
        recentActivityCount: 0,
      };
    }
    return {
      totalClasses: inMemClasses.filter((c) => String(c.teacherId) === String(teacherId)).length,
      totalActiveGaps: inMemLearningGaps.filter((g) => g.status === 'active').length,
      recentActivityCount: 0,
    };
  },

  async getStudentMistakes(studentId: string, limit: number = 20): Promise<any[]> {
    const sessions = await this.getPracticeSessions(studentId);
    const mistakes: any[] = [];

    sessions.forEach((s) => {
      if (s.questions && Array.isArray(s.questions)) {
        s.questions.forEach((q: any, idx: number) => {
          if (q.answeredAt && q.isCorrect === false) {
            const topicObj = typeof s.topicId === 'object' && s.topicId !== null ? s.topicId : null;
            const subjectObj = typeof s.subjectId === 'object' && s.subjectId !== null ? s.subjectId : null;

            mistakes.push({
              _id: `mistake_${s._id || s.id}_q${idx}`,
              id: `mistake_${s._id || s.id}_q${idx}`,
              sessionId: s._id || s.id,
              studentId,
              questionId: q._id || q.id || `q_${idx}`,
              questionText: q.questionText || q.question || 'Practice Question',
              options: q.options || [],
              studentAnswer: q.studentAnswer || '',
              correctAnswer: q.correctAnswer || '',
              isCorrect: false,
              subjectId: subjectObj?._id || s.subjectId,
              subjectName: subjectObj?.name || 'General Subject',
              topicId: topicObj?._id || s.topicId,
              topicName: topicObj?.name || 'Curriculum Topic',
              difficulty: s.difficulty || 'intermediate',
              storedExplanation: q.explanation || '',
              timestamp: q.answeredAt || s.completedAt || s.updatedAt || new Date(),
            });
          }
        });
      }
    });

    // Sort descending by timestamp
    return mistakes
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },

  // --- INTERVENTIONS ---
  async createIntervention(payload: Partial<IIntervention>): Promise<any> {
    if (isDBConnected()) {
      const doc = await Intervention.create(payload);
      return await Intervention.findById(doc._id)
        .populate('studentId', 'name email preferredLanguage')
        .populate('teacherId', 'name email')
        .populate('subjectId')
        .populate('topicId')
        .populate('classId')
        .lean();
    }

    const newDoc = {
      _id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      ...payload,
      status: payload.status || 'assigned',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemInterventions.push(newDoc);
    return newDoc;
  },

  async getTeacherInterventions(teacherId: string, filters: any = {}): Promise<any[]> {
    if (isDBConnected()) {
      const query: any = { teacherId };
      if (filters.classId) query.classId = filters.classId;
      if (filters.studentId) query.studentId = filters.studentId;
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;

      return await Intervention.find(query)
        .populate('studentId', 'name email preferredLanguage')
        .populate('subjectId')
        .populate('topicId')
        .populate('classId')
        .sort({ createdAt: -1 })
        .lean();
    }

    return inMemInterventions.filter((i) => {
      if (String(i.teacherId) !== String(teacherId)) return false;
      if (filters.classId && String(i.classId) !== String(filters.classId)) return false;
      if (filters.studentId && String(i.studentId) !== String(filters.studentId)) return false;
      if (filters.status && i.status !== filters.status) return false;
      if (filters.priority && i.priority !== filters.priority) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getTeacherInterventionById(teacherId: string, interventionId: string): Promise<any> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(interventionId)) return null;
      return await Intervention.findOne({ _id: interventionId, teacherId })
        .populate('studentId', 'name email preferredLanguage')
        .populate('subjectId')
        .populate('topicId')
        .populate('classId')
        .lean();
    }

    return (
      inMemInterventions.find(
        (i) => String(i._id || i.id) === String(interventionId) && String(i.teacherId) === String(teacherId)
      ) || null
    );
  },

  async getStudentInterventions(studentId: string, filters: any = {}): Promise<any[]> {
    if (isDBConnected()) {
      const query: any = { studentId };
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;

      return await Intervention.find(query)
        .populate('teacherId', 'name email')
        .populate('subjectId')
        .populate('topicId')
        .sort({ createdAt: -1 })
        .lean();
    }

    return inMemInterventions.filter((i) => {
      if (String(i.studentId) !== String(studentId)) return false;
      if (filters.status && i.status !== filters.status) return false;
      if (filters.priority && i.priority !== filters.priority) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getStudentInterventionById(studentId: string, interventionId: string): Promise<any> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(interventionId)) return null;
      return await Intervention.findOne({ _id: interventionId, studentId })
        .populate('teacherId', 'name email')
        .populate('subjectId')
        .populate('topicId')
        .lean();
    }

    return (
      inMemInterventions.find(
        (i) => String(i._id || i.id) === String(interventionId) && String(i.studentId) === String(studentId)
      ) || null
    );
  },

  async updateStudentInterventionStatus(studentId: string, interventionId: string, status: 'in_progress' | 'completed'): Promise<any> {
    const isCompleted = status === 'completed';
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };
    if (isCompleted) {
      updateData.completedAt = new Date();
    }

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(interventionId)) return null;
      return await Intervention.findOneAndUpdate(
        { _id: interventionId, studentId },
        { $set: updateData },
        { new: true }
      ).lean();
    }

    const item = inMemInterventions.find(
      (i) => String(i._id || i.id) === String(interventionId) && String(i.studentId) === String(studentId)
    );
    if (item) {
      item.status = status;
      item.updatedAt = new Date();
      if (isCompleted) item.completedAt = new Date();
    }
    return item || null;
  },

  async updateTeacherIntervention(teacherId: string, interventionId: string, updates: Partial<IIntervention>): Promise<any> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(interventionId)) return null;
      return await Intervention.findOneAndUpdate(
        { _id: interventionId, teacherId },
        { $set: updates },
        { new: true }
      ).lean();
    }

    const item = inMemInterventions.find(
      (i) => String(i._id || i.id) === String(interventionId) && String(i.teacherId) === String(teacherId)
    );
    if (item) {
      Object.assign(item, updates, { updatedAt: new Date() });
    }
    return item || null;
  },

  async getTeacherInterventionAnalytics(teacherId: string): Promise<any> {
    const list = await this.getTeacherInterventions(teacherId);

    const now = new Date();
    let totalAssigned = list.length;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;
    let cancelled = 0;

    list.forEach((item: any) => {
      if (item.status === 'in_progress') inProgress++;
      if (item.status === 'completed') completed++;
      if (item.status === 'cancelled') cancelled++;

      if (item.status !== 'completed' && item.dueDate && new Date(item.dueDate) < now) {
        overdue++;
      }
    });

    const completionRate = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;

    return {
      totalAssigned,
      inProgress,
      completed,
      overdue,
      cancelled,
      completionRate,
    };
  },

  // --- SAVED SCHOLARSHIPS & APPLICATION TRACKING ---
  async saveScholarship(studentId: string, scholarshipId: string): Promise<any> {
    if (isDBConnected()) {
      const doc = await StudentSavedScholarship.findOneAndUpdate(
        { studentId, scholarshipId },
        { $setOnInsert: { studentId, scholarshipId, applicationStatus: 'not_started', savedAt: new Date() } },
        { upsert: true, new: true }
      ).populate('scholarshipId').lean();
      return doc;
    }

    let existing = inMemSavedScholarships.find(
      (s) => String(s.studentId) === String(studentId) && String(s.scholarshipId) === String(scholarshipId)
    );
    if (!existing) {
      const schDoc = await this.getScholarshipById(scholarshipId);
      existing = {
        _id: `saved_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        scholarshipId: schDoc || scholarshipId,
        applicationStatus: 'not_started',
        savedAt: new Date(),
        updatedAt: new Date(),
      };
      inMemSavedScholarships.push(existing);
    }
    return existing;
  },

  async unsaveScholarship(studentId: string, scholarshipId: string): Promise<boolean> {
    if (isDBConnected()) {
      const res = await StudentSavedScholarship.deleteOne({ studentId, scholarshipId });
      return (res.deletedCount || 0) > 0;
    }

    const idx = inMemSavedScholarships.findIndex(
      (s) => String(s.studentId) === String(studentId) && String(s._id || s.scholarshipId?._id || s.scholarshipId) === String(scholarshipId) || (typeof s.scholarshipId === 'object' && String(s.scholarshipId._id || s.scholarshipId.id) === String(scholarshipId))
    );
    if (idx !== -1) {
      inMemSavedScholarships.splice(idx, 1);
      return true;
    }
    return false;
  },

  async getStudentSavedScholarships(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await StudentSavedScholarship.find({ studentId })
        .populate('scholarshipId')
        .sort({ savedAt: -1 })
        .lean();
    }

    return inMemSavedScholarships.filter(
      (s) => String(s.studentId) === String(studentId)
    ).sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  },

  async updateScholarshipApplicationStatus(
    studentId: string,
    scholarshipId: string,
    applicationStatus: 'not_started' | 'planning' | 'applied' | 'submitted' | 'closed'
  ): Promise<any> {
    if (isDBConnected()) {
      return await StudentSavedScholarship.findOneAndUpdate(
        { studentId, scholarshipId },
        { $set: { applicationStatus, updatedAt: new Date() } },
        { upsert: true, new: true }
      ).populate('scholarshipId').lean();
    }

    let existing = inMemSavedScholarships.find(
      (s) => String(s.studentId) === String(studentId) && (String(s.scholarshipId?._id || s.scholarshipId) === String(scholarshipId) || (typeof s.scholarshipId === 'object' && String(s.scholarshipId._id || s.scholarshipId.id) === String(scholarshipId)))
    );
    if (existing) {
      existing.applicationStatus = applicationStatus;
      existing.updatedAt = new Date();
    } else {
      const schDoc = await this.getScholarshipById(scholarshipId);
      existing = {
        _id: `saved_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        studentId,
        scholarshipId: schDoc || scholarshipId,
        applicationStatus,
        savedAt: new Date(),
        updatedAt: new Date(),
      };
      inMemSavedScholarships.push(existing);
    }
    return existing;
  },

  async getUserById(userId: string): Promise<any> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(userId)) return null;
      return await User.findById(userId).select('-passwordHash').lean();
    }
    return getInMemUserById(userId);
  },

  async getStudentStudyPlan(studentId: string): Promise<any> {
    return await this.getStudyPlan(studentId);
  },

  // --- PARENT / GUARDIAN LINKING & INSIGHTS ---
  async createParentInvitation(data: {
    studentId: string;
    code: string;
    relationship: string;
    expiresAt: Date;
  }): Promise<any> {
    if (isDBConnected()) {
      return await ParentStudentLink.create({
        parentId: new mongoose.Types.ObjectId(), // Placeholder until accepted
        studentId: data.studentId,
        relationship: data.relationship,
        status: 'pending',
        invitationCode: data.code,
        expiresAt: data.expiresAt,
      });
    }
    const inv = {
      _id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      studentId: data.studentId,
      code: data.code,
      relationship: data.relationship,
      status: 'pending',
      expiresAt: data.expiresAt,
      createdAt: new Date(),
    };
    inMemParentInvitations.push(inv);
    return inv;
  },

  async getParentInvitationByCode(code: string): Promise<any> {
    if (isDBConnected()) {
      return await ParentStudentLink.findOne({ invitationCode: code }).lean();
    }
    return inMemParentInvitations.find((i) => i.code === code) || null;
  },

  async getStudentInvitations(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ParentStudentLink.find({ studentId, status: { $in: ['pending', 'active'] } })
        .sort({ createdAt: -1 })
        .lean();
    }
    return inMemParentInvitations
      .filter((i) => String(i.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async revokeParentInvitation(studentId: string, code: string): Promise<boolean> {
    if (isDBConnected()) {
      const res = await ParentStudentLink.updateOne(
        { studentId, invitationCode: code },
        { $set: { status: 'revoked' } }
      );
      return res.modifiedCount > 0;
    }
    const inv = inMemParentInvitations.find(
      (i) => String(i.studentId) === String(studentId) && i.code === code
    );
    if (inv) {
      inv.status = 'revoked';
      return true;
    }
    return false;
  },

  async activateParentStudentLink(data: {
    parentId: string;
    studentId: string;
    relationship: string;
    code: string;
  }): Promise<any> {
    if (isDBConnected()) {
      const link = await ParentStudentLink.findOneAndUpdate(
        { invitationCode: data.code },
        {
          $set: {
            parentId: data.parentId,
            relationship: data.relationship,
            status: 'active',
            linkedAt: new Date(),
          },
        },
        { new: true }
      ).populate('studentId', 'name email preferredLanguage').lean();

      await ParentProfile.findOneAndUpdate(
        { userId: data.parentId },
        { $addToSet: { linkedStudentIds: data.studentId } },
        { upsert: true }
      );

      return link;
    }

    const inv = inMemParentInvitations.find((i) => i.code === data.code);
    if (inv) {
      inv.status = 'active';
      inv.parentId = data.parentId;
    }

    let link = inMemParentStudentLinks.find(
      (l) => String(l.parentId) === String(data.parentId) && String(l.studentId) === String(data.studentId)
    );
    if (!link) {
      const studentUser = (await this.getUserById(data.studentId)) || {
        _id: data.studentId,
        name: 'Student',
        email: 'student@example.com',
      };
      link = {
        _id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        parentId: data.parentId,
        studentId: studentUser,
        relationship: data.relationship,
        status: 'active',
        linkedAt: new Date(),
      };
      inMemParentStudentLinks.push(link);
    }
    return link;
  },

  async getLinkedStudentsForParent(parentId: string): Promise<any[]> {
    if (isDBConnected()) {
      const links = await ParentStudentLink.find({ parentId, status: 'active' })
        .populate('studentId', 'name email role preferredLanguage createdAt')
        .lean();
      return links.map((l) => ({
        linkId: l._id,
        relationship: l.relationship,
        linkedAt: l.linkedAt,
        student: l.studentId,
      }));
    }

    const links = inMemParentStudentLinks.filter(
      (l) => String(l.parentId) === String(parentId) && l.status === 'active'
    );
    return links.map((l) => ({
      linkId: l._id,
      relationship: l.relationship,
      linkedAt: l.linkedAt,
      student: typeof l.studentId === 'object' ? l.studentId : { _id: l.studentId, name: 'Student' },
    }));
  },

  async checkParentStudentLinkActive(parentId: string, studentId: string): Promise<boolean> {
    if (isDBConnected()) {
      const link = await ParentStudentLink.findOne({ parentId, studentId, status: 'active' }).lean();
      return !!link;
    }
    return inMemParentStudentLinks.some(
      (l) =>
        String(l.parentId) === String(parentId) &&
        String(l.studentId?.id || l.studentId?._id || l.studentId) === String(studentId) &&
        l.status === 'active'
    );
  },

  // --- STUDENT GOALS & ACHIEVEMENTS ---
  async createStudentGoal(data: any): Promise<any> {
    if (isDBConnected()) {
      const goal = new StudentGoal(data);
      return await goal.save();
    }

    const newGoal = {
      _id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      ...data,
      currentValue: data.currentValue || 0,
      progressPercent: data.progressPercent || 0,
      status: data.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemStudentGoals.push(newGoal);
    return newGoal;
  },

  async getStudentGoals(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await StudentGoal.find({ studentId }).sort({ createdAt: -1 }).lean();
    }

    return inMemStudentGoals
      .filter((g) => String(g.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getStudentGoalById(studentId: string, goalId: string): Promise<any> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(goalId)) return null;
      return await StudentGoal.findOne({ _id: goalId, studentId }).lean();
    }

    return (
      inMemStudentGoals.find(
        (g) => (String(g._id || g.id) === String(goalId)) && String(g.studentId) === String(studentId)
      ) || null
    );
  },

  async updateStudentGoal(studentId: string, goalId: string, updates: any): Promise<any> {
    // Prevent client overriding studentId
    delete updates.studentId;

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(goalId)) return null;
      return await StudentGoal.findOneAndUpdate(
        { _id: goalId, studentId },
        { $set: updates },
        { new: true }
      ).lean();
    }

    const item = inMemStudentGoals.find(
      (g) => (String(g._id || g.id) === String(goalId)) && String(g.studentId) === String(studentId)
    );
    if (item) {
      Object.assign(item, updates, { updatedAt: new Date() });
    }
    return item || null;
  },

  async deleteStudentGoal(studentId: string, goalId: string): Promise<boolean> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(goalId)) return false;
      const res = await StudentGoal.deleteOne({ _id: goalId, studentId });
      return res.deletedCount > 0;
    }

    const idx = inMemStudentGoals.findIndex(
      (g) => (String(g._id || g.id) === String(goalId)) && String(g.studentId) === String(studentId)
    );
    if (idx !== -1) {
      inMemStudentGoals.splice(idx, 1);
      return true;
    }
    return false;
  },

  async grantAchievementIdempotent(data: {
    studentId: string;
    achievementType: string;
    title: string;
    description: string;
    icon: string;
    evidenceType?: string;
    evidenceId?: string;
    metadata?: any;
  }): Promise<any> {
    const evidenceId = data.evidenceId || `${data.studentId}_${data.achievementType}`;

    if (isDBConnected()) {
      try {
        const doc = await Achievement.findOneAndUpdate(
          { studentId: data.studentId, achievementType: data.achievementType, evidenceId },
          {
            $setOnInsert: {
              ...data,
              evidenceId,
              earnedAt: new Date(),
            },
          },
          { upsert: true, new: true }
        ).lean();
        return doc;
      } catch (err: any) {
        if (err.code === 11000) {
          return await Achievement.findOne({
            studentId: data.studentId,
            achievementType: data.achievementType,
            evidenceId,
          }).lean();
        }
        throw err;
      }
    }

    let existing = inMemAchievements.find(
      (a) =>
        String(a.studentId) === String(data.studentId) &&
        a.achievementType === data.achievementType &&
        a.evidenceId === evidenceId
    );

    if (!existing) {
      existing = {
        _id: `ach_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        id: `ach_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        ...data,
        evidenceId,
        earnedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemAchievements.push(existing);
    }
    return existing;
  },

  async getStudentAchievements(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await Achievement.find({ studentId }).sort({ earnedAt: -1 }).lean();
    }

    return inMemAchievements
      .filter((a) => String(a.studentId) === String(studentId))
      .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());
  },

  async getAchievementSummary(studentId: string): Promise<any> {
    const achievements = await this.getStudentAchievements(studentId);
    const goals = await this.getStudentGoals(studentId);
    const practiceSessions = await this.getPracticeSessions(studentId);

    const completedGoals = (goals || []).filter((g) => g.status === 'completed').length;
    const practiceStreak = Math.min(30, practiceSessions?.length || 0);

    const categoriesCount: Record<string, number> = {
      practice: 0,
      streak: 0,
      mastery: 0,
      goals: 0,
      accuracy: 0,
    };

    (achievements || []).forEach((a) => {
      if (a.achievementType.includes('questions') || a.achievementType.includes('practice')) categoriesCount.practice++;
      else if (a.achievementType.includes('streak')) categoriesCount.streak++;
      else if (a.achievementType.includes('mastery') || a.achievementType.includes('topic')) categoriesCount.mastery++;
      else if (a.achievementType.includes('goal')) categoriesCount.goals++;
      else if (a.achievementType.includes('accuracy')) categoriesCount.accuracy++;
    });

    const nextMilestones = [
      { title: '10 Questions Solved', goalType: 'practice_questions', target: 10, current: (practiceSessions || []).reduce((s: number, p: any) => s + (p.completedQuestions || 0), 0) },
      { title: '7 Day Practice Streak', goalType: 'study_streak', target: 7, current: practiceStreak },
      { title: '5 Topics Mastered', goalType: 'topic_completion', target: 5, current: 0 },
    ];

    return {
      totalAchievements: achievements.length,
      recentAchievements: achievements.slice(0, 3),
      categoriesCount,
      nextMilestones,
      currentStreak: practiceStreak,
      goalsCompleted: completedGoals,
    };
  },

  // --- FEATURE 9: EXAM PREPARATION & READINESS ---
  async createExamPreparation(studentId: string, examInput: any): Promise<any> {
    const examData = {
      ...examInput,
      studentId,
      examDate: new Date(examInput.examDate),
      status: examInput.status || 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isDBConnected()) {
      const created = new ExamPreparationModel(examData);
      return await created.save();
    }

    const doc = {
      ...examData,
      _id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    };
    inMemExamPreparations.push(doc);
    return doc;
  },

  async getExamPreparations(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ExamPreparationModel.find({ studentId }).sort({ examDate: 1 }).lean();
    }

    return inMemExamPreparations.filter(
      (e) => String(e.studentId) === String(studentId) && e.status !== 'cancelled'
    );
  },

  async getExamPreparationById(studentId: string, examId: string): Promise<any | null> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(examId)) return null;
      return await ExamPreparationModel.findOne({ _id: examId, studentId }).lean();
    }

    return (
      inMemExamPreparations.find(
        (e) => String(e._id || e.id) === String(examId) && String(e.studentId) === String(studentId)
      ) || null
    );
  },

  async updateExamPreparation(studentId: string, examId: string, updates: any): Promise<any> {
    delete updates.studentId;

    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(examId)) return null;
      return await ExamPreparationModel.findOneAndUpdate(
        { _id: examId, studentId },
        { $set: updates },
        { new: true }
      ).lean();
    }

    const item = inMemExamPreparations.find(
      (e) => String(e._id || e.id) === String(examId) && String(e.studentId) === String(studentId)
    );
    if (!item) return null;

    Object.assign(item, updates, { updatedAt: new Date() });
    return item;
  },

  async deleteExamPreparation(studentId: string, examId: string): Promise<boolean> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(examId)) return false;
      const res = await ExamPreparationModel.deleteOne({ _id: examId, studentId });
      return res.deletedCount > 0;
    }

    const idx = inMemExamPreparations.findIndex(
      (e) => String(e._id || e.id) === String(examId) && String(e.studentId) === String(studentId)
    );
    if (idx !== -1) {
      inMemExamPreparations.splice(idx, 1);
      return true;
    }
    return false;
  },

  async saveExamPlan(studentId: string, examId: string, plan: any): Promise<any> {
    const key = `${studentId}_${examId}`;
    inMemExamPlans.set(key, plan);
    return plan;
  },

  async getExamPlan(studentId: string, examId: string): Promise<any | null> {
    const key = `${studentId}_${examId}`;
    return inMemExamPlans.get(key) || null;
  },

  async updateExamPlanTask(
    studentId: string,
    examId: string,
    taskId: string,
    completed: boolean
  ): Promise<any | null> {
    const key = `${studentId}_${examId}`;
    const plan = inMemExamPlans.get(key);
    if (!plan || !plan.tasks) return null;

    const task = plan.tasks.find((t: any) => String(t.taskId) === String(taskId));
    if (task) {
      task.completed = completed;
      task.completedAt = completed ? new Date().toISOString() : undefined;

      const completedCount = plan.tasks.filter((t: any) => t.completed).length;
      plan.completionPercentage = Math.round((completedCount / plan.tasks.length) * 100);
    }
    return plan;
  },

  // --- FEATURE 10: CAREER & SKILL ROADMAP ---
  async createCareerGoal(studentId: string, input: any): Promise<any> {
    const goalData = {
      studentId,
      targetRole: input.targetRole,
      targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
      status: input.status || 'active',
      notes: input.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isDBConnected()) {
      return await CareerGoal.create(goalData);
    }

    const doc = {
      ...goalData,
      _id: `cg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    };
    inMemCareerGoals.push(doc);
    return doc;
  },

  async getCareerGoals(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await CareerGoal.find({ studentId }).sort({ createdAt: -1 }).lean();
    }

    return inMemCareerGoals.filter(
      (g) => String(g.studentId) === String(studentId)
    );
  },

  async getCareerGoalById(studentId: string, goalId: string): Promise<any | null> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(goalId)) return null;
      return await CareerGoal.findOne({ _id: goalId, studentId }).lean();
    }

    return (
      inMemCareerGoals.find(
        (g) => String(g._id || g.id) === String(goalId) && String(g.studentId) === String(studentId)
      ) || null
    );
  },

  async deleteCareerGoal(studentId: string, goalId: string): Promise<boolean> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(goalId)) return false;
      const res = await CareerGoal.deleteOne({ _id: goalId, studentId });
      return res.deletedCount > 0;
    }

    const idx = inMemCareerGoals.findIndex(
      (g) => String(g._id || g.id) === String(goalId) && String(g.studentId) === String(studentId)
    );
    if (idx !== -1) {
      inMemCareerGoals.splice(idx, 1);
      return true;
    }
    return false;
  },

  // --- FEATURE 11: SMART NOTIFICATIONS & ALERTS ---
  async createNotification(notificationData: any): Promise<any> {
    const docData = {
      recipientUserId: notificationData.recipientUserId,
      recipientRole: notificationData.recipientRole,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      priority: notificationData.priority || 'normal',
      sourceType: notificationData.sourceType,
      sourceId: notificationData.sourceId,
      actionUrl: notificationData.actionUrl,
      isRead: false,
      dedupeKey: notificationData.dedupeKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isDBConnected()) {
      return await NotificationModel.create(docData);
    }

    const doc = {
      ...docData,
      _id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    };
    inMemNotifications.unshift(doc);
    return doc;
  },

  async getNotifications(options: { recipientUserId: string; isRead?: boolean; priority?: string; sourceType?: string; limit?: number }): Promise<any[]> {
    const { recipientUserId, isRead, priority, sourceType, limit = 50 } = options;

    if (isDBConnected()) {
      const query: any = { recipientUserId };
      if (typeof isRead === 'boolean') query.isRead = isRead;
      if (priority) query.priority = priority;
      if (sourceType) query.sourceType = sourceType;
      return await NotificationModel.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    }

    return inMemNotifications
      .filter((n) => {
        if (String(n.recipientUserId) !== String(recipientUserId)) return false;
        if (typeof isRead === 'boolean' && n.isRead !== isRead) return false;
        if (priority && n.priority !== priority) return false;
        if (sourceType && n.sourceType !== sourceType) return false;
        return true;
      })
      .slice(0, limit);
  },

  async getNotificationById(recipientUserId: string, notificationId: string): Promise<any | null> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(notificationId)) return null;
      return await NotificationModel.findOne({ _id: notificationId, recipientUserId }).lean();
    }

    return (
      inMemNotifications.find(
        (n) => String(n._id || n.id) === String(notificationId) && String(n.recipientUserId) === String(recipientUserId)
      ) || null
    );
  },

  async getNotificationByDedupeKey(recipientUserId: string, dedupeKey: string): Promise<any | null> {
    if (isDBConnected()) {
      return await NotificationModel.findOne({ recipientUserId, dedupeKey }).lean();
    }

    return (
      inMemNotifications.find(
        (n) => String(n.recipientUserId) === String(recipientUserId) && n.dedupeKey === dedupeKey
      ) || null
    );
  },

  async getUnreadNotificationCount(recipientUserId: string): Promise<number> {
    if (isDBConnected()) {
      return await NotificationModel.countDocuments({ recipientUserId, isRead: false });
    }

    return inMemNotifications.filter(
      (n) => String(n.recipientUserId) === String(recipientUserId) && !n.isRead
    ).length;
  },

  async markNotificationRead(recipientUserId: string, notificationId: string): Promise<any | null> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(notificationId)) return null;
      return await NotificationModel.findOneAndUpdate(
        { _id: notificationId, recipientUserId },
        { $set: { isRead: true, readAt: new Date() } },
        { new: true }
      ).lean();
    }

    const n = inMemNotifications.find(
      (item) => String(item._id || item.id) === String(notificationId) && String(item.recipientUserId) === String(recipientUserId)
    );
    if (n) {
      n.isRead = true;
      n.readAt = new Date();
      return n;
    }
    return null;
  },

  async markAllNotificationsRead(recipientUserId: string): Promise<number> {
    if (isDBConnected()) {
      const res = await NotificationModel.updateMany(
        { recipientUserId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );
      return res.modifiedCount;
    }

    let count = 0;
    inMemNotifications.forEach((n) => {
      if (String(n.recipientUserId) === String(recipientUserId) && !n.isRead) {
        n.isRead = true;
        n.readAt = new Date();
        count++;
      }
    });
    return count;
  },

  async deleteNotification(recipientUserId: string, notificationId: string): Promise<boolean> {
    if (isDBConnected()) {
      if (!mongoose.Types.ObjectId.isValid(notificationId)) return false;
      const res = await NotificationModel.deleteOne({ _id: notificationId, recipientUserId });
      return res.deletedCount > 0;
    }

    const idx = inMemNotifications.findIndex(
      (n) => String(n._id || n.id) === String(notificationId) && String(n.recipientUserId) === String(recipientUserId)
    );
    if (idx !== -1) {
      inMemNotifications.splice(idx, 1);
      return true;
    }
    return false;
  },

  async getMistakesByStudentId(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await PracticeSessionModel.aggregate([
        { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
        { $unwind: '$answers' },
        { $match: { 'answers.isCorrect': false } },
        { $project: { topicId: 1, questionId: '$answers.questionId', givenAnswer: '$answers.answer', reviewed: '$answers.reviewed' } },
      ]);
    }
    const mistakes: any[] = [];
    inMemPracticeSessions.forEach((s) => {
      if (String(s.studentId) === String(studentId) && Array.isArray(s.answers)) {
        s.answers.forEach((a: any) => {
          if (a.isCorrect === false) {
            mistakes.push({ ...a, topicId: s.topicId });
          }
        });
      }
    });
    return mistakes;
  },

  async getScholarships(): Promise<any[]> {
    if (isDBConnected()) {
      return await Scholarship.find({ status: 'active' }).lean();
    }
    return inMemScholarships;
  },

  async getParentStudentLinksByParentId(parentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ParentStudentLink.find({ parentId, status: 'active' }).lean();
    }
    return inMemParentStudentLinks.filter(
      (l) => String(l.parentId) === String(parentId) && l.status === 'active'
    );
  },

  async getStudents(): Promise<any[]> {
    if (isDBConnected()) {
      return await User.find({ role: 'student' }).select('_id name email preferredLanguage').lean();
    }
    return getInMemStudents();
  },
};
