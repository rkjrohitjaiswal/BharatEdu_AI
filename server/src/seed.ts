import dotenv from 'dotenv';
import { connectDB } from './services/db';
import { dataRepository } from './repositories/data.repository';
import { DocumentIngester } from './rag/ingestion/ingester';

dotenv.config();

export const seedDatabase = async () => {
  console.log('🌱 Starting BharatEdu AI Development Seeding Process...');

  await connectDB();

  // 1. Seed Subjects
  console.log('📌 Seeding Core Subjects...');
  const math = await dataRepository.seedSubject({
    name: 'Mathematics',
    code: 'MATH-08',
    description: 'NCERT Grade 8 Mathematics curriculum covering Algebra, Geometry, and Numbers.',
    classLevels: [6, 7, 8, 9, 10],
    language: 'english',
  });

  const science = await dataRepository.seedSubject({
    name: 'Science',
    code: 'SCI-08',
    description: 'NCERT Grade 8 Science curriculum covering Physics, Chemistry, and Biology fundamentals.',
    classLevels: [6, 7, 8, 9, 10],
    language: 'english',
  });

  const english = await dataRepository.seedSubject({
    name: 'English Language & Literature',
    code: 'ENG-08',
    description: 'Grammatical concepts, reading comprehension, and creative writing.',
    classLevels: [6, 7, 8, 9, 10],
    language: 'english',
  });

  const cs = await dataRepository.seedSubject({
    name: 'Computer Science & AI Literacy',
    code: 'CS-08',
    description: 'Fundamental computational thinking, logic building, and introductory AI concepts.',
    classLevels: [6, 7, 8, 9, 10],
    language: 'english',
  });

  // 2. Seed Topics & Prerequisite Knowledge Graph
  console.log('📌 Seeding Topics & Prerequisite Graph...');
  const mathSubjId = math._id || math.id;
  const sciSubjId = science._id || science.id;

  const topicAlgIntro = await dataRepository.seedTopic({
    subjectId: mathSubjId,
    name: 'Algebraic Expressions & Identities',
    description: 'Monomials, binomials, polynomials, and standard algebraic identities.',
    classLevel: 8,
    difficulty: 'beginner',
    learningObjectives: [
      'Understand terms, factors, and coefficients',
      'Add and subtract polynomials',
      'Apply identity (a+b)^2 = a^2 + 2ab + b^2',
    ],
    estimatedLearningMinutes: 45,
  });

  const algIntroId = topicAlgIntro._id || topicAlgIntro.id;

  const topicLinEq = await dataRepository.seedTopic({
    subjectId: mathSubjId,
    name: 'Linear Equations in One Variable',
    description: 'Solving linear equations with variables on one and both sides.',
    classLevel: 8,
    difficulty: 'intermediate',
    parentTopicId: algIntroId,
    prerequisiteTopicIds: [algIntroId],
    learningObjectives: [
      'Formulate linear equations from word problems',
      'Solve equations using transposition',
      'Verify solutions',
    ],
    estimatedLearningMinutes: 50,
  });

  const topicForce = await dataRepository.seedTopic({
    subjectId: sciSubjId,
    name: 'Force and Pressure',
    description: 'Contact and non-contact forces, atmospheric pressure, and liquid pressure.',
    classLevel: 8,
    difficulty: 'beginner',
    learningObjectives: [
      'Define force as a push or pull',
      'Calculate pressure P = Force / Area',
      'Explain atmospheric pressure applications',
    ],
    estimatedLearningMinutes: 40,
  });

  const forceId = topicForce._id || topicForce.id;

  const topicChemCurr = await dataRepository.seedTopic({
    subjectId: sciSubjId,
    name: 'Chemical Effects of Electric Current',
    description: 'Conduction through liquids, electroplating principles, and electrolysis.',
    classLevel: 8,
    difficulty: 'intermediate',
    prerequisiteTopicIds: [forceId],
    learningObjectives: [
      'Identify conducting and non-conducting liquids',
      'Demonstrate electroplating in laboratory setup',
    ],
    estimatedLearningMinutes: 45,
  });

  // 3. Seed Official Scholarships
  console.log('📌 Seeding Official Scholarship Opportunities...');
  await dataRepository.seedScholarship({
    name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    provider: 'Ministry of Education, Government of India',
    description: 'Financial assistance of ₹12,000 per annum to meritorious students from economically weaker sections to prevent dropping out at class VIII.',
    eligibilityCriteria: [
      'Students studying in Class VIII in State Govt / Govt Aided schools',
      'Minimum 55% marks in Class VII examination',
      'Parental annual income from all sources not exceeding ₹3,50,000',
    ],
    requiredDocuments: ['Class VII Marksheet', 'Income Certificate', 'Caste Certificate (if applicable)'],
    applicationUrl: 'https://scholarships.gov.in',
    deadline: new Date('2026-10-31'),
    educationLevels: ['Class 8', 'Class 9', 'Class 10'],
    locations: ['All India'],
    incomeCriteria: 'Annual income <= ₹3,50,000',
    categoryCriteria: ['General', 'OBC', 'SC', 'ST'],
    status: 'active',
    source: 'official',
  });

  await dataRepository.seedScholarship({
    name: 'State Open Schooling Education Allowance',
    provider: 'Department of School Education & Literacy',
    description: 'Direct stipend, learning material kit, and mentoring support for out-of-school children (OOSC) re-entering mainstream education.',
    eligibilityCriteria: [
      'Out-of-school children enrolled via Special Training Centers',
      'Age group 6 to 14 years',
      'Registered under Samagra Shiksha OOSC portal',
    ],
    requiredDocuments: ['OOSC Registration Card', 'Aadhaar Card', 'Bank Passbook'],
    applicationUrl: 'https://samagrashiksha.gov.in',
    deadline: new Date('2026-12-31'),
    educationLevels: ['Elementary Education', 'Class 6-8'],
    locations: ['All India'],
    incomeCriteria: 'No strict income cap',
    categoryCriteria: ['All Categories'],
    status: 'active',
    source: 'official',
  });

  // 4. Seed Grounded RAG Educational Knowledge Base
  console.log('📌 Ingesting Open Educational Resources into RAG Knowledge Base...');

  // RAG Doc 1: NCERT Grade 8 Math - Linear Equations & Algebra
  await DocumentIngester.ingestDocument({
    title: 'NCERT Grade 8 Mathematics Chapter 2: Linear Equations in One Variable',
    description: 'Official NCERT textbook chapter covering linear equations, transposition rules, and algebraic identities.',
    publisher: 'National Council of Educational Research and Training (NCERT)',
    sourceUrl: 'https://ncert.nic.in/textbook.php?hhem1=2-13',
    documentType: 'chapter',
    language: 'english',
    subject: 'Mathematics',
    classLevels: [8],
    license: 'Public Educational Resource (NCERT Open Curriculum)',
    attribution: 'NCERT Department of Education in Science and Mathematics',
    content: '',
    sections: [
      {
        sectionTitle: 'Section 2.1: Introduction to Algebraic Equations',
        page: 21,
        text: 'An algebraic equation is an equality involving variables. It has an equality sign (=). The expression on the left of the equality sign is the Left Hand Side (LHS). The expression on the right is the Right Hand Side (RHS). In a linear equation, the highest power of the variable appearing in the expression is 1.',
      },
      {
        sectionTitle: 'Section 2.2: Solving Equations having Linear Expressions on One Side',
        page: 23,
        text: 'To solve a linear equation, we transpose terms containing the variable to one side and constant values to the other side. Remember that when a number is transposed from LHS to RHS, its sign changes (+ becomes -, - becomes +, multiplication becomes division, and division becomes multiplication). Example: 2x - 3 = 7 => 2x = 7 + 3 => 2x = 10 => x = 5.',
      },
      {
        sectionTitle: 'Section 2.5: Standard Algebraic Identities',
        page: 28,
        text: 'An identity is an equality which is true for all values of the variables in it. Identity I: (a + b)^2 = a^2 + 2ab + b^2. Identity II: (a - b)^2 = a^2 - 2ab + b^2. Identity III: (a + b)(a - b) = a^2 - b^2. Identity IV: (x + a)(x + b) = x^2 + (a + b)x + ab.',
      },
    ],
  });

  // RAG Doc 2: NCERT Grade 8 Science - Force, Pressure & Chemical Effects
  await DocumentIngester.ingestDocument({
    title: 'NCERT Grade 8 Science Chapter 11: Force and Pressure',
    description: 'NCERT Science textbook chapter explaining contact and non-contact forces, atmospheric pressure, and electroplating.',
    publisher: 'National Council of Educational Research and Training (NCERT)',
    sourceUrl: 'https://ncert.nic.in/textbook.php?hesc1=11-18',
    documentType: 'chapter',
    language: 'english',
    subject: 'Science',
    classLevels: [8],
    license: 'Public Educational Resource (NCERT Open Curriculum)',
    attribution: 'NCERT Department of Education in Science and Mathematics',
    content: '',
    sections: [
      {
        sectionTitle: 'Section 11.1: Force - A Push or a Pull',
        page: 127,
        text: 'A force is a push or a pull acting on an object resulting from its interaction with another object. Forces applied on an object in the same direction add to one another. If two forces act in opposite directions on an object, the net force acting on it is the difference between the two forces. The SI unit of force is the Newton (N).',
      },
      {
        sectionTitle: 'Section 11.8: Pressure',
        page: 134,
        text: 'Pressure is defined as the force acting per unit area of a surface: Pressure = Force / Area. The smaller the area for a given force, the greater is the pressure on the surface. Atmospheric pressure is the pressure exerted by the weight of air in the atmosphere.',
      },
      {
        sectionTitle: 'Section 14.2: Chemical Effects of Electric Current & Electroplating',
        page: 175,
        text: 'The passage of an electric current through a conducting liquid causes chemical reactions. The resulting effects are called chemical effects of electric current. Electroplating is the process of depositing a layer of any desired metal on another material by means of electricity. It is widely used in industry for coating metal objects with a thin layer of a different metal (e.g. chromium plating on bicycle handlebars).',
      },
    ],
  });

  console.log('✅ BharatEdu AI Seeding Process Completed Successfully!\n');
};

seedDatabase().then(() => {
  console.log('Done.');
});
