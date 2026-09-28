import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: './dev.db' });
const prisma = new PrismaClient({ adapter });

async function reset() {
  console.log('Resetting demo state...\n');

  // 1. Unassign all participants from teams
  const unassigned = await prisma.participant.updateMany({
    where: { teamId: { not: null } },
    data: { teamId: null },
  });
  console.log(`Unassigned ${unassigned.count} participant(s).`);

  // 2. Delete all generated teams
  const deleted = await prisma.team.deleteMany({});
  console.log(`Deleted ${deleted.count} team(s).\n`);

  // 3. Verify
  const participants = await prisma.participant.findMany({ where: { teamId: null } });
  const challenges = await prisma.challenge.findMany({});
  const teams = await prisma.team.findMany({});

  console.log(`✓ Participants available (unassigned): ${participants.length}`);
  console.log(`✓ Challenges intact:                  ${challenges.length}`);
  console.log(`✓ Teams remaining:                    ${teams.length}`);
  console.log('\nDemo state is clean. Ready for Davy Back generation.');
}

reset()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
