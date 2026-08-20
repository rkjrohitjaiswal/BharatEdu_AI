import { ResourceCandidate } from './types.js';

export const VERIFIED_RESOURCE_CATALOG: ResourceCandidate[] = [
  {
    resourceId: 'res_ncert_math_ch4',
    title: 'NCERT Class 10 Mathematics Chapter 4: Quadratic Equations',
    description: 'Official NCERT textbook chapter covering quadratic equations, factorization, and quadratic formulas with solved examples.',
    resourceType: 'textbook',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    conceptId: 'math_quadratic',
    classLevel: 10,
    board: 'CBSE',
    language: 'en',
    difficulty: 'standard',
    durationMinutes: 30,
    provider: 'NCERT Official',
    url: 'https://ncert.nic.in/textbook/pdf/jemh104.pdf',
    officialSource: 'https://ncert.nic.in',
    officialSourceUrl: 'https://ncert.nic.in',
    sourceUrl: 'https://ncert.nic.in/textbook/pdf/jemh104.pdf',
    verified: true,
    isVerified: true,
    status: 'active',
    isActive: true,
  },
  {
    resourceId: 'res_ncert_math_ch2',
    title: 'NCERT Class 10 Mathematics Chapter 2: Polynomials',
    description: 'Official NCERT textbook chapter on zeroes of polynomials and relationship between coefficients.',
    resourceType: 'textbook',
    subject: 'Mathematics',
    topic: 'Polynomials',
    conceptId: 'math_polynomials',
    classLevel: 10,
    board: 'CBSE',
    language: 'en',
    difficulty: 'standard',
    durationMinutes: 25,
    provider: 'NCERT Official',
    url: 'https://ncert.nic.in/textbook/pdf/jemh102.pdf',
    officialSource: 'https://ncert.nic.in',
    verified: true,
    status: 'active',
  },
  {
    resourceId: 'res_ncert_sci_ch10',
    title: 'NCERT Class 10 Science Chapter 10: Light - Reflection and Refraction',
    description: 'Official NCERT chapter on reflection laws, ray diagrams, and lens formulas.',
    resourceType: 'textbook',
    subject: 'Science',
    topic: 'Light - Reflection and Refraction',
    conceptId: 'sci_light_reflection',
    classLevel: 10,
    board: 'CBSE',
    language: 'en',
    difficulty: 'standard',
    durationMinutes: 35,
    provider: 'NCERT Official',
    url: 'https://ncert.nic.in/textbook/pdf/jesc110.pdf',
    officialSource: 'https://ncert.nic.in',
    verified: true,
    status: 'active',
  },
  {
    resourceId: 'res_cbse_math_sample_2026',
    title: 'CBSE Class 10 Mathematics Official Sample Question Paper 2026',
    description: 'Official CBSE sample paper with detailed marking scheme and solution steps.',
    resourceType: 'worksheet',
    subject: 'Mathematics',
    topic: 'General Board Revision',
    conceptId: 'math_quadratic',
    classLevel: 10,
    board: 'CBSE',
    language: 'en',
    difficulty: 'advanced',
    durationMinutes: 45,
    provider: 'CBSE Official Academic Website',
    url: 'https://cbseacademic.nic.in/SQP_CLASSX_2025_26.html',
    officialSource: 'https://cbseacademic.nic.in',
    verified: true,
    status: 'active',
  },
];

export class ResourceCatalogEngine {
  static getVerifiedCatalog(): ResourceCandidate[] {
    return VERIFIED_RESOURCE_CATALOG;
  }

  static findByConcept(conceptId: string): ResourceCandidate[] {
    return VERIFIED_RESOURCE_CATALOG.filter((r) => r.conceptId === conceptId && r.verified && r.status === 'active');
  }
}

export function getAllCatalogResources(): ResourceCandidate[] {
  return VERIFIED_RESOURCE_CATALOG;
}
