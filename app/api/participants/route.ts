import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, safeStringifyJSON, formatParticipant } from '@/lib/api-utils';

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(participants.map(formatParticipant));
  } catch (error) {
    console.error('Error fetching participants:', error);
    return errorResponse('Failed to fetch participants', 500, 'INTERNAL_SERVER_ERROR');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, avatar, skills, interests, preferredRole, experienceLevel } = body;

    // Validation
    if (!name || typeof name !== 'string') {
      return errorResponse('Name is required and must be a string', 400, 'VALIDATION_ERROR');
    }
    if (!skills || !Array.isArray(skills)) {
      return errorResponse('Skills are required and must be an array', 400, 'VALIDATION_ERROR');
    }
    if (!interests || !Array.isArray(interests)) {
      return errorResponse('Interests are required and must be an array', 400, 'VALIDATION_ERROR');
    }
    if (!preferredRole || typeof preferredRole !== 'string') {
      return errorResponse('Preferred Role is required and must be a string', 400, 'VALIDATION_ERROR');
    }
    if (experienceLevel === undefined || typeof experienceLevel !== 'number' || experienceLevel < 1 || experienceLevel > 10) {
      return errorResponse('Experience Level is required and must be a number between 1 and 10', 400, 'VALIDATION_ERROR');
    }

    const participant = await prisma.participant.create({
      data: {
        name,
        email: email || null,
        avatar: avatar || null,
        skills: safeStringifyJSON(skills),
        interests: safeStringifyJSON(interests),
        preferredRole,
        experienceLevel,
      },
    });

    return successResponse(formatParticipant(participant), 201);
  } catch (error) {
    console.error('Error creating participant:', error);
    return errorResponse('Failed to create participant', 500, 'INTERNAL_SERVER_ERROR');
  }
}
