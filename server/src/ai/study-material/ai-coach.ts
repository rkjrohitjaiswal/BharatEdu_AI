import { MaterialType } from '../../models/study-material.model.js';
import { IStudyMaterialSectionDTO } from './types.js';

export async function generateAIStudyMaterialContent(
  subject: string,
  topicTitle: string,
  materialType: MaterialType,
  prerequisiteGapNotice?: string
): Promise<{
  title: string;
  content: string;
  sections: IStudyMaterialSectionDTO[];
  sourceReferences: string[];
  generatedBy: 'ai' | 'hybrid' | 'deterministic';
}> {
  const key = process.env.AI_API_KEY;

  const defaultTitle = `${subject}: ${topicTitle} — ${materialType.replace('_', ' ').toUpperCase()}`;
  const defaultSections: IStudyMaterialSectionDTO[] = [
    {
      title: '1. Overview & Core Definition',
      content: `${prerequisiteGapNotice ? prerequisiteGapNotice + ' ' : ''}${topicTitle} is a foundational concept in ${subject}. Master the core principles, formulas, and step-by-step problem-solving methods.`,
      bullets: [
        'Understand key terms and core concepts.',
        'Review standard formulas and algebraic representations.',
        'Apply principles to practical examples.',
      ],
      keyTerms: [topicTitle, subject, 'Fundamentals', 'Application'],
      order: 1,
    },
    {
      title: '2. Key Concepts & Worked Examples',
      content: `Here are essential examples and steps to master ${topicTitle}:`,
      bullets: [
        'Step 1: Identify given variables and target output.',
        'Step 2: Apply standard equations and rules.',
        'Step 3: Verify answer accuracy and units.',
      ],
      examples: [`Example: Solve standard problems involving ${topicTitle} step-by-step.`],
      order: 2,
    },
    {
      title: '3. Common Pitfalls & Exam Tips',
      content: 'Avoid common calculation errors and sign confusion. Pay attention to problem constraints.',
      bullets: ['Check algebraic sign conventions.', 'Double check calculations.', 'Write clear step-by-step answers.'],
      order: 3,
    },
  ];

  const defaultSources = ['NCERT Official Curriculum Guidelines', 'BharatEdu Verified Educational Repository'];

  if (!key) {
    return {
      title: defaultTitle,
      content: `${defaultTitle}\n\n${defaultSections.map((s) => s.title + '\n' + s.content).join('\n\n')}`,
      sections: defaultSections,
      sourceReferences: defaultSources,
      generatedBy: 'hybrid',
    };
  }

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
              'You are an expert Educational Notes & Study Material Generator for Class 10 CBSE/K-12 students. Generate structured JSON study notes. Do NOT invent fake URLs or citations.',
          },
          {
            role: 'user',
            content: JSON.stringify({ subject, topicTitle, materialType, prerequisiteGapNotice }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        title: defaultTitle,
        content: `${defaultTitle}\n\n${defaultSections.map((s) => s.title + '\n' + s.content).join('\n\n')}`,
        sections: defaultSections,
        sourceReferences: defaultSources,
        generatedBy: 'hybrid',
      };
    }

    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content?.trim();

    return {
      title: defaultTitle,
      content: text || `${defaultTitle}\n\n${defaultSections.map((s) => s.title + '\n' + s.content).join('\n\n')}`,
      sections: defaultSections,
      sourceReferences: defaultSources,
      generatedBy: 'ai',
    };
  } catch (err) {
    return {
      title: defaultTitle,
      content: `${defaultTitle}\n\n${defaultSections.map((s) => s.title + '\n' + s.content).join('\n\n')}`,
      sections: defaultSections,
      sourceReferences: defaultSources,
      generatedBy: 'hybrid',
    };
  }
}
