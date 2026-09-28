import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: './dev.db' });
const prisma = new PrismaClient({ adapter });

const DEMO_PARTICIPANTS = [
  { name: 'Aryan', email: 'aryan@example.com', preferredRole: 'Backend Engineer', experienceLevel: 4, skills: ['Java', 'Spring Boot', 'AWS'], interests: ['Microservices', 'Cloud Architecture'] },
  { name: 'Ananya', email: 'ananya@example.com', preferredRole: 'Frontend Engineer', experienceLevel: 3, skills: ['React', 'TypeScript', 'UI/UX'], interests: ['Design Systems', 'Web Animation'] },
  { name: 'Rohan', email: 'rohan@example.com', preferredRole: 'Data Scientist', experienceLevel: 5, skills: ['Python', 'Machine Learning', 'Data Analysis'], interests: ['AI', 'Predictive Modeling'] },
  { name: 'Ishita', email: 'ishita@example.com', preferredRole: 'UI/UX Designer', experienceLevel: 3, skills: ['Figma', 'UI/UX', 'React'], interests: ['User Research', 'Prototyping'] },
  { name: 'Kabir', email: 'kabir@example.com', preferredRole: 'DevOps Engineer', experienceLevel: 4, skills: ['AWS', 'Docker', 'Kubernetes'], interests: ['CI/CD', 'Infrastructure'] },
  { name: 'Meera', email: 'meera@example.com', preferredRole: 'Backend Engineer', experienceLevel: 3, skills: ['Python', 'FastAPI', 'SQL'], interests: ['API Design', 'Databases'] },
  { name: 'Arjun', email: 'arjun@example.com', preferredRole: 'Backend Engineer', experienceLevel: 4, skills: ['Java', 'SQL', 'Spring Boot'], interests: ['Enterprise Software', 'Optimization'] },
  { name: 'Siya', email: 'siya@example.com', preferredRole: 'Frontend Engineer', experienceLevel: 4, skills: ['React', 'Next.js', 'Tailwind'], interests: ['Performance', 'Accessibility'] },
  { name: 'Dev', email: 'dev@example.com', preferredRole: 'Software Engineer', experienceLevel: 5, skills: ['C++', 'Algorithms', 'DSA'], interests: ['Competitive Programming', 'System Design'] },
  { name: 'Riya', email: 'riya@example.com', preferredRole: 'Mobile Developer', experienceLevel: 3, skills: ['Flutter', 'Dart', 'Firebase'], interests: ['Mobile UI', 'Cross-platform'] },
  { name: 'Aditya', email: 'aditya@example.com', preferredRole: 'Full Stack Engineer', experienceLevel: 4, skills: ['Node.js', 'Express', 'MongoDB'], interests: ['MERN', 'WebSockets'] },
  { name: 'Tara', email: 'tara@example.com', preferredRole: 'Security Engineer', experienceLevel: 5, skills: ['Cybersecurity', 'Linux', 'Networking'], interests: ['Penetration Testing', 'SecOps'] },
  { name: 'Kunal', email: 'kunal@example.com', preferredRole: 'DevOps Engineer', experienceLevel: 4, skills: ['AWS', 'Terraform', 'CI/CD'], interests: ['Automation', 'Cloud Security'] },
  { name: 'Naina', email: 'naina@example.com', preferredRole: 'UI/UX Designer', experienceLevel: 4, skills: ['Product Design', 'Figma', 'Research'], interests: ['Product Strategy', 'User Testing'] },
  { name: 'Veer', email: 'veer@example.com', preferredRole: 'Machine Learning Engineer', experienceLevel: 4, skills: ['Python', 'Computer Vision', 'OpenCV'], interests: ['Image Processing', 'Deep Learning'] }
];

const DEMO_CHALLENGES = [
  { title: 'Smart City Command Center', description: 'Build a real-time dashboard for city infrastructure monitoring.', teamSize: 4, difficulty: 'Hard', requiredSkills: ['React', 'TypeScript', 'Node.js', 'AWS'], requiredRoles: ['Frontend Engineer', 'Backend Engineer', 'DevOps Engineer', 'UI/UX Designer'] },
  { title: 'Artisan Marketplace', description: 'Create a localized e-commerce platform for independent creators.', teamSize: 4, difficulty: 'Medium', requiredSkills: ['Next.js', 'UI/UX', 'Node.js', 'SQL'], requiredRoles: ['Frontend Engineer', 'Backend Engineer', 'UI/UX Designer', 'Full Stack Engineer'] },
  { title: 'AI Health Assistant', description: 'Develop a predictive health tracking app using machine learning.', teamSize: 4, difficulty: 'Hard', requiredSkills: ['Python', 'AI/ML', 'React', 'APIs'], requiredRoles: ['Data Scientist', 'Machine Learning Engineer', 'Frontend Engineer', 'Backend Engineer'] },
  { title: 'Climate Watch', description: 'Data visualization platform for real-time climate metrics.', teamSize: 3, difficulty: 'Medium', requiredSkills: ['Python', 'Data Analysis', 'AWS', 'Visualization'], requiredRoles: ['Data Scientist', 'DevOps Engineer', 'Software Engineer'] },
  { title: 'Secure Campus Network', description: 'Design and implement a robust authentication and monitoring system.', teamSize: 3, difficulty: 'Hard', requiredSkills: ['Cybersecurity', 'Linux', 'Networking', 'Python'], requiredRoles: ['Security Engineer', 'DevOps Engineer', 'Backend Engineer'] }
];

async function seed() {
  console.log('Seeding Demo Data...');
  
  for (const p of DEMO_PARTICIPANTS) {
    const exists = await prisma.participant.findFirst({ where: { name: p.name } });
    if (!exists) {
      await prisma.participant.create({
        data: {
          name: p.name,
          email: p.email,
          preferredRole: p.preferredRole,
          experienceLevel: p.experienceLevel,
          skills: JSON.stringify(p.skills),
          interests: JSON.stringify(p.interests)
        }
      });
      console.log(`Created participant: ${p.name}`);
    } else {
      console.log(`Participant already exists: ${p.name}`);
    }
  }

  for (const c of DEMO_CHALLENGES) {
    const exists = await prisma.challenge.findFirst({ where: { title: c.title } });
    if (!exists) {
      await prisma.challenge.create({
        data: {
          title: c.title,
          description: c.description,
          teamSize: c.teamSize,
          difficulty: c.difficulty,
          requiredSkills: JSON.stringify(c.requiredSkills),
          requiredRoles: JSON.stringify(c.requiredRoles)
        }
      });
      console.log(`Created challenge: ${c.title}`);
    } else {
      console.log(`Challenge already exists: ${c.title}`);
    }
  }
  
  console.log('Seeding complete.');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
