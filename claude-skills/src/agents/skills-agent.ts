import type { Options } from "@anthropic-ai/claude-agent-sdk";
import type { AgentConfig } from "../config.js";
import { loadSkillPrompt, buildSkillAgent } from "../skills/loader.js";
import { getMcpServers } from "../mcp/servers.js";
import { executeQuery } from "../executor.js";
import * as log from "../utils/logger.js";

/**
 * Run a task using a specific Anthropic skill.
 * Loads the skill's SKILL.md and creates a dynamic agent from it.
 */
export async function runSkill(
  skillName: string,
  prompt: string,
  config: AgentConfig,
  mcpServerNames?: string[]
): Promise<void> {
  const { metadata, body } = await loadSkillPrompt(skillName, config.skillsDir);
  const agent = buildSkillAgent(skillName, body, metadata);
  const mcpServers = config.enableMcp ? getMcpServers(mcpServerNames) : {};

  const options: Options = {
    allowedTools: agent.tools,
    cwd: config.cwd,
    maxBudgetUsd: config.maxBudgetUsd,
    model: config.model,
    mcpServers,
    permissionMode: "acceptEdits",
    systemPrompt: agent.prompt,
  };

  log.debug(`Starting skill "${skillName}" with model:`, config.model);

  await executeQuery(prompt, options, config, `skill:${skillName}`);
}
