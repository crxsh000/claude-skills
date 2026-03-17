import chalk from "chalk";
import type { SDKMessage } from "@anthropic-ai/claude-agent-sdk";

const agentColors: Record<string, (text: string) => string> = {
  router: chalk.magenta,
  "code-analyst": chalk.green,
  researcher: chalk.blue,
  devops: chalk.yellow,
  utility: chalk.cyan,
  // Council agents
  "council-chair": chalk.bold.magenta,
  "life-coach": chalk.greenBright,
  "health-wellness": chalk.green,
  relationships: chalk.cyanBright,
  strategist: chalk.blueBright,
  "marketing-growth": chalk.blue,
  "operations-finance": chalk.yellowBright,
  "academic-advisor": chalk.magentaBright,
  "study-coach": chalk.redBright,
  "research-mentor": chalk.whiteBright,
  // Review & security agents
  "code-reviewer": chalk.greenBright,
  "security-auditor": chalk.redBright,
  // Speaking coach
  "speaking-coach": chalk.magentaBright,
};

export function agentLabel(agentName: string): string {
  const colorFn = agentColors[agentName] ?? chalk.white;
  return colorFn(`[${agentName}]`);
}

export function printResult(result: string, agentName?: string): void {
  if (agentName) {
    console.log(`\n${agentLabel(agentName)} ${chalk.bold("Result:")}`);
  }
  console.log(result);
}

export function printCost(costUsd: number, durationMs: number): void {
  console.log(
    chalk.gray(
      `\nCost: $${costUsd.toFixed(4)} | Duration: ${(durationMs / 1000).toFixed(1)}s`
    )
  );
}

export function extractAssistantText(message: SDKMessage): string | null {
  if (message.type !== "assistant") return null;
  return message.message.content
    .filter((block: { type: string }) => block.type === "text")
    .map((block: { type: string; text?: string }) => block.text ?? "")
    .join("");
}
