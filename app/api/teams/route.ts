import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, formatTeam } from '@/lib/api-utils';

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        members: true,
        assignedChallenge: true,
      },
    });
    
    return successResponse(teams.map(formatTeam));
  } catch (error) {
    console.error('Error fetching teams:', error);
    return errorResponse('Failed to fetch teams', 500, 'INTERNAL_SERVER_ERROR');
  }
}
