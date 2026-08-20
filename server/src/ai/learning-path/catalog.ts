export interface IStarterCurriculumStage {
  stageIndex: number;
  title: string;
  description: string;
  subject: string;
  conceptIds: string[];
  topicIds: string[];
  prerequisiteConceptIds: string[];
  estimatedMinutes: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  masteryRequired: number;
  tasks: {
    taskType: 'learn' | 'practice' | 'revise' | 'assessment' | 'resource' | 'remediation' | 'exam_prep';
    title: string;
    description: string;
    conceptId: string;
    topicId: string;
    resourceId?: string;
    estimatedMinutes: number;
  }[];
}

export const STARTER_CURRICULUM_STAGES: IStarterCurriculumStage[] = [
  {
    stageIndex: 1,
    title: 'Stage 1 — Root Prerequisites & Foundation',
    description: 'Repair root prerequisite gaps in Number Systems & Algebraic Fundamentals.',
    subject: 'Mathematics',
    conceptIds: ['math_num_sys', 'math_algebra_fund'],
    topicIds: ['Number Systems', 'Algebraic Fundamentals'],
    prerequisiteConceptIds: [],
    estimatedMinutes: 45,
    priority: 'critical',
    masteryRequired: 70,
    tasks: [
      {
        taskType: 'remediation',
        title: 'Master Number Systems & Operations',
        description: 'Review foundational number systems, prime factorization, and rational properties.',
        conceptId: 'math_num_sys',
        topicId: 'Number Systems',
        resourceId: 'res_math_alg_1',
        estimatedMinutes: 15,
      },
      {
        taskType: 'learn',
        title: 'Study Polynomial Algebraic Identities',
        description: 'Learn expansions for (a+b)^2, (a-b)^2, and identity applications.',
        conceptId: 'math_algebra_fund',
        topicId: 'Algebraic Fundamentals',
        resourceId: 'res_math_alg_1',
        estimatedMinutes: 15,
      },
      {
        taskType: 'practice',
        title: 'Foundational Algebra Practice',
        description: '10 introductory practice problems testing algebraic simplification.',
        conceptId: 'math_algebra_fund',
        topicId: 'Algebraic Fundamentals',
        estimatedMinutes: 15,
      },
    ],
  },
  {
    stageIndex: 2,
    title: 'Stage 2 — Core Concepts: Linear Equations',
    description: 'Master pair of linear equations in two variables and graphical solutions.',
    subject: 'Mathematics',
    conceptIds: ['math_linear_eq'],
    topicIds: ['Linear Equations'],
    prerequisiteConceptIds: ['math_algebra_fund'],
    estimatedMinutes: 50,
    priority: 'high',
    masteryRequired: 75,
    tasks: [
      {
        taskType: 'learn',
        title: 'Substitution & Elimination Methods',
        description: 'Learn algebraic methods for solving pair of linear equations.',
        conceptId: 'math_linear_eq',
        topicId: 'Linear Equations',
        resourceId: 'res_math_lin_1',
        estimatedMinutes: 15,
      },
      {
        taskType: 'practice',
        title: 'Linear Equations Practice Problems',
        description: 'Solve 10 problem sets on linear equations.',
        conceptId: 'math_linear_eq',
        topicId: 'Linear Equations',
        resourceId: 'res_math_lin_2',
        estimatedMinutes: 15,
      },
      {
        taskType: 'assessment',
        title: 'Adaptive Linear Equations Assessment',
        description: 'Take adaptive assessment to verify mastery of Linear Equations.',
        conceptId: 'math_linear_eq',
        topicId: 'Linear Equations',
        estimatedMinutes: 20,
      },
    ],
  },
  {
    stageIndex: 3,
    title: 'Stage 3 — Applied Practice: Quadratic Equations & CS Basics',
    description: 'Solve quadratic equations and learn computer science control flow fundamentals.',
    subject: 'Mathematics',
    conceptIds: ['math_quadratic_eq', 'cs_variables'],
    topicIds: ['Quadratic Equations', 'Variables & Data Types'],
    prerequisiteConceptIds: ['math_linear_eq'],
    estimatedMinutes: 60,
    priority: 'high',
    masteryRequired: 75,
    tasks: [
      {
        taskType: 'learn',
        title: 'Quadratic Formula & Discriminant Analysis',
        description: 'Understand b^2 - 4ac discriminant and real vs complex roots.',
        conceptId: 'math_quadratic_eq',
        topicId: 'Quadratic Equations',
        resourceId: 'res_math_quad_1',
        estimatedMinutes: 20,
      },
      {
        taskType: 'learn',
        title: 'Python Variables & Data Types',
        description: 'Learn variable declaration, integer, float, string, and boolean types in Python.',
        conceptId: 'cs_variables',
        topicId: 'Variables & Data Types',
        resourceId: 'res_cs_var_1',
        estimatedMinutes: 15,
      },
      {
        taskType: 'practice',
        title: 'Applied Quadratic & CS Problem Solving',
        description: 'Mixed practice session for Quadratic Equations and Python logic.',
        conceptId: 'math_quadratic_eq',
        topicId: 'Quadratic Equations',
        estimatedMinutes: 25,
      },
    ],
  },
  {
    stageIndex: 4,
    title: 'Stage 4 — Science Fundamentals: Optics & Chemistry',
    description: 'Explore light reflection, mirror formulas, and chemical reaction balancing.',
    subject: 'Physics',
    conceptIds: ['phy_light_refl', 'chem_reactions'],
    topicIds: ['Light Reflection', 'Chemical Reactions'],
    prerequisiteConceptIds: [],
    estimatedMinutes: 50,
    priority: 'medium',
    masteryRequired: 80,
    tasks: [
      {
        taskType: 'learn',
        title: 'Spherical Mirrors & Ray Diagrams',
        description: 'Study concave and convex mirror ray diagrams and sign conventions.',
        conceptId: 'phy_light_refl',
        topicId: 'Light Reflection',
        resourceId: 'res_phy_light_1',
        estimatedMinutes: 15,
      },
      {
        taskType: 'learn',
        title: 'Balancing Chemical Equations',
        description: 'Learn conservation of mass and chemical balancing strategies.',
        conceptId: 'chem_reactions',
        topicId: 'Chemical Reactions',
        resourceId: 'res_chem_react_1',
        estimatedMinutes: 15,
      },
      {
        taskType: 'practice',
        title: 'Optics & Reactions Practice Test',
        description: 'Practice questions testing ray diagram calculations and reaction balancing.',
        conceptId: 'phy_light_refl',
        topicId: 'Light Reflection',
        estimatedMinutes: 20,
      },
    ],
  },
  {
    stageIndex: 5,
    title: 'Stage 5 — Comprehensive Adaptive Assessment',
    description: 'Multi-topic adaptive evaluation across all core subjects.',
    subject: 'Cross-Disciplinary',
    conceptIds: ['math_quadratic_eq', 'chem_reactions', 'cs_variables'],
    topicIds: ['Quadratic Equations', 'Chemical Reactions', 'Variables & Data Types'],
    prerequisiteConceptIds: ['math_linear_eq'],
    estimatedMinutes: 45,
    priority: 'medium',
    masteryRequired: 85,
    tasks: [
      {
        taskType: 'assessment',
        title: 'Full Adaptive Benchmark Assessment',
        description: '15-question adaptive exam across Math, Physics, Chemistry, and CS.',
        conceptId: 'math_quadratic_eq',
        topicId: 'Quadratic Equations',
        estimatedMinutes: 30,
      },
      {
        taskType: 'revise',
        title: 'Post-Assessment Error Review',
        description: 'Review wrong answers and consolidate mastery.',
        conceptId: 'math_quadratic_eq',
        topicId: 'Quadratic Equations',
        estimatedMinutes: 15,
      },
    ],
  },
  {
    stageIndex: 6,
    title: 'Stage 6 — Mastery & Spaced Repetition Maintenance',
    description: 'Long-term maintenance via automated spaced repetition queues.',
    subject: 'Cross-Disciplinary',
    conceptIds: ['math_linear_eq', 'math_quadratic_eq', 'phy_light_refl'],
    topicIds: ['Linear Equations', 'Quadratic Equations', 'Light Reflection'],
    prerequisiteConceptIds: [],
    estimatedMinutes: 30,
    priority: 'low',
    masteryRequired: 90,
    tasks: [
      {
        taskType: 'revise',
        title: 'Daily Spaced Repetition Routine',
        description: '10-minute daily review queue targeting mastered concepts.',
        conceptId: 'math_linear_eq',
        topicId: 'Linear Equations',
        estimatedMinutes: 15,
      },
      {
        taskType: 'exam_prep',
        title: 'Mock Board Exam Preparation',
        description: 'Timed full-syllabus practice paper.',
        conceptId: 'math_linear_eq',
        topicId: 'Linear Equations',
        estimatedMinutes: 15,
      },
    ],
  },
];
