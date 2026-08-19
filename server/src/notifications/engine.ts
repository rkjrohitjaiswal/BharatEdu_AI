import { dataRepository } from '../repositories/data.repository.js';
import { evaluateParentRules, evaluateStudentRules, evaluateTeacherRules } from './rules.js';
import { NotificationCandidate, NotificationRecipientRole } from './types.js';

export async function syncUserNotifications(userId: string, role: NotificationRecipientRole) {
  let candidates: NotificationCandidate[] = [];

  if (role === 'student') {
    candidates = await evaluateStudentRules(userId);
  } else if (role === 'teacher') {
    candidates = await evaluateTeacherRules(userId);
  } else if (role === 'parent') {
    candidates = await evaluateParentRules(userId);
  }

  const createdNotifications = [];

  for (const candidate of candidates) {
    try {
      // Check if notification with dedupeKey already exists for user
      const existing = await dataRepository.getNotificationByDedupeKey(userId, candidate.dedupeKey);
      if (!existing) {
        // AI Optional Wording Enrichment with Fallback
        const enriched = await enrichNotificationWithAI(candidate);
        const created = await dataRepository.createNotification(enriched);
        if (created) {
          createdNotifications.push(created);
        }
      }
    } catch (err) {
      // Ignore individual deduplication/creation error
    }
  }

  return {
    syncedCount: createdNotifications.length,
    notifications: await dataRepository.getNotifications({ recipientUserId: userId, limit: 50 }),
  };
}

async function enrichNotificationWithAI(candidate: NotificationCandidate): Promise<NotificationCandidate> {
  const key = process.env.AI_API_KEY;
  if (!key) return candidate;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'You are a polite, concise educational notification writer. Keep the title and message clear, actionable, and under 120 characters. Do not change priority, URL, or recipient.',
          },
          {
            role: 'user',
            content: JSON.stringify({ title: candidate.title, message: candidate.message, type: candidate.type }),
          },
        ],
      }),
    });

    if (!response.ok) return candidate;
    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    if (!text) return candidate;

    return {
      ...candidate,
      message: text.length > 200 ? text.substring(0, 197) + '...' : text,
    };
  } catch (err) {
    return candidate;
  }
}
