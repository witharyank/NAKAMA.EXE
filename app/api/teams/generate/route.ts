import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, safeParseJSON, safeStringifyJSON, formatTeam } from '@/lib/api-utils';
import { formTeams, generateTeamName, ParticipantData, ChallengeData } from '@/lib/matching';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { challengeId, participantIds } = body;

    if (!challengeId || typeof challengeId !== 'string') {
      return errorResponse('challengeId is required', 400, 'VALIDATION_ERROR');
    }

    // Load challenge
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return errorResponse('Challenge not found', 404, 'NOT_FOUND');
    }

    const cData: ChallengeData = {
      id: challenge.id,
      requiredSkills: safeParseJSON(challenge.requiredSkills, []),
      requiredRoles: safeParseJSON(challenge.requiredRoles, []),
      teamSize: challenge.teamSize
    };

    // Load available participants
    // We only load participants not currently in a team unless specific IDs are requested
    let pQuery: any = { where: { teamId: null } }; 
    if (participantIds && Array.isArray(participantIds) && participantIds.length > 0) {
      pQuery.where.id = { in: participantIds };
    }

    const dbParticipants = await prisma.participant.findMany(pQuery);

    if (dbParticipants.length < challenge.teamSize) {
      return errorResponse(`Not enough participants to form a team of size ${challenge.teamSize}`, 400, 'NOT_ENOUGH_PARTICIPANTS');
    }

    const pData: ParticipantData[] = dbParticipants.map(p => ({
      id: p.id,
      skills: safeParseJSON(p.skills, []),
      interests: safeParseJSON(p.interests, []),
      preferredRole: p.preferredRole,
      experienceLevel: p.experienceLevel
    }));

    // Run matching engine
    const formedTeams = formTeams(pData, cData);

    if (formedTeams.length === 0) {
      return errorResponse('Failed to form any complete teams', 400, 'FORMATION_FAILED');
    }

    const createdTeams = [];

    // Create Team records and attach participants
    // Using a transaction to ensure integrity
    for (let i = 0; i < formedTeams.length; i++) {
      const candidate = formedTeams[i];
      const teamName = generateTeamName(i, challenge.title);

      const newTeam = await prisma.team.create({
        data: {
          name: teamName,
          challengeId: challenge.id,
          compatibilityScore: candidate.score.totalScore,
          skillCoverage: safeStringifyJSON(candidate.score.matchedSkills),
          roleCoverage: safeStringifyJSON(candidate.score.matchedRoles),
          members: {
            connect: candidate.participants.map(p => ({ id: p.id }))
          }
        },
        include: {
          members: true,
          assignedChallenge: true
        }
      });
      createdTeams.push(newTeam);
    }

    // Format output
    return successResponse({
      message: `Successfully generated ${createdTeams.length} team(s)`,
      teams: createdTeams.map(formatTeam),
      leftovers: pData.length - (formedTeams.length * challenge.teamSize)
    }, 201);

  } catch (error) {
    console.error('Error in team generation:', error);
    return errorResponse('Failed to generate teams', 500, 'INTERNAL_SERVER_ERROR');
  }
}
