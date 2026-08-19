import { dataRepository } from '../repositories/data.repository.js';
import {
  PracticeHistoryFilterOptions,
  PracticeHistoryItem,
  PracticeHistorySummary,
  PracticeSessionDetailResult,
  PracticeTimeSeriesPoint,
  SubjectHistoryPerformance,
  TopicHistoryPerformance,
  PaginationMetadata,
} from './types.js';

export class PracticeHistoryService {
  /**
   * Retrieves paginated practice sessions list with subject/topic/difficulty filtering.
   */
  public static async getHistoryList(
    studentId: string,
    options: PracticeHistoryFilterOptions
  ): Promise<{ items: PracticeHistoryItem[]; pagination: PaginationMetadata }> {
    const rawSessions = await dataRepository.getPracticeSessions(studentId);

    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 20));

    // Filter sessions
    let filtered = rawSessions.filter((s: any) => {
      const subjId = String(typeof s.subjectId === 'object' && s.subjectId !== null ? s.subjectId._id : s.subjectId || '');
      const topId = String(typeof s.topicId === 'object' && s.topicId !== null ? s.topicId._id : s.topicId || '');

      if (options.subjectId && subjId !== options.subjectId) return false;
      if (options.topicId && topId !== options.topicId) return false;
      if (options.difficulty && s.difficulty !== options.difficulty) return false;

      if (options.startDate) {
        const sDate = new Date(options.startDate).getTime();
        const sessDate = new Date(s.completedAt || s.startedAt).getTime();
        if (sessDate < sDate) return false;
      }

      if (options.endDate) {
        const eDate = new Date(options.endDate).getTime();
        const sessDate = new Date(s.completedAt || s.startedAt).getTime();
        if (sessDate > eDate) return false;
      }

      return true;
    });

    // Sort descending by completion / start date
    filtered.sort(
      (a: any, b: any) =>
        new Date(b.completedAt || b.startedAt).getTime() -
        new Date(a.completedAt || a.startedAt).getTime()
    );

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedSessions = filtered.slice(startIndex, startIndex + limit);

    const items: PracticeHistoryItem[] = paginatedSessions.map((s: any) => {
      const topicObj = typeof s.topicId === 'object' && s.topicId !== null ? s.topicId : null;
      const subjectObj = typeof s.subjectId === 'object' && s.subjectId !== null ? s.subjectId : null;

      const totalQ = s.totalQuestions || (s.questions ? s.questions.length : 0);
      const compQ = s.completedQuestions || (s.questions ? s.questions.filter((q: any) => q.answeredAt).length : 0);
      const corrA = s.correctAnswers || (s.questions ? s.questions.filter((q: any) => q.isCorrect === true).length : 0);
      const incA = compQ - corrA;
      const acc = compQ > 0 ? Math.round((corrA / compQ) * 100) : 0;

      return {
        sessionId: s._id || s.id,
        studentId,
        subjectId: subjectObj?._id || s.subjectId,
        subjectName: subjectObj?.name || 'General Subject',
        topicId: topicObj?._id || s.topicId,
        topicName: topicObj?.name || 'Curriculum Topic',
        difficulty: s.difficulty || 'intermediate',
        totalQuestions: totalQ,
        completedQuestions: compQ,
        correctAnswers: corrA,
        incorrectAnswers: Math.max(0, incA),
        accuracy: acc,
        score: s.score || 0,
        status: s.status || 'completed',
        startedAt: s.startedAt || new Date(),
        completedAt: s.completedAt,
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Aggregates comprehensive student practice statistics, streaks, subject breakdown, time-series, and topic history.
   */
  public static async getHistorySummary(studentId: string): Promise<PracticeHistorySummary> {
    const rawSessions = await dataRepository.getPracticeSessions(studentId);

    let totalSessions = rawSessions.length;
    let completedSessions = 0;
    let totalQuestions = 0;
    let correctAnswers = 0;
    let totalPracticeSeconds = 0;

    const subjectMap = new Map<string, { name: string; sessions: number; questions: number; correct: number }>();
    const topicMap = new Map<string, { topicName: string; subjectName: string; attempts: number; correct: number; incorrect: number; latestDate: Date; difficulty: string }>();
    const dateMap = new Map<string, { questions: number; correct: number }>();
    const sessionAccuracies: number[] = [];
    const activeDates = new Set<string>();

    rawSessions.forEach((s: any) => {
      if (s.status === 'completed') completedSessions++;

      const topicObj = typeof s.topicId === 'object' && s.topicId !== null ? s.topicId : null;
      const subjectObj = typeof s.subjectId === 'object' && s.subjectId !== null ? s.subjectId : null;

      const subjId = String(subjectObj?._id || s.subjectId || 'general');
      const subjName = subjectObj?.name || 'General Subject';
      const topId = String(topicObj?._id || s.topicId || 'general_topic');
      const topName = topicObj?.name || 'Curriculum Topic';

      const compQ = s.completedQuestions || (s.questions ? s.questions.filter((q: any) => q.answeredAt).length : 0);
      const corrA = s.correctAnswers || (s.questions ? s.questions.filter((q: any) => q.isCorrect === true).length : 0);
      const incA = compQ - corrA;

      totalQuestions += compQ;
      correctAnswers += corrA;

      if (compQ > 0) {
        sessionAccuracies.push(Math.round((corrA / compQ) * 100));
      }

      // Time spent estimation (default 15s per question)
      const sessionSeconds = (s.questions || []).reduce((acc: number, q: any) => acc + (q.timeSpentSeconds || 15), 0);
      totalPracticeSeconds += sessionSeconds;

      // Date tracking for streaks & time-series
      const sessDateObj = new Date(s.completedAt || s.startedAt);
      const dateStr = sessDateObj.toISOString().split('T')[0];
      activeDates.add(dateStr);

      const curDateStat = dateMap.get(dateStr) || { questions: 0, correct: 0 };
      curDateStat.questions += compQ;
      curDateStat.correct += corrA;
      dateMap.set(dateStr, curDateStat);

      // Subject breakdown
      const curSubj = subjectMap.get(subjId) || { name: subjName, sessions: 0, questions: 0, correct: 0 };
      curSubj.sessions++;
      curSubj.questions += compQ;
      curSubj.correct += corrA;
      subjectMap.set(subjId, curSubj);

      // Topic history breakdown
      const curTop = topicMap.get(topId) || {
        topicName: topName,
        subjectName: subjName,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        latestDate: sessDateObj,
        difficulty: s.difficulty || 'intermediate',
      };
      curTop.attempts += compQ;
      curTop.correct += corrA;
      curTop.incorrect += Math.max(0, incA);
      if (sessDateObj.getTime() > curTop.latestDate.getTime()) {
        curTop.latestDate = sessDateObj;
      }
      topicMap.set(topId, curTop);
    });

    const incorrectAnswers = Math.max(0, totalQuestions - correctAnswers);
    const overallAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const averageSessionAccuracy =
      sessionAccuracies.length > 0
        ? Math.round(sessionAccuracies.reduce((a, b) => a + b, 0) / sessionAccuracies.length)
        : 0;

    // Calculate Streak
    const sortedDates = Array.from(activeDates).sort();
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    if (sortedDates.length > 0) {
      tempStreak = 1;
      bestStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]).getTime();
        const curr = new Date(sortedDates[i]).getTime();
        const diffDays = Math.round((curr - prev) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }

      const lastActive = sortedDates[sortedDates.length - 1];
      const diffFromToday = Math.round(
        (new Date(todayStr).getTime() - new Date(lastActive).getTime()) / (1000 * 3600 * 24)
      );
      currentStreak = diffFromToday <= 1 ? tempStreak : 0;
    }

    // Convert Subject Performance
    const subjectPerformance: SubjectHistoryPerformance[] = Array.from(subjectMap.entries()).map(
      ([subjId, val]) => ({
        subjectId: subjId,
        subjectName: val.name,
        totalSessions: val.sessions,
        totalQuestions: val.questions,
        correctAnswers: val.correct,
        accuracy: val.questions > 0 ? Math.round((val.correct / val.questions) * 100) : 0,
      })
    );

    // Convert Topic History
    const topicPerformance: TopicHistoryPerformance[] = Array.from(topicMap.entries()).map(
      ([topId, val]) => ({
        topicId: topId,
        topicName: val.topicName,
        subjectName: val.subjectName,
        totalAttempts: val.attempts,
        correctAnswers: val.correct,
        incorrectAnswers: val.incorrect,
        accuracy: val.attempts > 0 ? Math.round((val.correct / val.attempts) * 100) : 0,
        latestPracticeDate: val.latestDate,
        difficulty: val.difficulty,
      })
    );

    // Convert Time Series
    const timeSeries: PracticeTimeSeriesPoint[] = Array.from(dateMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, val]) => ({
        date,
        questions: val.questions,
        correct: val.correct,
        accuracy: val.questions > 0 ? Math.round((val.correct / val.questions) * 100) : 0,
      }));

    return {
      totalSessions,
      completedSessions,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      overallAccuracy,
      averageSessionAccuracy,
      currentPracticeStreak: currentStreak,
      bestPracticeStreak: bestStreak,
      totalPracticeMinutes: Math.round(totalPracticeSeconds / 60),
      subjectPerformance,
      topicPerformance,
      timeSeries,
    };
  }

  /**
   * Retrieves single practice session details with answer shielding.
   */
  public static async getSessionDetail(
    studentId: string,
    sessionId: string
  ): Promise<PracticeSessionDetailResult | null> {
    const session = await dataRepository.getPracticeSessionById(studentId, sessionId);
    if (!session) return null;

    const topicObj = typeof session.topicId === 'object' && session.topicId !== null ? session.topicId : null;
    const subjectObj = typeof session.subjectId === 'object' && session.subjectId !== null ? session.subjectId : null;

    const isSessionCompleted = session.status === 'completed';

    const questions = (session.questions || []).map((q: any, idx: number) => {
      const isQuestionAnswered = !!q.answeredAt;
      const showAnswer = isSessionCompleted || isQuestionAnswered;

      return {
        questionId: q._id || q.id || `q_${idx}`,
        questionText: q.questionText || q.question || 'Practice Question',
        options: q.options || [],
        studentAnswer: q.studentAnswer,
        correctAnswer: showAnswer ? q.correctAnswer : undefined,
        isCorrect: showAnswer ? q.isCorrect : undefined,
        score: showAnswer ? q.score : undefined,
        feedback: showAnswer ? q.feedback : undefined,
        topicName: topicObj?.name || 'Curriculum Topic',
        difficulty: session.difficulty || 'intermediate',
      };
    });

    const compQ = session.completedQuestions || (session.questions ? session.questions.filter((q: any) => q.answeredAt).length : 0);
    const corrA = session.correctAnswers || (session.questions ? session.questions.filter((q: any) => q.isCorrect === true).length : 0);

    return {
      sessionId: session._id || session.id,
      studentId,
      subjectName: subjectObj?.name || 'General Subject',
      topicName: topicObj?.name || 'Curriculum Topic',
      difficulty: session.difficulty || 'intermediate',
      status: session.status || 'completed',
      score: session.score || 0,
      accuracy: compQ > 0 ? Math.round((corrA / compQ) * 100) : 0,
      totalQuestions: session.totalQuestions || questions.length,
      completedQuestions: compQ,
      correctAnswers: corrA,
      startedAt: session.startedAt || new Date(),
      completedAt: session.completedAt,
      questions,
    };
  }
}
