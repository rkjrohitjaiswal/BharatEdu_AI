export class CollaborationPrivacyFilter {
  private static SENSITIVE_TERMS = [
    'lazy',
    'bad student',
    'bad parent',
    'unmotivated',
    'problem family',
    'stupid',
    'dumb',
    'caste',
    'religion',
    'race',
    'income',
    'financial status',
  ];

  static sanitizeMessageContent(content: string): { body: string; flagged: boolean; reason?: string } {
    let flagged = false;
    let sanitized = content;

    for (const term of this.SENSITIVE_TERMS) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(sanitized)) {
        flagged = true;
        sanitized = sanitized.replace(regex, '[neutralized language]');
      }
    }

    if (flagged) {
      return {
        body: sanitized,
        flagged: true,
        reason: 'Sensitive or non-neutral terminology detected and replaced with supportive educational wording.',
      };
    }

    return { body: content, flagged: false };
  }

  static filterPrivateData(data: Record<string, any>): Record<string, any> {
    const copy = { ...data };
    delete copy.password;
    delete copy.jwtToken;
    delete copy.apiKey;
    delete copy.privateNotes;
    delete copy.privateTutorConversations;
    return copy;
  }
}
