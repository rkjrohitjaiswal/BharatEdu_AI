import { CommunicationContext, TeacherMessageDraft, ParentMessageDraft, StudentMessageDraft } from './types.js';
import { CollaborationPrivacyFilter } from './privacy.js';

export class CollaborationAICoach {
  static generateTeacherDraft(
    context: CommunicationContext,
    recipient: 'parent' | 'student' | 'both',
    tone: 'professional' | 'supportive' | 'concise' | 'encouraging' | 'exam-focused' | 'action-oriented' = 'supportive'
  ): TeacherMessageDraft {
    const hasAIKey = !!process.env.AI_API_KEY;
    const studentName = context.studentName || `Student (${context.studentId})`;
    const topicStr = context.topic || context.subject;

    let body = '';
    let subject = `Learning Intervention & Support Update: ${topicStr}`;

    if (recipient === 'parent' || recipient === 'both') {
      body = `Dear Parent, recent learning activity for ${studentName} shows that concept mastery in ${topicStr} is currently at ${context.mastery}%. To support ${studentName}'s growth, we have outlined a focused practice routine. A short 20-30 minute daily review at home will help reinforce understanding.`;
    } else {
      body = `Hi ${studentName}, great effort on your recent work in ${topicStr}! To help you master this topic before the upcoming assessment, we have assigned a focused practice module targeting ${context.learningGaps.join(', ') || 'core concepts'}. Let's work together to boost your score!`;
    }

    const sanitized = CollaborationPrivacyFilter.sanitizeMessageContent(body);

    return {
      recipient,
      subject,
      body: sanitized.body,
      tone,
      evidenceUsed: context.evidence.length > 0 ? context.evidence : [`Mastery: ${context.mastery}%`, `Risk Score: ${context.riskScore}`],
      recommendedActions: [
        `Complete targeted practice on ${topicStr}`,
        `Acknowledge update and confirm routine`,
      ],
      aiGenerated: hasAIKey,
    };
  }

  static generateParentDraft(context: CommunicationContext): ParentMessageDraft {
    const hasAIKey = !!process.env.AI_API_KEY;
    const topicStr = context.topic || context.subject;

    return {
      subject: `Home Support Recommendation: ${topicStr}`,
      body: `We encourage establishing a supportive daily study routine (25 minutes) for ${context.studentName || 'your child'} focusing on ${topicStr}. Reviewing teacher recommendations and providing positive encouragement will foster strong learning habits.`,
      homeSupportSuggestions: [
        'Encourage 25-30 minutes of daily quiet revision',
        'Check completion of assigned practice module',
        'Provide positive encouragement for effort',
      ],
      tone: 'supportive',
      aiGenerated: hasAIKey,
    };
  }

  static generateStudentDraft(context: CommunicationContext): StudentMessageDraft {
    const hasAIKey = !!process.env.AI_API_KEY;
    const topicStr = context.topic || context.subject;

    return {
      subject: `Guided Learning Action: ${topicStr}`,
      body: `Here is your target practice set for ${topicStr}. Completing these 5 practice questions will strengthen your prerequisite understanding!`,
      taskTitle: `Practice Set: ${topicStr}`,
      targetUrl: `/practice?topic=${encodeURIComponent(topicStr)}`,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      aiGenerated: hasAIKey,
    };
  }
}
