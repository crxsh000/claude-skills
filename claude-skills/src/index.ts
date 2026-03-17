#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { buildConfig } from "./config.js";
import { runRouter, runDirect } from "./router.js";
import { runCouncil } from "./council.js";
import { runSkill } from "./agents/skills-agent.js";
import { listSkills } from "./skills/loader.js";
import { setVerbose } from "./utils/logger.js";
import { mcpServerRegistry } from "./mcp/servers.js";
import * as log from "./utils/logger.js";
import { runFeedback, type FeedbackOptions } from "./feedback.js";

const program = new Command();

program
  .name("agents")
  .description("Multi-agent CLI powered by Claude Agent SDK")
  .version("1.0.0");

// Shared options
function addCommonOptions(cmd: Command): Command {
  return cmd
    .option("--budget <usd>", "Max budget in USD", "5")
    .option("--verbose", "Show streaming output from agents", false)
    .option("--no-mcp", "Disable MCP server connections")
    .option(
      "--mcp <servers...>",
      "MCP servers to enable (e.g., playwright github)"
    )
    .option("--model <model>", "Claude model to use");
}

interface CommonOpts {
  budget: string;
  verbose: boolean;
  mcp: string[] | boolean;
  model?: string;
}

function getConfig(opts: CommonOpts) {
  if (opts.verbose) setVerbose(true);

  return buildConfig({
    maxBudgetUsd: parseFloat(opts.budget),
    verbose: opts.verbose,
    enableMcp: opts.mcp !== false,
    model: opts.model,
  });
}

function getMcpNames(opts: CommonOpts): string[] | undefined {
  if (Array.isArray(opts.mcp)) return opts.mcp;
  return undefined;
}

// --- Original Commands ---

addCommonOptions(
  program
    .command("run")
    .description("Send a task to the router agent for automatic dispatch")
    .argument("<prompt...>", "The task description")
).action(async (promptParts: string[], opts: CommonOpts) => {
  const prompt = promptParts.join(" ");
  const config = getConfig(opts);
  await runRouter(prompt, config, getMcpNames(opts));
});

addCommonOptions(
  program
    .command("code")
    .description("Send a task directly to the code analyst")
    .argument("<prompt...>", "The task description")
).action(async (promptParts: string[], opts: CommonOpts) => {
  const prompt = promptParts.join(" ");
  const config = getConfig(opts);
  await runDirect("code-analyst", prompt, config, getMcpNames(opts));
});

addCommonOptions(
  program
    .command("research")
    .description("Send a task directly to the research agent")
    .argument("<prompt...>", "The task description")
).action(async (promptParts: string[], opts: CommonOpts) => {
  const prompt = promptParts.join(" ");
  const config = getConfig(opts);
  await runDirect("researcher", prompt, config, getMcpNames(opts));
});

addCommonOptions(
  program
    .command("devops")
    .description("Send a task directly to the devops agent")
    .argument("<prompt...>", "The task description")
).action(async (promptParts: string[], opts: CommonOpts) => {
  const prompt = promptParts.join(" ");
  const config = getConfig(opts);
  await runDirect("devops", prompt, config, getMcpNames(opts));
});

// --- Review & Security Commands ---

addCommonOptions(
  program
    .command("review")
    .description("Run a comprehensive code quality review")
    .argument("<prompt...>", "What to review (e.g., 'review the entire project')")
).action(async (promptParts: string[], opts: CommonOpts) => {
  const prompt = promptParts.join(" ");
  const config = getConfig(opts);
  await runDirect("code-reviewer", prompt, config, getMcpNames(opts));
});

addCommonOptions(
  program
    .command("security")
    .description("Run a security audit (read-only vulnerability scan)")
    .argument("<prompt...>", "What to audit (e.g., 'scan for hardcoded secrets')")
).action(async (promptParts: string[], opts: CommonOpts) => {
  const prompt = promptParts.join(" ");
  const config = getConfig(opts);
  await runDirect("security-auditor", prompt, config, getMcpNames(opts));
});

// --- Feedback Command ---

interface FeedbackOpts extends CommonOpts {
  transcript: string;
  videoLength?: string;
  book?: string;
  topic?: string;
  goal?: string;
  selfAssessment?: string;
}

addCommonOptions(
  program
    .command("feedback")
    .description(
      "Get honest speaking coach feedback on a video transcript (articulation, clarity, structure, delivery)"
    )
    .requiredOption("--transcript <path>", "Path to the transcript .txt file")
    .option("--video-length <duration>", "Video length, e.g. '4:32'")
    .option("--book <title>", "Book or manga title being discussed")
    .option("--topic <text>", "Topic or trigger for the video")
    .option("--goal <text>", "Goal for this video, e.g. 'make one clear point'")
    .option(
      "--self-assessment <text>",
      "Your own read on how the video went"
    )
).action(async (opts: FeedbackOpts) => {
  const config = getConfig(opts);
  const feedbackOpts: FeedbackOptions = {
    transcriptPath: opts.transcript,
    videoLength: opts.videoLength,
    bookTitle: opts.book,
    topic: opts.topic,
    goalForVideo: opts.goal,
    selfAssessment: opts.selfAssessment,
  };
  await runFeedback(feedbackOpts, config, getMcpNames(opts));
});

