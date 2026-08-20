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
import { LearningResource } from '../models/learning-resource.model.js';
import { ResourceInteraction } from '../models/resource-interaction.model.js';
import { ResourceBookmark } from '../models/resource-bookmark.model.js';
import { ResourceRecommendation } from '../models/resource-recommendation.model.js';
import { PracticeQuestion } from '../models/practice-question.model.js';
import { GeneratedQuestion } from '../models/generated-question.model.js';
import { PersonalizedAttempt } from '../models/personalized-attempt.model.js';
import { QuestionQuality } from '../models/question-quality.model.js';
import { VERIFIED_PRACTICE_QUESTION_BANK } from '../ai/personalized-practice/ai-coach.js';
import { MockExam } from '../models/mock-exam.model.js';
import { MockExamSection } from '../models/mock-exam-section.model.js';
import { MockExamQuestion } from '../models/mock-exam-question.model.js';
import { MockExamAttempt } from '../models/mock-exam-attempt.model.js';
import { MockExamAnswer } from '../models/mock-exam-answer.model.js';
import { MockExamResult } from '../models/mock-exam-result.model.js';
import { RevisionItem } from '../models/revision-item.model.js';
import { RevisionHistory } from '../models/revision-history.model.js';
import { RevisionSession } from '../models/revision-session.model.js';
import { KnowledgeConcept } from '../models/knowledge-concept.model.js';
import { ConceptDependency } from '../models/concept-dependency.model.js';
import { StudentConceptMastery } from '../models/student-concept-mastery.model.js';
import { AdaptiveAssessment } from '../models/adaptive-assessment.model.js';
import { AdaptiveAssessmentQuestion } from '../models/adaptive-assessment-question.model.js';
import { AdaptiveAssessmentAttempt } from '../models/adaptive-assessment-attempt.model.js';
import { AdaptiveAssessmentContext } from '../models/adaptive-assessment-context.model.js';
import { ExamPaper } from '../models/exam-paper.model.js';
import { ExamPaperSection } from '../models/exam-paper-section.model.js';
import { ExamPaperQuestion } from '../models/exam-paper-question.model.js';
import { ExamPaperAttempt } from '../models/exam-paper-attempt.model.js';
import { ExamPaperBlueprint } from '../models/exam-paper-blueprint.model.js';
import { ExamEvaluation } from '../models/exam-evaluation.model.js';
import { QuestionEvaluation } from '../models/question-evaluation.model.js';
import { TopicEvaluation } from '../models/topic-evaluation.model.js';
import { ConceptEvaluation } from '../models/concept-evaluation.model.js';
import { StudentMisconception } from '../models/student-misconception.model.js';
import { StudentDoubt } from '../models/student-doubt.model.js';
import { DoubtResponse } from '../models/doubt-response.model.js';
import { DoubtFollowup } from '../models/doubt-followup.model.js';
import { DoubtFeedback } from '../models/doubt-feedback.model.js';
import { StudyMaterial } from '../models/study-material.model.js';
import { StudyFlashcard } from '../models/study-flashcard.model.js';
import { DoubtSession } from '../models/doubt-session.model.js';
import { DoubtMessage } from '../models/doubt-message.model.js';
import { DoubtContext } from '../models/doubt-context.model.js';
import { StudentResourceRecommendation } from '../models/student-resource-recommendation.model.js';
import { StudentResourceProgress } from '../models/student-resource-progress.model.js';
import { LearningPath } from '../models/learning-path.model.js';
import { LearningPathStage } from '../models/learning-path-stage.model.js';
import { LearningPathTask } from '../models/learning-path-task.model.js';
import { LearningPathItem } from '../models/learning-path-item.model.js';
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
const inMemResourceProgress: any[] = [];
const inMemStudyMaterials: any[] = [];
const inMemStudyFlashcards: any[] = [];
const inMemDoubtSessions: any[] = [];
const inMemDoubtMessages: any[] = [];
const inMemDoubtContexts: any[] = [];
const inMemAssessmentQuestions: any[] = [];
const inMemAssessmentAttempts: any[] = [];
const inMemAssessmentContexts: any[] = [];
const inMemAdaptiveAssessments: any[] = [];
const inMemExamPapers: any[] = [];
const inMemExamPaperSections: any[] = [];
const inMemExamPaperQuestions: any[] = [];
const inMemExamPaperAttempts: any[] = [];
const inMemExamPaperBlueprints: any[] = [];
const inMemExamEvaluations: any[] = [];
const inMemQuestionEvaluations: any[] = [];
const inMemTopicEvaluations: any[] = [];
const inMemConceptEvaluations: any[] = [];
const inMemStudentMisconceptions: any[] = [];
const inMemStudentDoubts: any[] = [];
const inMemDoubtResponses: any[] = [];
const inMemDoubtFollowups: any[] = [];
const inMemDoubtFeedbacks: any[] = [];
const inMemLearningResources: any[] = [];
const inMemResourceInteractions: any[] = [];
const inMemResourceBookmarks: any[] = [];
const inMemResourceRecommendations: any[] = [];
const inMemPracticeQuestions: any[] = [];
const inMemGeneratedQuestions: any[] = [];
const inMemPersonalizedAttempts: any[] = [];
const inMemPersonalizedSessions: any[] = [];
const inMemMockExams: any[] = [];
const inMemMockExamSections: any[] = [];
const inMemMockExamQuestions: any[] = [];
const inMemMockExamAttempts: any[] = [];
const inMemMockExamAnswers: any[] = [];
const inMemMockExamResults: any[] = [];
const inMemRevisionHistory: any[] = [];
const inMemRevisionItems: any[] = [];
const inMemLearningPaths: any[] = [];
const inMemLearningPathStages: any[] = [];
const inMemLearningPathTasks: any[] = [];
const inMemLearningPathItems: any[] = [];
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

  async getRevisionItems(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await RevisionItem.find({ studentId }).lean();
    }
    return [];
  },

  async createRevisionSession(sessionData: any): Promise<any> {
    if (isDBConnected()) {
      return await RevisionSession.create(sessionData);
    }
    return sessionData;
  },

  async isParentLinkedToStudent(parentId: string, studentId: string): Promise<boolean> {
    if (isDBConnected()) {
      const link = await ParentStudentLink.findOne({ parentId, studentId, status: 'active' }).lean();
      return Boolean(link);
    }
    const links = await this.getParentStudentLinksByParentId(parentId);
    return (links || []).some(
      (l: any) => String(l.studentId) === String(studentId) || String(l.student) === String(studentId)
    );
  },

  async getStudentResourceProgressList(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await StudentResourceProgress.find({ studentId }).sort({ updatedAt: -1 }).lean();
    }
    return inMemResourceProgress
      .filter((rp) => String(rp.studentId) === String(studentId))
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  },

  async upsertResourceProgress(studentId: string, resourceId: string, progressData: any): Promise<any> {
    if (isDBConnected()) {
      return await StudentResourceProgress.findOneAndUpdate(
        { studentId, resourceId },
        { $set: progressData },
        { upsert: true, new: true }
      );
    }
    const idx = inMemResourceProgress.findIndex(
      (rp) => String(rp.studentId) === String(studentId) && rp.resourceId === resourceId
    );
    const item = { studentId, resourceId, ...progressData, updatedAt: new Date() };
    if (idx >= 0) {
      inMemResourceProgress[idx] = { ...inMemResourceProgress[idx], ...item };
    } else {
      inMemResourceProgress.push(item);
    }
    return item;
  },

  async getStudentRevisionItems(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await RevisionItem.find({ studentId }).sort({ nextReviewAt: 1 }).lean();
    }
    return inMemRevisionItems
      .filter((ri) => String(ri.studentId) === String(studentId))
      .sort((a, b) => new Date(a.nextReviewAt || 0).getTime() - new Date(b.nextReviewAt || 0).getTime());
  },

  async upsertRevisionItem(studentId: string, conceptId: string, itemData: any): Promise<any> {
    if (isDBConnected()) {
      return await RevisionItem.findOneAndUpdate(
        { studentId, conceptId },
        { $set: itemData },
        { upsert: true, new: true }
      );
    }
    const idx = inMemRevisionItems.findIndex(
      (ri) => String(ri.studentId) === String(studentId) && ri.conceptId === conceptId
    );
    const item = { studentId, conceptId, ...itemData, updatedAt: new Date() };
    if (idx >= 0) {
      inMemRevisionItems[idx] = { ...inMemRevisionItems[idx], ...item };
    } else {
      inMemRevisionItems.push(item);
    }
    return item;
  },

  async addRevisionHistory(historyData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new RevisionHistory(historyData);
      return await doc.save();
    }
    const item = { _id: `rev_hist_${Date.now()}`, ...historyData, createdAt: new Date() };
    inMemRevisionHistory.push(item);
    return item;
  },

  async getStudentRevisionHistoryList(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await RevisionHistory.find({ studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemRevisionHistory
      .filter((rh) => String(rh.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  async getStudentLearningPaths(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await LearningPath.find({ studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemLearningPaths.filter((lp) => String(lp.studentId) === String(studentId));
  },

  async upsertLearningPath(studentId: string, pathId: string, pathData: any): Promise<any> {
    if (isDBConnected()) {
      if (mongoose.Types.ObjectId.isValid(pathId)) {
        return await LearningPath.findOneAndUpdate({ _id: pathId, studentId }, { $set: pathData }, { upsert: true, new: true });
      }
      return await LearningPath.findOneAndUpdate({ studentId }, { $set: pathData }, { upsert: true, new: true });
    }
    const idx = inMemLearningPaths.findIndex(
      (lp) => String(lp.studentId) === String(studentId) && String(lp._id || lp.id) === String(pathId)
    );
    const item = { _id: pathId, studentId, ...pathData, updatedAt: new Date() };
    if (idx >= 0) {
      inMemLearningPaths[idx] = { ...inMemLearningPaths[idx], ...item };
    } else {
      inMemLearningPaths.push(item);
    }
    return item;
  },

  async getLearningPathStages(learningPathId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await LearningPathStage.find({ learningPathId }).sort({ stageIndex: 1 }).lean();
    }
    return inMemLearningPathStages
      .filter((s) => String(s.learningPathId) === String(learningPathId))
      .sort((a, b) => a.stageIndex - b.stageIndex);
  },

  async upsertLearningPathStage(learningPathId: string, stageIndex: number, stageData: any): Promise<any> {
    if (isDBConnected()) {
      return await LearningPathStage.findOneAndUpdate(
        { learningPathId, stageIndex },
        { $set: stageData },
        { upsert: true, new: true }
      );
    }
    const idx = inMemLearningPathStages.findIndex(
      (s) => String(s.learningPathId) === String(learningPathId) && s.stageIndex === stageIndex
    );
    const item = { _id: `stage_${stageIndex}`, learningPathId, stageIndex, ...stageData, updatedAt: new Date() };
    if (idx >= 0) {
      inMemLearningPathStages[idx] = { ...inMemLearningPathStages[idx], ...item };
    } else {
      inMemLearningPathStages.push(item);
    }
    return item;
  },

  async getLearningPathTasks(learningPathId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await LearningPathTask.find({ learningPathId }).sort({ createdAt: 1 }).lean();
    }
    return inMemLearningPathTasks.filter((t) => String(t.learningPathId) === String(learningPathId));
  },

  async upsertLearningPathTask(learningPathId: string, stageId: string, conceptId: string, taskData: any): Promise<any> {
    if (isDBConnected()) {
      return await LearningPathTask.findOneAndUpdate(
        { learningPathId, stageId, conceptId },
        { $set: taskData },
        { upsert: true, new: true }
      );
    }
    const idx = inMemLearningPathTasks.findIndex(
      (t) => String(t.learningPathId) === String(learningPathId) && String(t.stageId) === String(stageId) && t.conceptId === conceptId
    );
    const item = { _id: `task_${stageId}_${conceptId}`, learningPathId, stageId, conceptId, ...taskData, updatedAt: new Date() };
    if (idx >= 0) {
      inMemLearningPathTasks[idx] = { ...inMemLearningPathTasks[idx], ...item };
    } else {
      inMemLearningPathTasks.push(item);
    }
    return item;
  },

  async createLearningPath(studentId: string, pathData: any): Promise<any> {
    return await this.upsertLearningPath(studentId, `path_${Date.now()}`, pathData);
  },

  async getLearningPath(pathId: string, studentId?: string): Promise<any> {
    if (isDBConnected()) {
      const query: any = { _id: pathId };
      if (studentId) query.studentId = studentId;
      return await LearningPath.findOne(query).lean();
    }
    return inMemLearningPaths.find(
      (lp) => String(lp._id || lp.id) === String(pathId) && (!studentId || String(lp.studentId) === String(studentId))
    );
  },

  async updateLearningPath(pathId: string, studentId: string, updateData: any): Promise<any> {
    return await this.upsertLearningPath(studentId, pathId, updateData);
  },

  async createLearningPathStage(stageData: any): Promise<any> {
    return await this.upsertLearningPathStage(
      stageData.learningPathId,
      stageData.stageOrder || stageData.stageIndex || 1,
      stageData
    );
  },

  async updateLearningPathStage(stageId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await LearningPathStage.findOneAndUpdate({ _id: stageId }, { $set: updateData }, { new: true });
    }
    const idx = inMemLearningPathStages.findIndex((s) => String(s._id || s.id) === String(stageId));
    if (idx >= 0) {
      inMemLearningPathStages[idx] = { ...inMemLearningPathStages[idx], ...updateData, updatedAt: new Date() };
      return inMemLearningPathStages[idx];
    }
    return null;
  },

  async createLearningPathItem(itemData: any): Promise<any> {
    if (isDBConnected()) {
      const item = new LearningPathItem(itemData);
      return await item.save();
    }
    const item = { _id: `item_${Date.now()}_${Math.random()}`, ...itemData, createdAt: new Date() };
    inMemLearningPathItems.push(item);
    return item;
  },

  async getLearningPathItems(learningPathId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await LearningPathItem.find({ learningPathId }).sort({ order: 1 }).lean();
    }
    return inMemLearningPathItems
      .filter((i) => String(i.learningPathId) === String(learningPathId))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async updateLearningPathItem(itemId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await LearningPathItem.findOneAndUpdate({ _id: itemId }, { $set: updateData }, { new: true });
    }
    const idx = inMemLearningPathItems.findIndex((i) => String(i._id || i.id) === String(itemId));
    if (idx >= 0) {
      inMemLearningPathItems[idx] = { ...inMemLearningPathItems[idx], ...updateData, updatedAt: new Date() };
      return inMemLearningPathItems[idx];
    }
    return null;
  },

  async completeLearningPathItem(itemId: string, studentId: string): Promise<any> {
    return await this.updateLearningPathItem(itemId, {
      status: 'completed',
      completedAt: new Date(),
    });
  },

  async skipLearningPathItem(itemId: string, studentId: string): Promise<any> {
    return await this.updateLearningPathItem(itemId, {
      status: 'skipped',
    });
  },

  async createLearningResource(resourceData: any): Promise<any> {
    if (isDBConnected()) {
      return await LearningResource.findOneAndUpdate(
        { resourceId: resourceData.resourceId },
        { $set: resourceData },
        { upsert: true, new: true }
      );
    }
    const idx = inMemLearningResources.findIndex((r) => r.resourceId === resourceData.resourceId);
    const item = { _id: `res_${Date.now()}_${Math.random()}`, ...resourceData, updatedAt: new Date() };
    if (idx >= 0) {
      inMemLearningResources[idx] = { ...inMemLearningResources[idx], ...item };
    } else {
      inMemLearningResources.push(item);
    }
    return item;
  },

  async getLearningResource(resourceId: string): Promise<any> {
    if (isDBConnected()) {
      return await LearningResource.findOne({ resourceId }).lean();
    }
    return inMemLearningResources.find((r) => r.resourceId === resourceId);
  },

  async getLearningResources(filter: any = {}): Promise<any[]> {
    if (isDBConnected()) {
      return await LearningResource.find(filter).lean();
    }
    return inMemLearningResources;
  },

  async createRecommendation(recData: any): Promise<any> {
    if (isDBConnected()) {
      return await StudentResourceRecommendation.findOneAndUpdate(
        { studentId: recData.studentId, dedupeKey: recData.dedupeKey },
        { $set: recData },
        { upsert: true, new: true }
      );
    }
    const idx = inMemResourceRecommendations.findIndex(
      (r) => String(r.studentId) === String(recData.studentId) && r.dedupeKey === recData.dedupeKey
    );
    const item = { _id: `rec_${Date.now()}_${Math.random()}`, ...recData, updatedAt: new Date() };
    if (idx >= 0) {
      inMemResourceRecommendations[idx] = { ...inMemResourceRecommendations[idx], ...item };
      return inMemResourceRecommendations[idx];
    }
    inMemResourceRecommendations.push(item);
    return item;
  },

  async getStudentRecommendations(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await StudentResourceRecommendation.find({ studentId }).sort({ relevanceScore: -1 }).lean();
    }
    return inMemResourceRecommendations
      .filter((r) => String(r.studentId) === String(studentId))
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  },

  async getTodayRecommendations(studentId: string): Promise<any[]> {
    const recs = await this.getStudentRecommendations(studentId);
    return recs.filter((r) => r.status === 'recommended' || r.status === 'started').slice(0, 5);
  },

  async getNextRecommendation(studentId: string): Promise<any> {
    const recs = await this.getTodayRecommendations(studentId);
    return recs[0] || null;
  },

  async updateRecommendation(recId: string, studentId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await StudentResourceRecommendation.findOneAndUpdate(
        { _id: recId, studentId },
        { $set: updateData },
        { new: true }
      );
    }
    const idx = inMemResourceRecommendations.findIndex(
      (r) => String(r._id || r.id) === String(recId) && String(r.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemResourceRecommendations[idx] = {
        ...inMemResourceRecommendations[idx],
        ...updateData,
        updatedAt: new Date(),
      };
      return inMemResourceRecommendations[idx];
    }
    return null;
  },

  async startRecommendation(recId: string, studentId: string): Promise<any> {
    return await this.updateRecommendation(recId, studentId, {
      status: 'started',
      startedAt: new Date(),
    });
  },

  async completeRecommendation(recId: string, studentId: string): Promise<any> {
    return await this.updateRecommendation(recId, studentId, {
      status: 'completed',
      completedAt: new Date(),
    });
  },

  async dismissRecommendation(recId: string, studentId: string): Promise<any> {
    return await this.updateRecommendation(recId, studentId, {
      status: 'dismissed',
      dismissedAt: new Date(),
    });
  },

  async getRecommendationHistory(studentId: string): Promise<any[]> {
    const recs = await this.getStudentRecommendations(studentId);
    return recs.filter((r) => r.status === 'completed' || r.status === 'dismissed');
  },

  async getRecommendationSummary(studentId: string): Promise<any> {
    const recs = await this.getStudentRecommendations(studentId);
    const active = recs.filter((r) => r.status !== 'dismissed');
    return {
      studentId,
      totalRecommended: active.length,
      completed: recs.filter((r) => r.status === 'completed').length,
      topRecommendation: active[0] || null,
    };
  },

  async createStudyMaterial(materialData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new StudyMaterial(materialData);
      return await doc.save();
    }
    const item = { _id: `mat_${Date.now()}_${Math.random()}`, ...materialData, createdAt: new Date(), updatedAt: new Date() };
    inMemStudyMaterials.push(item);
    return item;
  },

  async getStudyMaterial(materialId: string, studentId?: string): Promise<any> {
    if (isDBConnected()) {
      const query: any = { _id: materialId };
      if (studentId) query.studentId = studentId;
      return await StudyMaterial.findOne(query).lean();
    }
    return inMemStudyMaterials.find(
      (m) => (String(m._id || m.id) === String(materialId) || m.materialId === materialId) && (!studentId || String(m.studentId) === String(studentId))
    );
  },

  async getStudentStudyMaterials(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await StudyMaterial.find({ studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemStudyMaterials
      .filter((m) => String(m.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  async getRecommendedStudyMaterials(studentId: string): Promise<any[]> {
    return await this.getStudentStudyMaterials(studentId);
  },

  async updateStudyMaterial(materialId: string, studentId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await StudyMaterial.findOneAndUpdate({ _id: materialId, studentId }, { $set: updateData }, { new: true });
    }
    const idx = inMemStudyMaterials.findIndex(
      (m) => (String(m._id || m.id) === String(materialId) || m.materialId === materialId) && String(m.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemStudyMaterials[idx] = { ...inMemStudyMaterials[idx], ...updateData, updatedAt: new Date() };
      return inMemStudyMaterials[idx];
    }
    return null;
  },

  async archiveStudyMaterial(materialId: string, studentId: string): Promise<any> {
    return await this.updateStudyMaterial(materialId, studentId, { status: 'archived' });
  },

  async createFlashcard(flashcardData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new StudyFlashcard(flashcardData);
      return await doc.save();
    }
    const item = { _id: `fc_${Date.now()}_${Math.random()}`, ...flashcardData, createdAt: new Date() };
    inMemStudyFlashcards.push(item);
    return item;
  },

  async getFlashcards(materialId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await StudyFlashcard.find({ materialId }).sort({ order: 1 }).lean();
    }
    return inMemStudyFlashcards
      .filter((fc) => String(fc.materialId) === String(materialId))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async reviewFlashcard(flashcardId: string, studentId: string, outcome: string): Promise<any> {
    const nextStatus = outcome === 'again' ? 'due' : outcome === 'easy' ? 'mastered' : 'active';
    if (isDBConnected()) {
      return await StudyFlashcard.findOneAndUpdate({ _id: flashcardId, studentId }, { $set: { status: nextStatus } }, { new: true });
    }
    const idx = inMemStudyFlashcards.findIndex(
      (fc) => String(fc._id || fc.id) === String(flashcardId) && String(fc.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemStudyFlashcards[idx] = { ...inMemStudyFlashcards[idx], status: nextStatus, updatedAt: new Date() };
      return inMemStudyFlashcards[idx];
    }
    return null;
  },

  async getStudyMaterialHistory(studentId: string): Promise<any[]> {
    const materials = await this.getStudentStudyMaterials(studentId);
    return materials.filter((m) => m.status === 'archived');
  },

  async getStudyMaterialSummary(studentId: string): Promise<any> {
    const materials = await this.getStudentStudyMaterials(studentId);
    const ready = materials.filter((m) => m.status === 'ready');
    return {
      studentId,
      totalMaterials: ready.length,
      topMaterial: ready[0] || null,
    };
  },

  async createDoubtSession(sessionData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new DoubtSession(sessionData);
      return await doc.save();
    }
    const item = { _id: `ds_${Date.now()}_${Math.random()}`, ...sessionData, createdAt: new Date(), updatedAt: new Date(), lastActivityAt: new Date() };
    inMemDoubtSessions.push(item);
    return item;
  },

  async getDoubtSession(sessionId: string, studentId?: string): Promise<any> {
    if (isDBConnected()) {
      const query: any = { _id: sessionId };
      if (studentId) query.studentId = studentId;
      return await DoubtSession.findOne(query).lean();
    }
    return inMemDoubtSessions.find(
      (s) => (String(s._id || s.id) === String(sessionId) || s.sessionId === sessionId) && (!studentId || String(s.studentId) === String(studentId))
    );
  },

  async getStudentDoubtSessions(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await DoubtSession.find({ studentId }).sort({ lastActivityAt: -1 }).lean();
    }
    return inMemDoubtSessions
      .filter((s) => String(s.studentId) === String(studentId))
      .sort((a, b) => new Date(b.lastActivityAt || 0).getTime() - new Date(a.lastActivityAt || 0).getTime());
  },

  async updateDoubtSession(sessionId: string, studentId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await DoubtSession.findOneAndUpdate({ _id: sessionId, studentId }, { $set: updateData }, { new: true });
    }
    const idx = inMemDoubtSessions.findIndex(
      (s) => (String(s._id || s.id) === String(sessionId) || s.sessionId === sessionId) && String(s.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemDoubtSessions[idx] = { ...inMemDoubtSessions[idx], ...updateData, updatedAt: new Date() };
      return inMemDoubtSessions[idx];
    }
    return null;
  },

  async deleteDoubtSession(sessionId: string, studentId: string): Promise<boolean> {
    if (isDBConnected()) {
      const res = await DoubtSession.deleteOne({ _id: sessionId, studentId });
      return res.deletedCount > 0;
    }
    const idx = inMemDoubtSessions.findIndex(
      (s) => (String(s._id || s.id) === String(sessionId) || s.sessionId === sessionId) && String(s.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemDoubtSessions.splice(idx, 1);
      return true;
    }
    return false;
  },

  async createDoubtMessage(messageData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new DoubtMessage(messageData);
      return await doc.save();
    }
    const item = { _id: `msg_${Date.now()}_${Math.random()}`, ...messageData, createdAt: new Date() };
    inMemDoubtMessages.push(item);
    return item;
  },

  async getDoubtMessages(sessionId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await DoubtMessage.find({ sessionId }).sort({ createdAt: 1 }).lean();
    }
    return inMemDoubtMessages
      .filter((m) => String(m.sessionId) === String(sessionId))
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  },

  async saveDoubtContext(contextData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new DoubtContext(contextData);
      return await doc.save();
    }
    const item = { _id: `ctx_${Date.now()}_${Math.random()}`, ...contextData, capturedAt: new Date() };
    inMemDoubtContexts.push(item);
    return item;
  },

  async getDoubtContext(sessionId: string): Promise<any> {
    if (isDBConnected()) {
      return await DoubtContext.findOne({ sessionId }).sort({ capturedAt: -1 }).lean();
    }
    return inMemDoubtContexts.find((c) => String(c.sessionId) === String(sessionId)) || null;
  },

  async addDoubtFeedback(messageId: string, studentId: string, isHelpful: boolean): Promise<any> {
    if (isDBConnected()) {
      return await DoubtMessage.findOneAndUpdate({ _id: messageId, studentId }, { $set: { isHelpful } }, { new: true });
    }
    const idx = inMemDoubtMessages.findIndex(
      (m) => (String(m._id || m.id) === String(messageId) || m.messageId === messageId) && String(m.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemDoubtMessages[idx] = { ...inMemDoubtMessages[idx], isHelpful };
      return inMemDoubtMessages[idx];
    }
    return null;
  },

  async getDoubtSummary(studentId: string): Promise<any> {
    const sessions = await this.getStudentDoubtSessions(studentId);
    return {
      studentId,
      totalSessions: sessions.length,
      activeSessions: sessions.filter((s) => s.status === 'active').length,
    };
  },

  async createAdaptiveAssessment(asstData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new AdaptiveAssessment(asstData);
      return await doc.save();
    }
    const item = { _id: `asst_${Date.now()}_${Math.random()}`, ...asstData, createdAt: new Date(), updatedAt: new Date() };
    inMemAdaptiveAssessments.push(item);
    return item;
  },

  async getAdaptiveAssessment(assessmentId: string, studentId?: string): Promise<any> {
    if (isDBConnected()) {
      const query: any = { _id: assessmentId };
      if (studentId) query.studentId = studentId;
      return await AdaptiveAssessment.findOne(query).lean();
    }
    return inMemAdaptiveAssessments.find(
      (a) => (String(a._id || a.id) === String(assessmentId) || a.assessmentId === assessmentId) && (!studentId || String(a.studentId) === String(studentId))
    );
  },

  async getStudentAdaptiveAssessments(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await AdaptiveAssessment.find({ studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemAdaptiveAssessments
      .filter((a) => String(a.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  async updateAdaptiveAssessment(assessmentId: string, studentId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await AdaptiveAssessment.findOneAndUpdate({ _id: assessmentId, studentId }, { $set: updateData }, { new: true });
    }
    const idx = inMemAdaptiveAssessments.findIndex(
      (a) => (String(a._id || a.id) === String(assessmentId) || a.assessmentId === assessmentId) && String(a.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemAdaptiveAssessments[idx] = { ...inMemAdaptiveAssessments[idx], ...updateData, updatedAt: new Date() };
      return inMemAdaptiveAssessments[idx];
    }
    return null;
  },

  async deleteAdaptiveAssessment(assessmentId: string, studentId: string): Promise<boolean> {
    if (isDBConnected()) {
      const res = await AdaptiveAssessment.deleteOne({ _id: assessmentId, studentId });
      return res.deletedCount > 0;
    }
    const idx = inMemAdaptiveAssessments.findIndex(
      (a) => (String(a._id || a.id) === String(assessmentId) || a.assessmentId === assessmentId) && String(a.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemAdaptiveAssessments.splice(idx, 1);
      return true;
    }
    return false;
  },

  async createAssessmentQuestion(qData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new AdaptiveAssessmentQuestion(qData);
      return await doc.save();
    }
    const item = { _id: `q_${Date.now()}_${Math.random()}`, ...qData, createdAt: new Date() };
    inMemAssessmentQuestions.push(item);
    return item;
  },

  async getAssessmentQuestions(assessmentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await AdaptiveAssessmentQuestion.find({ assessmentId }).sort({ sequence: 1 }).lean();
    }
    return inMemAssessmentQuestions
      .filter((q) => String(q.assessmentId) === String(assessmentId))
      .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  },

  async getAssessmentQuestion(questionId: string): Promise<any> {
    if (isDBConnected()) {
      return await AdaptiveAssessmentQuestion.findOne({ _id: questionId }).lean();
    }
    return inMemAssessmentQuestions.find((q) => String(q._id || q.id) === String(questionId) || q.questionId === questionId);
  },

  async updateAssessmentQuestion(questionId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await AdaptiveAssessmentQuestion.findOneAndUpdate({ _id: questionId }, { $set: updateData }, { new: true });
    }
    const idx = inMemAssessmentQuestions.findIndex((q) => String(q._id || q.id) === String(questionId) || q.questionId === questionId);
    if (idx >= 0) {
      inMemAssessmentQuestions[idx] = { ...inMemAssessmentQuestions[idx], ...updateData, updatedAt: new Date() };
      return inMemAssessmentQuestions[idx];
    }
    return null;
  },

  async createAssessmentAttempt(attData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new AdaptiveAssessmentAttempt(attData);
      return await doc.save();
    }
    const item = { _id: `att_${Date.now()}_${Math.random()}`, ...attData, createdAt: new Date() };
    inMemAssessmentAttempts.push(item);
    return item;
  },

  async getAssessmentAttempts(assessmentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await AdaptiveAssessmentAttempt.find({ assessmentId }).lean();
    }
    return inMemAssessmentAttempts.filter((a) => String(a.assessmentId) === String(assessmentId));
  },

  async getAssessmentAttempt(assessmentId: string, questionId: string): Promise<any> {
    if (isDBConnected()) {
      return await AdaptiveAssessmentAttempt.findOne({ assessmentId, questionId }).lean();
    }
    return inMemAssessmentAttempts.find((a) => String(a.assessmentId) === String(assessmentId) && String(a.questionId) === String(questionId));
  },

  async saveAssessmentContext(contextData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new AdaptiveAssessmentContext(contextData);
      return await doc.save();
    }
    const item = { _id: `ctx_${Date.now()}_${Math.random()}`, ...contextData, capturedAt: new Date() };
    inMemAssessmentContexts.push(item);
    return item;
  },

  async getAssessmentContext(assessmentId: string): Promise<any> {
    if (isDBConnected()) {
      return await AdaptiveAssessmentContext.findOne({ assessmentId }).sort({ capturedAt: -1 }).lean();
    }
    return inMemAssessmentContexts.find((c) => String(c.assessmentId) === String(assessmentId)) || null;
  },

  async getAssessmentResults(assessmentId: string, studentId: string): Promise<any> {
    const asst = await this.getAdaptiveAssessment(assessmentId, studentId);
    const attempts = await this.getAssessmentAttempts(assessmentId);
    return {
      assessmentId,
      studentId,
      score: asst?.score || 0,
      attemptsCount: attempts.length,
      accuracy: asst?.accuracy || 0,
    };
  },

  async getAssessmentReview(assessmentId: string, studentId: string): Promise<any> {
    const questions = await this.getAssessmentQuestions(assessmentId);
    const attempts = await this.getAssessmentAttempts(assessmentId);
    return {
      assessmentId,
      questions,
      attempts,
    };
  },

  async getTeacherAssessmentSummary(studentId: string): Promise<any> {
    const list = await this.getStudentAdaptiveAssessments(studentId);
    return {
      studentId,
      totalAssessments: list.length,
      completedCount: list.filter((a) => a.status === 'completed').length,
    };
  },

  async getParentAssessmentSummary(studentId: string): Promise<any> {
    return await this.getTeacherAssessmentSummary(studentId);
  },

  async createExamPaper(paperData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new ExamPaper(paperData);
      return await doc.save();
    }
    const item = { _id: `ep_${Date.now()}_${Math.random()}`, ...paperData, createdAt: new Date(), updatedAt: new Date() };
    inMemExamPapers.push(item);
    return item;
  },

  async getExamPaper(paperId: string, studentId?: string): Promise<any> {
    if (isDBConnected()) {
      const query: any = { _id: paperId };
      if (studentId) query.studentId = studentId;
      return await ExamPaper.findOne(query).lean();
    }
    return inMemExamPapers.find(
      (p) => (String(p._id || p.id) === String(paperId) || p.paperId === paperId) && (!studentId || String(p.studentId) === String(studentId))
    );
  },

  async getStudentExamPapers(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ExamPaper.find({ studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemExamPapers
      .filter((p) => String(p.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  async updateExamPaper(paperId: string, studentId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await ExamPaper.findOneAndUpdate({ _id: paperId, studentId }, { $set: updateData }, { new: true });
    }
    const idx = inMemExamPapers.findIndex(
      (p) => (String(p._id || p.id) === String(paperId) || p.paperId === paperId) && String(p.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemExamPapers[idx] = { ...inMemExamPapers[idx], ...updateData, updatedAt: new Date() };
      return inMemExamPapers[idx];
    }
    return null;
  },

  async deleteExamPaper(paperId: string, studentId: string): Promise<boolean> {
    if (isDBConnected()) {
      const res = await ExamPaper.deleteOne({ _id: paperId, studentId });
      return res.deletedCount > 0;
    }
    const idx = inMemExamPapers.findIndex(
      (p) => (String(p._id || p.id) === String(paperId) || p.paperId === paperId) && String(p.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemExamPapers.splice(idx, 1);
      return true;
    }
    return false;
  },

  async createExamPaperSection(secData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new ExamPaperSection(secData);
      return await doc.save();
    }
    const item = { _id: `sec_${Date.now()}_${Math.random()}`, ...secData, createdAt: new Date() };
    inMemExamPaperSections.push(item);
    return item;
  },

  async getExamPaperSections(paperId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ExamPaperSection.find({ paperId }).sort({ sequence: 1 }).lean();
    }
    return inMemExamPaperSections
      .filter((s) => String(s.paperId) === String(paperId))
      .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  },

  async createExamPaperQuestion(qData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new ExamPaperQuestion(qData);
      return await doc.save();
    }
    const item = { _id: `q_${Date.now()}_${Math.random()}`, ...qData, createdAt: new Date() };
    inMemExamPaperQuestions.push(item);
    return item;
  },

  async getExamPaperQuestions(paperId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ExamPaperQuestion.find({ paperId }).sort({ sequence: 1 }).lean();
    }
    return inMemExamPaperQuestions
      .filter((q) => String(q.paperId) === String(paperId))
      .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  },

  async getExamPaperQuestion(questionId: string): Promise<any> {
    if (isDBConnected()) {
      return await ExamPaperQuestion.findOne({ _id: questionId }).lean();
    }
    return inMemExamPaperQuestions.find((q) => String(q._id || q.id) === String(questionId) || q.questionId === questionId);
  },

  async updateExamPaperQuestion(questionId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await ExamPaperQuestion.findOneAndUpdate({ _id: questionId }, { $set: updateData }, { new: true });
    }
    const idx = inMemExamPaperQuestions.findIndex((q) => String(q._id || q.id) === String(questionId) || q.questionId === questionId);
    if (idx >= 0) {
      inMemExamPaperQuestions[idx] = { ...inMemExamPaperQuestions[idx], ...updateData, updatedAt: new Date() };
      return inMemExamPaperQuestions[idx];
    }
    return null;
  },

  async createExamPaperAttempt(attData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new ExamPaperAttempt(attData);
      return await doc.save();
    }
    const item = { _id: `att_${Date.now()}_${Math.random()}`, ...attData, createdAt: new Date() };
    inMemExamPaperAttempts.push(item);
    return item;
  },

  async getExamPaperAttempts(paperId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ExamPaperAttempt.find({ paperId }).lean();
    }
    return inMemExamPaperAttempts.filter((a) => String(a.paperId) === String(paperId));
  },

  async createExamPaperBlueprint(bpData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new ExamPaperBlueprint(bpData);
      return await doc.save();
    }
    const item = { _id: `bp_${Date.now()}_${Math.random()}`, ...bpData, generatedAt: new Date() };
    inMemExamPaperBlueprints.push(item);
    return item;
  },

  async getExamPaperBlueprint(paperId: string): Promise<any> {
    if (isDBConnected()) {
      return await ExamPaperBlueprint.findOne({ paperId }).lean();
    }
    return inMemExamPaperBlueprints.find((b) => String(b.paperId) === String(paperId)) || null;
  },

  async getExamPaperResults(paperId: string, studentId: string): Promise<any> {
    const paper = await this.getExamPaper(paperId, studentId);
    const attempts = await this.getExamPaperAttempts(paperId);
    return {
      paperId,
      studentId,
      grossMarks: attempts.reduce((acc, a) => acc + (a.marksAwarded || 0), 0),
      netMarks: attempts.reduce((acc, a) => acc + (a.marksAwarded || 0) - (a.negativeMarksApplied || 0), 0),
      totalMarks: paper?.totalMarks || 50,
    };
  },

  async getExamPaperReview(paperId: string, studentId: string): Promise<any> {
    const questions = await this.getExamPaperQuestions(paperId);
    const attempts = await this.getExamPaperAttempts(paperId);
    return {
      paperId,
      questions,
      attempts,
    };
  },

  async getTeacherExamPaperSummary(studentId: string): Promise<any> {
    const list = await this.getStudentExamPapers(studentId);
    return {
      studentId,
      totalPapers: list.length,
      completedCount: list.filter((p) => p.status === 'completed').length,
    };
  },

  async getParentExamPaperSummary(studentId: string): Promise<any> {
    return await this.getTeacherExamPaperSummary(studentId);
  },

  async createExamEvaluation(evalData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new ExamEvaluation(evalData);
      return await doc.save();
    }
    const item = { _id: `eval_${Date.now()}_${Math.random()}`, ...evalData, createdAt: new Date(), updatedAt: new Date() };
    inMemExamEvaluations.push(item);
    return item;
  },

  async getExamEvaluation(evaluationId: string, studentId?: string): Promise<any> {
    if (isDBConnected()) {
      const query: any = { _id: evaluationId };
      if (studentId) query.studentId = studentId;
      return await ExamEvaluation.findOne(query).lean();
    }
    return inMemExamEvaluations.find(
      (e) => (String(e._id || e.id) === String(evaluationId) || e.evaluationId === evaluationId) && (!studentId || String(e.studentId) === String(studentId))
    );
  },

  async getStudentExamEvaluations(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ExamEvaluation.find({ studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemExamEvaluations
      .filter((e) => String(e.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  async updateExamEvaluation(evaluationId: string, studentId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await ExamEvaluation.findOneAndUpdate({ _id: evaluationId, studentId }, { $set: updateData }, { new: true });
    }
    const idx = inMemExamEvaluations.findIndex(
      (e) => (String(e._id || e.id) === String(evaluationId) || e.evaluationId === evaluationId) && String(e.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemExamEvaluations[idx] = { ...inMemExamEvaluations[idx], ...updateData, updatedAt: new Date() };
      return inMemExamEvaluations[idx];
    }
    return null;
  },

  async createQuestionEvaluation(qEvalData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new QuestionEvaluation(qEvalData);
      return await doc.save();
    }
    const item = { _id: `qeval_${Date.now()}_${Math.random()}`, ...qEvalData, createdAt: new Date() };
    inMemQuestionEvaluations.push(item);
    return item;
  },

  async getQuestionEvaluations(evaluationId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await QuestionEvaluation.find({ evaluationId }).lean();
    }
    return inMemQuestionEvaluations.filter((q) => String(q.evaluationId) === String(evaluationId));
  },

  async createTopicEvaluation(tEvalData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new TopicEvaluation(tEvalData);
      return await doc.save();
    }
    const item = { _id: `teval_${Date.now()}_${Math.random()}`, ...tEvalData, createdAt: new Date() };
    inMemTopicEvaluations.push(item);
    return item;
  },

  async getTopicEvaluations(evaluationId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await TopicEvaluation.find({ evaluationId }).lean();
    }
    return inMemTopicEvaluations.filter((t) => String(t.evaluationId) === String(evaluationId));
  },

  async createConceptEvaluation(cEvalData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new ConceptEvaluation(cEvalData);
      return await doc.save();
    }
    const item = { _id: `ceval_${Date.now()}_${Math.random()}`, ...cEvalData, createdAt: new Date() };
    inMemConceptEvaluations.push(item);
    return item;
  },

  async getConceptEvaluations(evaluationId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ConceptEvaluation.find({ evaluationId }).lean();
    }
    return inMemConceptEvaluations.filter((c) => String(c.evaluationId) === String(evaluationId));
  },

  async createStudentMisconception(mData: any): Promise<any> {
    if (isDBConnected()) {
      const existingDoc = await StudentMisconception.findOne({
        studentId: mData.studentId,
        conceptId: mData.conceptId,
        misconceptionType: mData.misconceptionType,
        status: 'active',
      });
      if (existingDoc) {
        existingDoc.evidenceCount += 1;
        existingDoc.lastDetectedAt = new Date();
        return await existingDoc.save();
      }
      const doc = new StudentMisconception(mData);
      return await doc.save();
    }
    const idx = inMemStudentMisconceptions.findIndex(
      (m) =>
        String(m.studentId) === String(mData.studentId) &&
        m.conceptId === mData.conceptId &&
        m.misconceptionType === mData.misconceptionType &&
        m.status === 'active'
    );
    if (idx >= 0) {
      inMemStudentMisconceptions[idx].evidenceCount += 1;
      inMemStudentMisconceptions[idx].lastDetectedAt = new Date();
      return inMemStudentMisconceptions[idx];
    }

    const item = { _id: `misc_${Date.now()}_${Math.random()}`, ...mData, createdAt: new Date(), updatedAt: new Date() };
    inMemStudentMisconceptions.push(item);
    return item;
  },

  async getStudentMisconceptions(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await StudentMisconception.find({ studentId }).sort({ lastDetectedAt: -1 }).lean();
    }
    return inMemStudentMisconceptions.filter((m) => String(m.studentId) === String(studentId));
  },

  async updateStudentMisconception(misconceptionId: string, studentId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await StudentMisconception.findOneAndUpdate({ _id: misconceptionId, studentId }, { $set: updateData }, { new: true });
    }
    const idx = inMemStudentMisconceptions.findIndex(
      (m) => (String(m._id || m.id) === String(misconceptionId)) && String(m.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemStudentMisconceptions[idx] = { ...inMemStudentMisconceptions[idx], ...updateData, updatedAt: new Date() };
      return inMemStudentMisconceptions[idx];
    }
    return null;
  },

  async getTeacherEvaluationSummary(studentId: string): Promise<any> {
    const list = await this.getStudentExamEvaluations(studentId);
    return {
      studentId,
      totalEvaluations: list.length,
      averagePercentage: list.length > 0 ? Math.round(list.reduce((a, b) => a + (b.percentage || 0), 0) / list.length) : 0,
    };
  },

  async getParentEvaluationSummary(studentId: string): Promise<any> {
    return await this.getTeacherEvaluationSummary(studentId);
  },

  async createStudentDoubt(dData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new StudentDoubt(dData);
      return await doc.save();
    }
    const item = { _id: `doubt_${Date.now()}_${Math.random()}`, ...dData, createdAt: new Date(), updatedAt: new Date() };
    inMemStudentDoubts.push(item);
    return item;
  },

  async getStudentDoubts(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await StudentDoubt.find({ studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemStudentDoubts
      .filter((d) => String(d.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  async getStudentDoubtById(doubtId: string, studentId?: string): Promise<any> {
    if (isDBConnected()) {
      const query: any = { _id: doubtId };
      if (studentId) query.studentId = studentId;
      return await StudentDoubt.findOne(query).lean();
    }
    return inMemStudentDoubts.find(
      (d) => (String(d._id || d.id) === String(doubtId) || d.doubtId === doubtId) && (!studentId || String(d.studentId) === String(studentId))
    );
  },

  async updateStudentDoubt(doubtId: string, studentId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await StudentDoubt.findOneAndUpdate({ _id: doubtId, studentId }, { $set: updateData }, { new: true });
    }
    const idx = inMemStudentDoubts.findIndex(
      (d) => (String(d._id || d.id) === String(doubtId) || d.doubtId === doubtId) && String(d.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemStudentDoubts[idx] = { ...inMemStudentDoubts[idx], ...updateData, updatedAt: new Date() };
      return inMemStudentDoubts[idx];
    }
    return null;
  },

  async createDoubtResponse(rData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new DoubtResponse(rData);
      return await doc.save();
    }
    const item = { _id: `resp_${Date.now()}_${Math.random()}`, ...rData, createdAt: new Date() };
    inMemDoubtResponses.push(item);
    return item;
  },

  async getDoubtResponses(doubtId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await DoubtResponse.find({ doubtId }).lean();
    }
    return inMemDoubtResponses.filter((r) => String(r.doubtId) === String(doubtId));
  },

  async createDoubtFollowup(fData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new DoubtFollowup(fData);
      return await doc.save();
    }
    const item = { _id: `fup_${Date.now()}_${Math.random()}`, ...fData, createdAt: new Date() };
    inMemDoubtFollowups.push(item);
    return item;
  },

  async getDoubtFollowups(doubtId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await DoubtFollowup.find({ doubtId }).sort({ createdAt: 1 }).lean();
    }
    return inMemDoubtFollowups.filter((f) => String(f.doubtId) === String(doubtId));
  },

  async createDoubtFeedback(fbData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new DoubtFeedback(fbData);
      return await doc.save();
    }
    const item = { _id: `fb_${Date.now()}_${Math.random()}`, ...fbData, createdAt: new Date() };
    inMemDoubtFeedbacks.push(item);
    return item;
  },

  async getDoubtFeedback(doubtId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await DoubtFeedback.find({ doubtId }).lean();
    }
    return inMemDoubtFeedbacks.filter((fb) => String(fb.doubtId) === String(doubtId));
  },

  async getTeacherDoubtSummary(studentId: string): Promise<any> {
    const list = await this.getStudentDoubts(studentId);
    return {
      studentId,
      totalDoubts: list.length,
      resolvedCount: list.filter((d) => d.status === 'resolved' || d.status === 'answered').length,
    };
  },

  async getParentDoubtSummary(studentId: string): Promise<any> {
    return await this.getTeacherDoubtSummary(studentId);
  },

  async updateLearningResource(resourceId: string, updateData: any): Promise<any> {
    if (isDBConnected()) {
      return await LearningResource.findOneAndUpdate({ resourceId }, { $set: updateData }, { new: true });
    }
    const idx = inMemLearningResources.findIndex((r) => String(r._id || r.id) === String(resourceId) || r.resourceId === resourceId);
    if (idx >= 0) {
      inMemLearningResources[idx] = { ...inMemLearningResources[idx], ...updateData, updatedAt: new Date() };
      return inMemLearningResources[idx];
    }
    return null;
  },

  async createResourceInteraction(iData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new ResourceInteraction(iData);
      return await doc.save();
    }
    const item = { _id: `act_${Date.now()}_${Math.random()}`, ...iData, createdAt: new Date() };
    inMemResourceInteractions.push(item);
    return item;
  },

  async getResourceInteractions(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ResourceInteraction.find({ studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemResourceInteractions
      .filter((i) => String(i.studentId) === String(studentId))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  async createResourceBookmark(bData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new ResourceBookmark(bData);
      return await doc.save();
    }
    const existingIdx = inMemResourceBookmarks.findIndex(
      (b) => String(b.studentId) === String(bData.studentId) && String(b.resourceId) === String(bData.resourceId)
    );
    if (existingIdx >= 0) {
      inMemResourceBookmarks[existingIdx] = { ...inMemResourceBookmarks[existingIdx], ...bData, updatedAt: new Date() };
      return inMemResourceBookmarks[existingIdx];
    }
    const item = { _id: `bm_${Date.now()}_${Math.random()}`, ...bData, createdAt: new Date(), updatedAt: new Date() };
    inMemResourceBookmarks.push(item);
    return item;
  },

  async getResourceBookmarks(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ResourceBookmark.find({ studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemResourceBookmarks.filter((b) => String(b.studentId) === String(studentId));
  },

  async deleteResourceBookmark(resourceId: string, studentId: string): Promise<boolean> {
    if (isDBConnected()) {
      const res = await ResourceBookmark.deleteOne({ resourceId, studentId });
      return res.deletedCount > 0;
    }
    const idx = inMemResourceBookmarks.findIndex(
      (b) => String(b.resourceId) === String(resourceId) && String(b.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemResourceBookmarks.splice(idx, 1);
      return true;
    }
    return false;
  },

  async createResourceRecommendation(recData: any): Promise<any> {
    if (isDBConnected()) {
      return await ResourceRecommendation.findOneAndUpdate(
        { recommendationId: recData.recommendationId },
        { $set: recData },
        { upsert: true, new: true }
      );
    }
    const idx = inMemResourceRecommendations.findIndex((r) => r.recommendationId === recData.recommendationId);
    if (idx >= 0) {
      inMemResourceRecommendations[idx] = { ...inMemResourceRecommendations[idx], ...recData, updatedAt: new Date() };
      return inMemResourceRecommendations[idx];
    }
    const item = { _id: `rec_${Date.now()}_${Math.random()}`, ...recData, createdAt: new Date(), updatedAt: new Date() };
    inMemResourceRecommendations.push(item);
    return item;
  },

  async getResourceRecommendations(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await ResourceRecommendation.find({ studentId, isDismissed: false }).sort({ score: -1 }).lean();
    }
    return inMemResourceRecommendations
      .filter((r) => String(r.studentId) === String(studentId) && !r.isDismissed)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  },

  async getResourceRecommendation(recommendationId: string): Promise<any> {
    if (isDBConnected()) {
      return await ResourceRecommendation.findOne({ recommendationId }).lean();
    }
    return inMemResourceRecommendations.find((r) => r.recommendationId === recommendationId);
  },

  async dismissResourceRecommendation(recommendationId: string, studentId: string): Promise<boolean> {
    if (isDBConnected()) {
      const res = await ResourceRecommendation.updateOne({ recommendationId, studentId }, { $set: { isDismissed: true } });
      return res.modifiedCount > 0;
    }
    const idx = inMemResourceRecommendations.findIndex(
      (r) => r.recommendationId === recommendationId && String(r.studentId) === String(studentId)
    );
    if (idx >= 0) {
      inMemResourceRecommendations[idx].isDismissed = true;
      return true;
    }
    return false;
  },

  async getPracticeQuestions(conceptId?: string): Promise<any[]> {
    if (isDBConnected()) {
      const query: any = { active: true };
      if (conceptId) query.conceptId = conceptId;
      return await PracticeQuestion.find(query).lean();
    }
    if (conceptId) {
      return inMemPracticeQuestions.filter((q) => q.conceptId === conceptId && q.active !== false);
    }
    return inMemPracticeQuestions.filter((q) => q.active !== false);
  },

  async getPracticeQuestionById(questionId: string): Promise<any> {
    if (isDBConnected()) {
      const dbQ = await PracticeQuestion.findOne({ questionId }).lean();
      if (dbQ) return dbQ;
    }
    const found = inMemPracticeQuestions.find((q) => q.questionId === questionId || String(q._id) === String(questionId));
    if (found) return found;
    return VERIFIED_PRACTICE_QUESTION_BANK.find((q) => q.questionId === questionId);
  },

  async createPracticeQuestion(qData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new PracticeQuestion(qData);
      return await doc.save();
    }
    const item = { _id: `pq_${Date.now()}_${Math.random()}`, ...qData, createdAt: new Date() };
    inMemPracticeQuestions.push(item);
    return item;
  },

  async savePersonalizedAttempt(attemptData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new PersonalizedAttempt(attemptData);
      return await doc.save();
    }
    const item = { _id: `att_${Date.now()}_${Math.random()}`, ...attemptData };
    inMemPersonalizedAttempts.push(item);
    return item;
  },

  async getStudentPersonalizedAttempts(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await PersonalizedAttempt.find({ studentId }).sort({ submittedAt: -1 }).lean();
    }
    return inMemPersonalizedAttempts
      .filter((a) => String(a.studentId) === String(studentId))
      .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
  },

  async savePersonalizedPracticeSession(sessionData: any): Promise<any> {
    const idx = inMemPersonalizedSessions.findIndex(
      (s) => s.sessionId === sessionData.sessionId && String(s.studentId) === String(sessionData.studentId)
    );
    if (idx >= 0) {
      inMemPersonalizedSessions[idx] = { ...inMemPersonalizedSessions[idx], ...sessionData };
      return inMemPersonalizedSessions[idx];
    }
    inMemPersonalizedSessions.push(sessionData);
    return sessionData;
  },

  async getPersonalizedPracticeSession(sessionId: string, studentId?: string): Promise<any> {
    return inMemPersonalizedSessions.find(
      (s) => s.sessionId === sessionId && (!studentId || String(s.studentId) === String(studentId))
    );
  },

  async createMockExam(examData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new MockExam(examData);
      return await doc.save();
    }
    const item = { _id: `exam_${Date.now()}_${Math.random()}`, ...examData, createdAt: new Date() };
    inMemMockExams.push(item);
    return item;
  },

  async getMockExamById(examId: string): Promise<any> {
    if (isDBConnected()) {
      return await MockExam.findOne({ examId }).lean();
    }
    return inMemMockExams.find((e) => e.examId === examId);
  },

  async createMockExamQuestion(qData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new MockExamQuestion(qData);
      return await doc.save();
    }
    const item = { _id: `meq_${Date.now()}_${Math.random()}`, ...qData, createdAt: new Date() };
    inMemMockExamQuestions.push(item);
    return item;
  },

  async getMockExamQuestions(examId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await MockExamQuestion.find({ examId }).sort({ questionNumber: 1 }).lean();
    }
    return inMemMockExamQuestions
      .filter((q) => q.examId === examId)
      .sort((a, b) => a.questionNumber - b.questionNumber);
  },

  async getMockExamQuestionByNumber(examId: string, questionNumber: number): Promise<any> {
    if (isDBConnected()) {
      return await MockExamQuestion.findOne({ examId, questionNumber }).lean();
    }
    return inMemMockExamQuestions.find((q) => q.examId === examId && q.questionNumber === questionNumber);
  },

  async createMockExamAttempt(attemptData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new MockExamAttempt(attemptData);
      return await doc.save();
    }
    const item = { _id: `att_${Date.now()}_${Math.random()}`, ...attemptData };
    inMemMockExamAttempts.push(item);
    return item;
  },

  async saveMockExamAttempt(attemptData: any): Promise<any> {
    if (isDBConnected()) {
      return await MockExamAttempt.findOneAndUpdate(
        { attemptId: attemptData.attemptId },
        { $set: attemptData },
        { upsert: true, new: true }
      );
    }
    const idx = inMemMockExamAttempts.findIndex((a) => a.attemptId === attemptData.attemptId);
    if (idx >= 0) {
      inMemMockExamAttempts[idx] = { ...inMemMockExamAttempts[idx], ...attemptData, updatedAt: new Date() };
      return inMemMockExamAttempts[idx];
    }
    inMemMockExamAttempts.push(attemptData);
    return attemptData;
  },

  async getStudentMockExamAttempt(examId: string, studentId: string): Promise<any> {
    if (isDBConnected()) {
      return await MockExamAttempt.findOne({ examId, studentId }).sort({ createdAt: -1 }).lean();
    }
    return inMemMockExamAttempts.find(
      (a) => a.examId === examId && String(a.studentId) === String(studentId)
    );
  },

  async getStudentMockExamAttempts(studentId: string): Promise<any[]> {
    if (isDBConnected()) {
      return await MockExamAttempt.find({ studentId }).sort({ startedAt: -1 }).lean();
    }
    return inMemMockExamAttempts
      .filter((a) => String(a.studentId) === String(studentId))
      .sort((a, b) => new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime());
  },

  async saveMockExamResult(resultData: any): Promise<any> {
    if (isDBConnected()) {
      const doc = new MockExamResult(resultData);
      return await doc.save();
    }
    const item = { _id: `res_${Date.now()}_${Math.random()}`, ...resultData };
    inMemMockExamResults.push(item);
    return item;
  },

  async getMockExamResultByStudent(examId: string, studentId: string): Promise<any> {
    if (isDBConnected()) {
      return await MockExamResult.findOne({ examId, studentId }).lean();
    }
    return inMemMockExamResults.find(
      (r) => r.examId === examId && String(r.studentId) === String(studentId)
    );
  },
};
