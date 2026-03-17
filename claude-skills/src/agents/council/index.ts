import type { AgentDefinition } from "@anthropic-ai/claude-agent-sdk";
import { lifeCoach } from "./personal/life-coach.js";
import { healthWellness } from "./personal/health-wellness.js";
import { relationships } from "./personal/relationships.js";
import { beliefArchitect } from "./personal/belief-architect.js";
import { strategist } from "./business/strategist.js";
import { marketingGrowth } from "./business/marketing-growth.js";
import { operationsFinance } from "./business/operations-finance.js";
import { academicAdvisor } from "./education/academic-advisor.js";
import { studyCoach } from "./education/study-coach.js";
import { researchMentor } from "./education/research-mentor.js";
import { youtubeKnowledgeExtractor } from "./marketing/youtube-knowledge-extractor.js";
import { dmSpecialist } from "./marketing/dm-specialist.js";
import { salesTactics } from "./marketing/sales-tactics.js";
import { instagramGrowth } from "./marketing/instagram-growth.js";
import {
  mindsetCouncil,
  buildMindsetChairPrompt,
} from "./mindset/index.js";

export type CouncilDomain = "personal" | "business" | "education" | "marketing" | "mindset" | "all";

export const personalCouncil: Record<string, AgentDefinition> = {
  "life-coach": lifeCoach,
  "health-wellness": healthWellness,
  relationships,
  "belief-architect": beliefArchitect,
};

export const businessCouncil: Record<string, AgentDefinition> = {
  strategist,
  "marketing-growth": marketingGrowth,
  "operations-finance": operationsFinance,
};

export const educationCouncil: Record<string, AgentDefinition> = {
  "academic-advisor": academicAdvisor,
  "study-coach": studyCoach,
  "research-mentor": researchMentor,
};

export const marketingCouncil: Record<string, AgentDefinition> = {
  "youtube-extractor": youtubeKnowledgeExtractor,
  "dm-specialist": dmSpecialist,
  "sales-tactics": salesTactics,
  "instagram-growth": instagramGrowth,
};

export const allCouncilAgents: Record<string, AgentDefinition> = {
  ...personalCouncil,
  ...businessCouncil,
  ...educationCouncil,
  ...marketingCouncil,
  ...mindsetCouncil,
};

export function getCouncilAgents(
  domain: CouncilDomain
): Record<string, AgentDefinition> {
  switch (domain) {
    case "personal":
      return personalCouncil;
    case "business":
      return businessCouncil;
    case "education":
      return educationCouncil;
    case "marketing":
      return marketingCouncil;
    case "mindset":
      return mindsetCouncil;
    case "all":
      return allCouncilAgents;
  }
}

/**
 * Build the Council Chair's system prompt dynamically based on the selected domain.
 */
export function buildCouncilChairPrompt(
  domain: CouncilDomain,
  agents: Record<string, AgentDefinition>
): string {
  const agentList = Object.entries(agents)
    .map(([name, agent]) => `- "${name}": ${agent.description}`)
    .join("\n");

  // Special prompt for mindset council — uses The Architect as chair
  if (domain === "mindset") {
    return buildMindsetChairPrompt(agents);
  }

  // Special prompt for marketing council
  if (domain === "marketing") {
    return `You are the Marketing Council Chair for Instagram outreach to fitness coaches.

## Your Council Members
${agentList}

## Knowledge Base
All members access \`data/marketing-knowledge-base.json\` for learnings from YouTube videos.

## Process
1. Analyze the outreach challenge
2. Delegate to EACH council member
3. Synthesize into unified strategy

## Output Format
### Situation Assessment
[Brief synthesis]

### Pre-Outreach (Instagram Growth)
[Warm-up steps]

### Opening DM Options
[2-3 ready-to-use messages]

### Follow-Up Sequence
[Timed follow-ups]

### Conversation Flow
[Guide replies toward call]

### Objection Handling
[Likely objections + responses]

### Knowledge Base Insights
[Relevant learnings]

## Instructions
- Delegate to ALL members
- Provide SPECIFIC, READY-TO-USE messages
- Reference target avatar psychology`;
  }

  const domainLabel =
    domain === "all" ? "all domains" : `the ${domain} domain`;

  return `You are the Council Chair — an expert facilitator and synthesizer. Your job is to coordinate a council of specialist advisors covering ${domainLabel} to produce a comprehensive, unified actionable plan.

## Your Council Members
${agentList}

## Process
1. **Analyze** the user's request to understand their situation, goals, and constraints.
2. **Delegate** to EACH council member using the Task tool. Give each member:
   - The full context of the user's request
   - A clear directive to provide their specialist perspective
   - Any relevant information from other members' responses (for later delegates)
3. **Synthesize** all perspectives into a unified plan that:
   - Resolves conflicts between recommendations
   - Prioritizes actions by impact and feasibility
   - Creates a realistic timeline
   - Identifies dependencies between domains
4. **Present** the final plan in this format:

## Council Assessment
[Brief synthesis of the situation from all perspectives]

## Unified Action Plan

### Immediate Actions (This Week)
- [ ] Action item with owner/domain

### Short-Term Goals (1-3 Months)
- [ ] Goal with specific milestones

### Medium-Term Goals (3-6 Months)
- [ ] Goal with specific milestones

### Long-Term Vision (6-12 Months)
- [ ] Goal with specific milestones

## Key Dependencies & Conflicts
[Note where recommendations interact or conflict across domains]

## Tracking & Accountability
[How to measure progress — specific metrics and review cadence]

## Instructions
- Delegate to ALL council members — do not skip any.
- NEVER try to answer yourself — always delegate first, then synthesize.
- After receiving all perspectives, synthesize thoroughly.
- Be specific with action items — include what, when, and how.
- Resolve contradictions between members (e.g., if one says "work more" and another says "rest more").`;
}
