import type { Options } from "@anthropic-ai/claude-agent-sdk";
import type { AgentConfig } from "./config.js";
import {
  type CouncilDomain,
  getCouncilAgents,
  buildCouncilChairPrompt,
} from "./agents/council/index.js";
import { getMcpServers } from "./mcp/servers.js";
import { executeQuery } from "./executor.js";
import * as log from "./utils/logger.js";

/**
 * Run a council of expert agents for a specific domain.
 * The Council Chair delegates to all specialists, then synthesizes a unified plan.
 */
export async function runCouncil(
  domain: CouncilDomain,
  prompt: string,
  config: AgentConfig,
  mcpServerNames?: string[]
): Promise<void> {
  const agents = getCouncilAgents(domain);
  const agentNames = Object.keys(agents);
  const chairPrompt = buildCouncilChairPrompt(domain, agents);
  const mcpServers = config.enableMcp ? getMcpServers(mcpServerNames) : {};

  const options: Options = {
    agents,
    allowedTools: ["Task"],
    cwd: config.cwd,
    maxBudgetUsd: config.maxBudgetUsd,
    model: config.model,
    mcpServers,
    permissionMode: "acceptEdits",
    systemPrompt: chairPrompt,
  };

  log.debug(`Starting ${domain} council with agents:`, agentNames);

  await executeQuery(prompt, options, config, "council-chair");
}
