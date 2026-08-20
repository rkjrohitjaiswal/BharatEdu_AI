import { IDoubtSourceReference } from '../../models/doubt-response.model.js';

export function retrieveEducationalContext(
  subject: string,
  topicId: string,
  conceptId?: string
): { sources: IDoubtSourceReference[]; trustedContextStr: string } {
  const sources: IDoubtSourceReference[] = [
    {
      sourceType: 'curriculum_catalog',
      sourceId: 'ncert_cbse_2026',
      officialSourceUrl: 'https://ncert.nic.in/textbook.pt',
      title: `${subject} Class 10 NCERT Standard Textbook`,
    },
    {
      sourceType: 'internal_explanation',
      sourceId: `ref_${topicId.toLowerCase()}_01`,
      title: `BharatEdu AI Knowledge Graph Concept Standard: ${topicId}`,
    },
  ];

  const trustedContextStr = `Official NCERT & Curriculum standard context for ${subject} - Topic: ${topicId}. Verified step-by-step principles apply.`;

  return { sources, trustedContextStr };
}
