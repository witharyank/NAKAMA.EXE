export interface ParticipantData {
  id: string;
  skills: string[];
  interests: string[];
  preferredRole: string;
  experienceLevel: number; // 1-10
}

export interface ChallengeData {
  id: string;
  requiredSkills: string[];
  requiredRoles: string[];
  teamSize: number;
}

export interface ScoreBreakdown {
  skillScore: number;       // Max 50
  roleScore: number;        // Max 25
  interestScore: number;    // Max 15
  experienceScore: number;  // Max 10
  totalScore: number;       // Max 100
  matchedSkills: string[];
  missingSkills: string[];
  matchedRoles: string[];
  missingRoles: string[];
}

export interface TeamCandidate {
  participants: ParticipantData[];
  score: ScoreBreakdown;
}

function normalize(arr: string[]): string[] {
  return Array.from(new Set(arr.map(s => s.trim().toLowerCase()))).filter(Boolean);
}

export function evaluateTeamScore(
  members: ParticipantData[],
  challenge: ChallengeData
): ScoreBreakdown {
  if (members.length === 0) {
    return {
      skillScore: 0, roleScore: 0, interestScore: 0, experienceScore: 0, totalScore: 0,
      matchedSkills: [], missingSkills: normalize(challenge.requiredSkills),
      matchedRoles: [], missingRoles: normalize(challenge.requiredRoles)
    };
  }

  // 1. Skill Match (50%)
  const reqSkills = normalize(challenge.requiredSkills);
  const teamSkills = normalize(members.flatMap(m => m.skills));
  
  const matchedSkills = reqSkills.filter(s => teamSkills.includes(s));
  const missingSkills = reqSkills.filter(s => !teamSkills.includes(s));
  
  const skillScore = reqSkills.length > 0 
    ? (matchedSkills.length / reqSkills.length) * 50 
    : 50; // If no skills required, give full points

  // 2. Role Match (25%)
  const reqRoles = normalize(challenge.requiredRoles);
  const teamRoles = normalize(members.map(m => m.preferredRole));
  
  // A team might cover multiple required roles.
  const matchedRoles = reqRoles.filter(r => teamRoles.includes(r));
  const missingRoles = reqRoles.filter(r => !teamRoles.includes(r));
  
  const roleScore = reqRoles.length > 0
    ? (matchedRoles.length / reqRoles.length) * 25
    : 25;

  // 3. Interest Match (15%)
  // Challenge schema has no 'interests' field currently. 
  // We return a neutral baseline 15 out of 15 as requested to avoid artificially penalizing.
  const interestScore = 15;

  // 4. Experience Match (10%)
  // Objective is balanced team composition. A mix of skills usually averages out to ~5.5 (on a 1-10 scale).
  // We score based on how close the team's average is to 5.5.
  const avgExp = members.reduce((sum, m) => sum + m.experienceLevel, 0) / members.length;
  const dist = Math.abs(avgExp - 5.5);
  // Max possible distance is 4.5. Closer to 0 is better.
  const experienceScore = Math.max(0, 10 - (dist / 4.5) * 10);

  const totalScore = skillScore + roleScore + interestScore + experienceScore;

  return {
    skillScore,
    roleScore,
    interestScore,
    experienceScore,
    totalScore,
    matchedSkills,
    missingSkills,
    matchedRoles,
    missingRoles
  };
}

export function formTeams(
  participants: ParticipantData[],
  challenge: ChallengeData
): TeamCandidate[] {
  let available = [...participants];
  const teams: TeamCandidate[] = [];

  const numTeams = Math.floor(available.length / challenge.teamSize);
  if (numTeams === 0) return []; // Not enough participants for even 1 team

  for (let i = 0; i < numTeams; i++) {
    const currentMembers: ParticipantData[] = [];
    
    // Greedily pick the best participant for each slot
    for (let slot = 0; slot < challenge.teamSize; slot++) {
      let bestCandidateIndex = -1;
      let bestScore = -1;

      for (let j = 0; j < available.length; j++) {
        const candidate = available[j];
        // Evaluate score if this candidate joins
        const testMembers = [...currentMembers, candidate];
        const score = evaluateTeamScore(testMembers, challenge).totalScore;
        
        if (score > bestScore) {
          bestScore = score;
          bestCandidateIndex = j;
        }
      }

      if (bestCandidateIndex !== -1) {
        currentMembers.push(available[bestCandidateIndex]);
        available.splice(bestCandidateIndex, 1);
      }
    }

    teams.push({
      participants: currentMembers,
      score: evaluateTeamScore(currentMembers, challenge)
    });
  }

  // Leftover participants remain unassigned.
  return teams;
}

export function generateTeamName(index: number, challengeTitle: string): string {
  // Deterministic, generic team name.
  // The frontend can present this visually as a pirate crew in Phase 7.
  const shortTitle = challengeTitle.substring(0, 10).trim().replace(/\s+/g, '-').toUpperCase();
  return `Squad-${shortTitle}-0${index + 1}`;
}
