import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, safeStringifyJSON, formatChallenge } from '@/lib/api-utils';

export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(challenges.map(formatChallenge));
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return errorResponse('Failed to fetch challenges', 500, 'INTERNAL_SERVER_ERROR');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, requiredSkills, requiredRoles, teamSize, difficulty } = body;

    // Validation
    if (!title || typeof title !== 'string') {
      return errorResponse('Title is required and must be a string', 400, 'VALIDATION_ERROR');
    }
    if (!description || typeof description !== 'string') {
      return errorResponse('Description is required and must be a string', 400, 'VALIDATION_ERROR');
    }
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return errorResponse('Required Skills are required and must be an array', 400, 'VALIDATION_ERROR');
    }
    if (!requiredRoles || !Array.isArray(requiredRoles)) {
      return errorResponse('Required Roles are required and must be an array', 400, 'VALIDATION_ERROR');
    }
    if (teamSize === undefined || typeof teamSize !== 'number' || teamSize < 1) {
      return errorResponse('Team Size is required and must be a positive integer', 400, 'VALIDATION_ERROR');
    }
    if (!difficulty || typeof difficulty !== 'string') {
      return errorResponse('Difficulty is required and must be a string', 400, 'VALIDATION_ERROR');
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        requiredSkills: safeStringifyJSON(requiredSkills),
        requiredRoles: safeStringifyJSON(requiredRoles),
        teamSize,
        difficulty,
      },
    });

    return successResponse(formatChallenge(challenge), 201);
  } catch (error) {
    console.error('Error creating challenge:', error);
    return errorResponse('Failed to create challenge', 500, 'INTERNAL_SERVER_ERROR');
  }
}
