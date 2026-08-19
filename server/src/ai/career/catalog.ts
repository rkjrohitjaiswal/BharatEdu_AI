import { CareerDefinition } from './types.js';

export const CAREER_CATALOG: CareerDefinition[] = [
  {
    id: 'full-stack-developer',
    title: 'Full-Stack Developer',
    description: 'Build production web applications across frontend, backend, databases, APIs and deployment.',
    skills: [
      { name: 'HTML & CSS', keywords: ['html', 'css', 'frontend'], weight: 1, description: 'Accessible responsive interfaces.', projectIdeas: ['Responsive education portal'] },
      { name: 'JavaScript', keywords: ['javascript', 'js'], weight: 1.2, description: 'Modern language fundamentals and browser programming.', projectIdeas: ['Interactive quiz application'] },
      { name: 'React', keywords: ['react', 'react.js'], weight: 1.2, description: 'Component-driven frontend development.', projectIdeas: ['Student analytics dashboard'] },
      { name: 'Node.js & APIs', keywords: ['node', 'node.js', 'express', 'api'], weight: 1.2, description: 'Backend services and REST APIs.', projectIdeas: ['Secure REST API'] },
      { name: 'Databases', keywords: ['mongodb', 'mysql', 'database', 'sql'], weight: 1, description: 'Data modeling, queries and persistence.', projectIdeas: ['Learning management database'] },
      { name: 'Git & Deployment', keywords: ['git', 'github', 'deployment', 'cloud'], weight: 0.8, description: 'Version control and production delivery.', projectIdeas: ['CI/CD deployed web app'] },
    ],
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / ML Engineer',
    description: 'Develop machine-learning systems with strong programming, data, model evaluation and deployment skills.',
    skills: [
      { name: 'Python', keywords: ['python'], weight: 1.3, description: 'Core programming for ML workflows.', projectIdeas: ['ML data analysis toolkit'] },
      { name: 'Statistics', keywords: ['statistics', 'probability'], weight: 1, description: 'Probability and statistical reasoning.', projectIdeas: ['Student performance predictor'] },
      { name: 'Machine Learning', keywords: ['machine learning', 'ml'], weight: 1.3, description: 'Supervised and unsupervised learning.', projectIdeas: ['Learning-gap classifier'] },
      { name: 'Data Structures & Algorithms', keywords: ['data structures', 'algorithms', 'dsa'], weight: 1, description: 'Efficient problem solving.', projectIdeas: ['Algorithm visualizer'] },
      { name: 'Deep Learning', keywords: ['deep learning', 'neural network'], weight: 1.1, description: 'Neural-network concepts and training.', projectIdeas: ['Image classification model'] },
      { name: 'AI Deployment', keywords: ['api', 'cloud', 'deployment', 'docker'], weight: 0.8, description: 'Serve and monitor models in production.', projectIdeas: ['Production ML inference API'] },
    ],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Turn data into measurable insights using statistics, programming, visualization and machine learning.',
    skills: [
      { name: 'Python', keywords: ['python'], weight: 1.2, description: 'Data analysis and automation.', projectIdeas: ['Exploratory data analysis notebook'] },
      { name: 'Statistics', keywords: ['statistics', 'probability'], weight: 1.3, description: 'Statistical inference and experimentation.', projectIdeas: ['A/B test analysis'] },
      { name: 'SQL & Databases', keywords: ['sql', 'mysql', 'database'], weight: 1.1, description: 'Reliable analytical data retrieval.', projectIdeas: ['Education analytics warehouse'] },
      { name: 'Machine Learning', keywords: ['machine learning', 'ml'], weight: 1.1, description: 'Predictive modeling and validation.', projectIdeas: ['Student outcome predictor'] },
      { name: 'Data Visualization', keywords: ['visualization', 'charts', 'analytics'], weight: 0.9, description: 'Communicate insights clearly.', projectIdeas: ['Education KPI dashboard'] },
    ],
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Create fast, accessible and maintainable web interfaces.',
    skills: [
      { name: 'HTML & CSS', keywords: ['html', 'css'], weight: 1.2, description: 'Semantic responsive UI.', projectIdeas: ['Accessible portfolio'] },
      { name: 'JavaScript', keywords: ['javascript', 'js'], weight: 1.2, description: 'Interactive browser applications.', projectIdeas: ['Interactive learning app'] },
      { name: 'React', keywords: ['react', 'react.js'], weight: 1.3, description: 'Modern component architecture.', projectIdeas: ['React learning dashboard'] },
      { name: 'UI/UX', keywords: ['ui', 'ux', 'design'], weight: 0.9, description: 'Usable and accessible experiences.', projectIdeas: ['Student-first design system'] },
      { name: 'Git & Deployment', keywords: ['git', 'github', 'deployment'], weight: 0.8, description: 'Ship reliable frontend builds.', projectIdeas: ['Production portfolio deployment'] },
    ],
  },
];

export function findCareer(id: string) {
  return CAREER_CATALOG.find(c => c.id === id);
}
