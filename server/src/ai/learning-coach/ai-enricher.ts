import OpenAI from 'openai';
import { CoachRecommendation, ReadinessScore } from './types.js';

export const AIEnricher = {
  async enrichCoachPlan(params: {
    studentName: string;
    preferredLanguage: string;
    readiness: ReadinessScore;
    recommendations: CoachRecommendation[];
    availableMinutes: number;
  }): Promise<{
    greeting: string;
    dailyGoal: string;
    motivation: string;
    aiEnhanced: boolean;
  }> {
    const { studentName, preferredLanguage, readiness, recommendations, availableMinutes } = params;
    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;

    const topRec = recommendations[0];
    const topTopic = topRec?.topic || topRec?.subject || 'your core topics';

    // Offline / Fallback Deterministic Templates
    const getFallback = () => {
      let greeting = `Good day, ${studentName}!`;
      let dailyGoal = topRec
        ? `Improve ${topTopic} and complete your daily learning tasks.`
        : 'Maintain daily practice to strengthen your topic mastery.';
      let motivation = 'Consistent 15–30 minutes of daily practice leads to maximum learning retention!';

      if (preferredLanguage === 'hindi') {
        greeting = `नमस्ते ${studentName}!`;
        dailyGoal = topRec
          ? `${topTopic} में सुधार करें और अपने दैनिक अध्ययन लक्ष्यों को पूरा करें।`
          : 'अपनी विषय दक्षता को मजबूत करने के लिए दैनिक अभ्यास बनाए रखें।';
        motivation = 'प्रतिदिन 15-30 मिनट का अध्ययन आपको निरंतर सफलता की ओर ले जाता है!';
      } else if (preferredLanguage === 'gujarati') {
        greeting = `નમસ્તે ${studentName}!`;
        dailyGoal = topRec
          ? `${topTopic} માં સુધારો કરો અને તમારા દૈનિક અભ્યાસના લક્ષ્યો પૂર્ણ કરો.`
          : 'તમારી વિષય ક્ષમતાને મજબૂત કરવા માટે રોજિંદો અભ્યાસ ચાલુ રાખો.';
        motivation = 'દરરોજ 15-30 મિનિટનો અભ્યાસ તમને સતત સફળતા તરફ દોરી જાય છે!';
      }

      return {
        greeting,
        dailyGoal,
        motivation,
        aiEnhanced: false,
      };
    };

    if (!apiKey) {
      return getFallback();
    }

    try {
      const openai = new OpenAI({ apiKey });
      const prompt = `You are an encouraging AI Learning Coach for BharatEdu AI.
Student Name: ${studentName}
Language: ${preferredLanguage}
Readiness Score: ${readiness.score}% (${readiness.label})
Top Priority Task: ${topRec ? topRec.title : 'General Practice'}
Available Time: ${availableMinutes} minutes

Return a JSON object with 3 fields:
1. "greeting": A warm, brief 1-line greeting addressing the student by name in their language.
2. "dailyGoal": A clear, inspiring 1-line summary of what the student should focus on today.
3. "motivation": A short 1-line motivational sentence to encourage their study session.

Return ONLY raw valid JSON.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return {
          greeting: parsed.greeting || `Hello ${studentName}!`,
          dailyGoal: parsed.dailyGoal || `Focus on ${topTopic} today.`,
          motivation: parsed.motivation || 'Keep learning every day!',
          aiEnhanced: true,
        };
      }
      return getFallback();
    } catch (err) {
      return getFallback();
    }
  },
};
