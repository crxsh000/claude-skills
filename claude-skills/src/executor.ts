import { query, type Options } from "@anthropic-ai/claude-agent-sdk";
import type { AgentConfig } from "./config.js";
import { extractAssistantText, printCost, printResult } from "./utils/output.js";
import * as log from "./utils/logger.js";

/**
 * Shared query execution loop used by router, council, and skill runners.
 * Handles streaming, result extraction, and cost display.
 */
export async function executeQuery(
  prompt: string,
  options: Options,
  config: AgentConfig,
  label: string
): Promise<void> {
  const q = query({ prompt, options });
  let resultText = "";
  let costUsd = 0;
  let durationMs = 0;

  for await (const message of q) {
    const text = extractAssistantText(message);
    if (text) {
      if (config.verbose) {
        process.stdout.write(text);
      }
    }

    if (message.type === "result") {
      if (message.subtype === "success") {
        resultText = message.result;
        costUsd = message.total_cost_usd;
        durationMs = message.duration_ms;
      } else {
        log.error("Execution failed:", message.errors);
        costUsd = message.total_cost_usd;
        durationMs = message.duration_ms;
      }
    }
  }

  if (resultText) {
    printResult(resultText, label);
  }
  printCost(costUsd, durationMs);
}
