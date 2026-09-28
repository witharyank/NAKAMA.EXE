import { NextResponse } from 'next/server';

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400, code?: string) {
  return NextResponse.json(
    { success: false, error: { message, code } },
    { status }
  );
}

export function safeParseJSON(str: string | null | undefined, fallback: any = []) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export function safeStringifyJSON(obj: any, fallback: string = '[]') {
  if (!obj) return fallback;
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return fallback;
  }
}

export function formatParticipant(p: any) {
  return {
    ...p,
    skills: safeParseJSON(p.skills, []),
    interests: safeParseJSON(p.interests, []),
  };
}

export function formatChallenge(c: any) {
  return {
    ...c,
    requiredSkills: safeParseJSON(c.requiredSkills, []),
    requiredRoles: safeParseJSON(c.requiredRoles, []),
  };
}

export function formatTeam(t: any) {
  return {
    ...t,
    skillCoverage: safeParseJSON(t.skillCoverage, []),
    roleCoverage: safeParseJSON(t.roleCoverage, []),
    members: t.members ? t.members.map(formatParticipant) : undefined,
    assignedChallenge: t.assignedChallenge ? formatChallenge(t.assignedChallenge) : undefined,
  };
}
