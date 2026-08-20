export interface CatalogResource {
  id: string;
  title: string;
  description: string;
  resourceType:
    | 'video'
    | 'article'
    | 'notes'
    | 'pdf'
    | 'practice'
    | 'quiz'
    | 'flashcards'
    | 'simulation'
    | 'textbook'
    | 'revision'
    | 'exam_material'
    | 'career_resource';
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  board: string;
  classLevel: string;
  language: string;
  url: string;
  provider: string;
  sourceDomain: string;
  thumbnailUrl?: string;
  estimatedMinutes: number;
  tags: string[];
  verified: boolean;
  official: boolean;
  active: boolean;
}

export const STARTER_RESOURCE_CATALOG: CatalogResource[] = [
  // Mathematics
  {
    id: 'res_math_01',
    title: 'Quadratic Equations & Formula Derivation Video',
    description: 'Comprehensive video explanation of quadratic formula, discriminant analysis, and step-by-step worked examples.',
    resourceType: 'video',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    difficulty: 'intermediate',
    board: 'CBSE',
    classLevel: 'Class 10',
    language: 'English',
    url: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratic-functions-equations',
    provider: 'Khan Academy',
    sourceDomain: 'khanacademy.org',
    estimatedMinutes: 15,
    tags: ['algebra', 'quadratics', 'equations', 'math'],
    verified: true,
    official: true,
    active: true,
  },
  {
    id: 'res_math_02',
    title: 'NCERT Class 10 Mathematics Chapter 4 PDF Notes',
    description: 'Official NCERT textbook chapter covering quadratic equations, real roots condition, and word problems.',
    resourceType: 'notes',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    difficulty: 'beginner',
    board: 'CBSE',
    classLevel: 'Class 10',
    language: 'English',
    url: 'https://ncert.nic.in/textbook.php?jemh1=4-15',
    provider: 'NCERT Official',
    sourceDomain: 'ncert.nic.in',
    estimatedMinutes: 20,
    tags: ['ncert', 'quadratics', 'cbse', 'class10'],
    verified: true,
    official: true,
    active: true,
  },
  {
    id: 'res_math_03',
    title: 'Trigonometric Ratios & Identities Practice Quiz',
    description: 'Interactive practice set covering sine, cosine, tangent values, standard angles, and pythagorean trigonometric identities.',
    resourceType: 'practice',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    difficulty: 'intermediate',
    board: 'CBSE',
    classLevel: 'Class 10',
    language: 'English',
    url: 'https://www.khanacademy.org/math/trigonometry',
    provider: 'Khan Academy',
    sourceDomain: 'khanacademy.org',
    estimatedMinutes: 15,
    tags: ['trigonometry', 'practice', 'identities'],
    verified: true,
    official: true,
    active: true,
  },

  // Physics
  {
    id: 'res_phys_01',
    title: 'Light Reflection & Refraction Masterclass Notes',
    description: 'Concise revision notes explaining concave and convex mirror ray diagrams, lens formula, and magnification calculations.',
    resourceType: 'revision',
    subject: 'Physics',
    topic: 'Light - Reflection and Refraction',
    difficulty: 'intermediate',
    board: 'CBSE',
    classLevel: 'Class 10',
    language: 'English',
    url: 'https://ncert.nic.in/textbook.php?jesc1=10-16',
    provider: 'NCERT Official',
    sourceDomain: 'ncert.nic.in',
    estimatedMinutes: 15,
    tags: ['physics', 'optics', 'reflection', 'refraction'],
    verified: true,
    official: true,
    active: true,
  },
  {
    id: 'res_phys_02',
    title: 'Electricity & Ohm\'s Law Interactive Simulation',
    description: 'Interactive PhET physics simulation demonstrating circuit voltage, current flow, and resistance using Ohm\'s law.',
    resourceType: 'simulation',
    subject: 'Physics',
    topic: 'Electricity',
    difficulty: 'beginner',
    board: 'CBSE',
    classLevel: 'Class 10',
    language: 'English',
    url: 'https://phet.colorado.edu/en/simulations/ohms-law',
    provider: 'PhET Interactive Simulations',
    sourceDomain: 'colorado.edu',
    estimatedMinutes: 10,
    tags: ['electricity', 'simulation', 'ohms-law'],
    verified: true,
    official: true,
    active: true,
  },

  // Chemistry
  {
    id: 'res_chem_01',
    title: 'Chemical Reactions & Equations Summary Flashcards',
    description: 'Quick-review flashcards covering balancing chemical equations, combination, decomposition, displacement, and redox reactions.',
    resourceType: 'flashcards',
    subject: 'Chemistry',
    topic: 'Chemical Reactions and Equations',
    difficulty: 'beginner',
    board: 'CBSE',
    classLevel: 'Class 10',
    language: 'English',
    url: 'https://ncert.nic.in/textbook.php?jesc1=1-16',
    provider: 'NCERT Official',
    sourceDomain: 'ncert.nic.in',
    estimatedMinutes: 10,
    tags: ['chemistry', 'reactions', 'flashcards', 'equations'],
    verified: true,
    official: true,
    active: true,
  },

  // Biology
  {
    id: 'res_bio_01',
    title: 'Life Processes & Cellular Respiration Guide',
    description: 'Detailed study guide covering nutrition, respiration, transportation, and excretion in plants and animals.',
    resourceType: 'article',
    subject: 'Biology',
    topic: 'Life Processes',
    difficulty: 'intermediate',
    board: 'CBSE',
    classLevel: 'Class 10',
    language: 'English',
    url: 'https://ncert.nic.in/textbook.php?jesc1=6-16',
    provider: 'NCERT Official',
    sourceDomain: 'ncert.nic.in',
    estimatedMinutes: 20,
    tags: ['biology', 'life-processes', 'respiration'],
    verified: true,
    official: true,
    active: true,
  },

  // Computer Science & Programming
  {
    id: 'res_cs_01',
    title: 'Python Programming Basics for Beginners',
    description: 'Step-by-step introduction to Python variables, data types, conditional loops, functions, and elementary algorithms.',
    resourceType: 'textbook',
    subject: 'Computer Science',
    topic: 'Python Programming',
    difficulty: 'beginner',
    board: 'General',
    classLevel: 'Class 10-12',
    language: 'English',
    url: 'https://docs.python.org/3/tutorial/index.html',
    provider: 'Python Software Foundation',
    sourceDomain: 'python.org',
    estimatedMinutes: 30,
    tags: ['python', 'programming', 'computer-science', 'coding'],
    verified: true,
    official: true,
    active: true,
  },

  // AI & Machine Learning
  {
    id: 'res_ai_01',
    title: 'Introductory Artificial Intelligence & Machine Learning Concepts',
    description: 'Overview of AI concepts, supervised vs unsupervised learning, neural networks, and real-world AI applications.',
    resourceType: 'article',
    subject: 'AI / Machine Learning',
    topic: 'AI Fundamentals',
    difficulty: 'intermediate',
    board: 'General',
    classLevel: 'Class 10-12',
    language: 'English',
    url: 'https://nptel.ac.in/courses/106105077',
    provider: 'NPTEL India',
    sourceDomain: 'nptel.ac.in',
    estimatedMinutes: 25,
    tags: ['ai', 'machine-learning', 'nptel', 'technology'],
    verified: true,
    official: true,
    active: true,
  },

  // English
  {
    id: 'res_eng_01',
    title: 'English Grammar & Writing Skills Practice',
    description: 'Interactive guide covering formal letter writing, analytical paragraphs, active/passive voice, and direct/indirect speech.',
    resourceType: 'notes',
    subject: 'English',
    topic: 'Grammar and Writing',
    difficulty: 'beginner',
    board: 'CBSE',
    classLevel: 'Class 10',
    language: 'English',
    url: 'https://ncert.nic.in/textbook.php?feef1=0-11',
    provider: 'NCERT Official',
    sourceDomain: 'ncert.nic.in',
    estimatedMinutes: 15,
    tags: ['english', 'grammar', 'writing', 'cbse'],
    verified: true,
    official: true,
    active: true,
  },

  // Exam Preparation
  {
    id: 'res_exam_01',
    title: 'CBSE Class 10 Board Exam Mock Question Paper & Solutions',
    description: 'Official CBSE sample question paper with detailed marking scheme and sample solution breakdown.',
    resourceType: 'exam_material',
    subject: 'General Exam Prep',
    topic: 'Board Exam Preparation',
    difficulty: 'advanced',
    board: 'CBSE',
    classLevel: 'Class 10',
    language: 'English',
    url: 'https://cbseacademic.nic.in/sqp_classx_2023-24.html',
    provider: 'CBSE Academic Official',
    sourceDomain: 'cbseacademic.nic.in',
    estimatedMinutes: 30,
    tags: ['exam-prep', 'cbse', 'sample-paper', 'mock-test'],
    verified: true,
    official: true,
    active: true,
  },

  // Career Preparation
  {
    id: 'res_career_01',
    title: 'Software Engineer Career & Portfolio Guide',
    description: 'Roadmap for aspiring software developers covering coding projects, open source contributions, and technical interviews.',
    resourceType: 'career_resource',
    subject: 'Career Development',
    topic: 'Software Engineering',
    difficulty: 'intermediate',
    board: 'General',
    classLevel: 'Class 10-12',
    language: 'English',
    url: 'https://www.coursera.org/articles/how-to-become-a-software-engineer',
    provider: 'Coursera Career Guide',
    sourceDomain: 'coursera.org',
    estimatedMinutes: 20,
    tags: ['career', 'software-engineer', 'roadmap', 'tech'],
    verified: true,
    official: true,
    active: true,
  },
];
