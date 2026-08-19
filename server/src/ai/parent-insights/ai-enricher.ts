import OpenAI from 'openai';

export const AIParentEnricher = {
  async generateParentSummary(params: {
    studentName: string;
    preferredLanguage: string;
    overallMastery: number;
    trend: string;
    weakestSubject?: string;
    strongestSubject?: string;
  }): Promise<{
    summary: string;
    encouragement: string;
    suggestions: string[];
    aiEnhanced: boolean;
  }> {
    const { studentName, preferredLanguage, overallMastery, trend, weakestSubject, strongestSubject } = params;
    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;

    const getFallback = () => {
      let summary = `${studentName} is maintaining an overall learning mastery of ${overallMastery}%.`;
      if (weakestSubject) {
        summary += ` Additional practice in ${weakestSubject} is recommended to strengthen core concepts.`;
      }
      let encouragement = 'Consistent daily 15-30 minute study sessions build solid long-term learning foundations.';
      let suggestions = [
        `Encourage regular 15-minute daily practice sessions.`,
        weakestSubject ? `Review ${weakestSubject} practice topics together.` : 'Celebrate daily practice streaks.',
      ];

      if (preferredLanguage === 'hindi') {
        summary = `${studentName} वर्तमान में ${overallMastery}% की समग्र अध्ययन दक्षता बनाए रख रहे हैं।`;
        if (weakestSubject) {
          summary += ` ${weakestSubject} में अतिरिक्त अभ्यास की आवश्यकता है।`;
        }
        encouragement = 'प्रतिदिन 15-30 मिनट का अध्ययन बच्चे के ज्ञान को मजबूत करता है।';
        suggestions = [
          'बच्चे को दैनिक अभ्यास बनाए रखने के लिए प्रोत्साहित करें।',
          weakestSubject ? `${weakestSubject} के विषयों पर विशेष ध्यान दें।` : 'दैनिक अध्ययन प्रयासों की सराहना करें।',
        ];
      } else if (preferredLanguage === 'gujarati') {
        summary = `${studentName} વર્તમાનમાં ${overallMastery}% ની એકંદર ક્ષમતા જાળવી રહ્યા છે.`;
        if (weakestSubject) {
          summary += ` ${weakestSubject} માં વધારાના મહાવરાની જરૂર છે.`;
        }
        encouragement = 'દરરોજ 15-30 મિનિટનો અભ્યાસ બાળકના જ્ઞાનને મજબૂત કરે છે.';
        suggestions = [
          'બાળકને રોજીંદો અભ્યાસ ચાલુ રાખવા પ્રોત્સાહિત કરો.',
          weakestSubject ? `${weakestSubject} ના વિષયો પર ખાસ ધ્યાન આપો.` : 'દૈનિક પ્રયાસોની પ્રશંસા કરો.',
        ];
      }

      return {
        summary,
        encouragement,
        suggestions,
        aiEnhanced: false,
      };
    };

    if (!apiKey) {
      return getFallback();
    }

    try {
      const openai = new OpenAI({ apiKey });
      const prompt = `You are a helpful, supportive Parent Learning Advisor for BharatEdu AI.
Student Name: ${studentName}
Language: ${preferredLanguage}
Overall Mastery: ${overallMastery}%
Trend: ${trend}
Strongest Subject: ${strongestSubject || 'General'}
Focus Area: ${weakestSubject || 'Core Practice'}

Return a JSON object with:
1. "summary": A clear 2-line summary of learning progress for the parent in their language.
2. "encouragement": An encouraging sentence for the parent.
3. "suggestions": An array of 2 simple, practical suggestions for the parent.

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
          summary: parsed.summary || `${studentName} is progressing well.`,
          encouragement: parsed.encouragement || 'Keep encouraging daily study!',
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ['Encourage daily study.'],
          aiEnhanced: true,
        };
      }
      return getFallback();
    } catch (err) {
      return getFallback();
    }
  },
};
