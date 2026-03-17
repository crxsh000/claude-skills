import dotenv from "dotenv";
import { resolve, join } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

export interface AgentConfig {
  model: string;
  maxBudgetUsd: number;
  cwd: string;
  verbose: boolean;
  enableMcp: boolean;
  skillsDir: string;
}

const defaults: AgentConfig = {
  model: process.env.CLAUDE_MODEL ?? "claude-sonnet-4-5-20250929",
  maxBudgetUsd: parseFloat(process.env.MAX_BUDGET_USD ?? "5"),
  cwd: process.cwd(),
  verbose: false,
  enableMcp: true,
  skillsDir: process.env.SKILLS_DIR ?? join(process.cwd(), "skills"),
};

export function buildConfig(overrides: Partial<AgentConfig> = {}): AgentConfig {
  return { ...defaults, ...overrides };
}