// --- Council Commands ---

addCommonOptions(
  program
    .command("council")
    .description(
      "Convene a council of expert agents for comprehensive planning"
    )
    .argument(
      "<domain>",
      "Council domain: personal, business, education, marketing, mindset, or all"
    )
    .argument("<prompt...>", "The situation or goal to get advice on")
).action(async (domain: string, promptParts: string[], opts: CommonOpts) => {
  const validDomains = ["personal", "business", "education", "marketing", "mindset", "all"];
  if (!validDomains.includes(domain)) {
    log.error(
      `Invalid domain: "${domain}". Use: ${validDomains.join(", ")}`
    );
    process.exit(1);
  }
  const prompt = promptParts.join(" ");
  const config = getConfig(opts);
  await runCouncil(
    domain as "personal" | "business" | "education" | "marketing" | "mindset" | "all",
    prompt,
    config,
    getMcpNames(opts)
  );
});

// --- Skills Commands ---

addCommonOptions(
  program
    .command("skill")
    .description("Run a task using a specific Anthropic skill")
    .argument("<skill>", "Skill name (e.g., pdf, docx, webapp-testing)")
    .argument("<prompt...>", "The task description")
).action(
  async (skillName: string, promptParts: string[], opts: CommonOpts) => {
    const prompt = promptParts.join(" ");
    const config = getConfig(opts);
    try {
      await runSkill(skillName, prompt, config, getMcpNames(opts));
    } catch (err) {
      log.error(
        `Failed to load skill "${skillName}". Make sure the skills directory exists and contains the skill.`
      );
      log.error(`Skills directory: ${config.skillsDir}`);
      if (err instanceof Error) log.error(err.message);
      process.exit(1);
    }
  }
);

program
  .command("skills")
  .description("List available skills from the skills directory")
  .action(async () => {
    const config = buildConfig();
    const skills = await listSkills(config.skillsDir);

    if (skills.length === 0) {
      console.log(chalk.yellow("\nNo skills found."));
      console.log(
        `Skills directory: ${chalk.cyan(config.skillsDir)}`
      );
      console.log(
        `\nTo add skills, clone the Anthropic skills repo:`
      );
      console.log(
        chalk.gray(
          `  git clone https://github.com/anthropics/skills.git ${config.skillsDir}`
        )
      );
      return;
    }

    console.log(chalk.bold(`\nAvailable Skills (${skills.length}):`));
    for (const skill of skills) {
      console.log(
        `  ${chalk.cyan(skill.name)}${skill.description ? ` - ${skill.description}` : ""}`
      );
    }
    console.log(
      `\nUsage: ${chalk.yellow("agents skill <name> <prompt>")}`
    );
  });

// --- Config Command ---

program
  .command("config")
  .description("Show current configuration and available MCP servers")
  .action(() => {
    const config = buildConfig();
    console.log(chalk.bold("\nCurrent Configuration:"));
    console.log(`  Model:      ${config.model}`);
    console.log(`  Budget:     $${config.maxBudgetUsd}`);
    console.log(`  MCP:        ${config.enableMcp ? "enabled" : "disabled"}`);
    console.log(`  Skills Dir: ${config.skillsDir}`);
    console.log(`  CWD:        ${config.cwd}`);

    console.log(chalk.bold("\nAvailable MCP Servers:"));
    for (const [name, server] of Object.entries(mcpServerRegistry)) {
      const type = "type" in server ? server.type : "stdio";
      console.log(`  ${chalk.cyan(name)} (${type})`);
    }

    console.log(chalk.bold("\nCouncil Domains:"));
    console.log(`  ${chalk.cyan("personal")}  - Life coaching, health, relationships, beliefs`);
    console.log(`  ${chalk.cyan("business")}  - Strategy, marketing, operations`);
    console.log(`  ${chalk.cyan("education")} - Academic advising, study coaching, research`);
    console.log(`  ${chalk.cyan("marketing")} - Instagram outreach, DMs, sales tactics`);
    console.log(`  ${chalk.cyan("mindset")}   - 8-agent belief council for leveling up`);
    console.log(`  ${chalk.cyan("all")}       - All council agents combined`);

    console.log(
      `\nUse ${chalk.yellow("--mcp <name>")} to enable specific servers.`
    );
  });

program.parse();
