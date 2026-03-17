import type { Options } from "@anthropic-ai/claude-agent-sdk";
import type { AgentConfig } from "./config.js";
import { codeAnalyst } from "./agents/code-analyst.js";
import { codeReviewer } from "./agents/code-reviewer.js";
import { researcher } from "./agents/researcher.js";
import { devops } from "./agents/devops.js";
import { securityAuditor } from "./agents/security-auditor.js";
import { utility } from "./agents/utility.js";
import { getMcpServers } from "./mcp/servers.js";
import { executeQuery } from "./executor.js";
import * as log from "./utils/logger.js";

const agents = {
  "code-analyst": codeAnalyst,
  "code-reviewer": codeReviewer,
  researcher,
  devops,
  "security-auditor": securityAuditor,
  utility,
};

const routerPrompt = `You are a task router. Your ONLY job is to analyze the user's request and delegate it to the right specialist agent using the Task tool.

Available specialists:
- "code-analyst": Targeted code fixes, bug detection, debugging, refactoring, and adding tests for specific files or issues
- "code-reviewer": Project-wide code quality audits, systematic reviews across entire codebases, identifying patterns of issues
- "researcher": Web research, information gathering, fact-checking, and report writing
- "devops": Shell commands, deployments, log analysis, system administration, and automation
- "security-auditor": Security vulnerability scanning, secrets detection, data leak analysis, and OWASP compliance checks (READ-ONLY)
- "utility": General-purpose tasks that don't fit the above categories

Instructions:
1. Read the user's request carefully
2. Choose the best specialist
3. Use the Task tool to delegate the work with a clear, detailed prompt
4. You may delegate to multiple specialists if the task requires it
5. NEVER try to do the work yourself — always delegate
6. Use "code-reviewer" for broad code quality sweeps across a project; use "code-analyst" for targeted bug fixes or changes to specific files
7. Use "security-auditor" for any security-related analysis, vulnerability detection, or data leak investigations`;

/**
 * Run the router agent which dispatches to specialist subagents.
 */
export async function runRouter(
  prompt: string,
  config: AgentConfig,
  mcpServerNames?: string[]
): Promise<void> {
  const mcpServers = config.enableMcp ? getMcpServers(mcpServerNames) : {};

  const options: Options = {
    agents,
    allowedTools: ["Task"],
    cwd: config.cwd,
    maxBudgetUsd: config.maxBudgetUsd,
    model: config.model,
    mcpServers,
    permissionMode: "acceptEdits",
    systemPrompt: routerPrompt,
  };

  log.debug("Starting router with model:", config.model);
  log.debug("MCP servers:", Object.keys(mcpServers));

  await executeQuery(prompt, options, config, "router");
}

/**
 * Run a specific specialist agent directly, skipping the router.
 */
export async function runDirect(
  agentName: keyof typeof agents,
  prompt: string,
  config: AgentConfig,
  mcpServerNames?: string[]
): Promise<void> {
  const agent = agents[agentName];
  if (!agent) {
    log.error(`Unknown agent: ${agentName}`);
    process.exit(1);
  }

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

  log.debug(`Starting ${agentName} directly with model:`, config.model);

  await executeQuery(prompt, options, config, agentName);
}
