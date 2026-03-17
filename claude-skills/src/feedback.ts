import { query, type Options } from "@anthropic-ai/claude-agent-sdk";
import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { AgentConfig } from "./config.js";
import { speakingCoach } from "./agents/speaking-coach.js";
import { getMcpServers } from "./mcp/servers.js";
import { extractAssistantText, printResult, printCost } from "./utils/output.js";
import * as log from "./utils/logger.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeedbackOptions {
  transcriptPath: string;
  videoLength?: string;
  bookTitle?: string;
  topic?: string;
  goalForVideo?: string;
  selfAssessment?: string;
}

interface Scorecard {
  clarity: number | null;
  structure: number | null;
  articulationVerbalPrecision: number | null;
  delivery: number | null;
  storytellingExamples: number | "N/A" | null;
  persuasionMeaningTakeaway: number | null;
  overall: number | null;
}

interface SessionRecord {
  version: "1.0.0";
  sessionId: string;
  timestamp: string;
  metadata: {
    transcriptFile: string;
    videoLength: string | null;
    bookTitle: string | null;
    topic: string | null;
    goalForVideo: string | null;
    selfAssessment: string | null;
  };
  scorecard: Scorecard;
  rawOutput: string;
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/**
 * Returns the absolute path to the sessions directory.
 * Uses import.meta.url so it resolves correctly regardless of CWD.
 * Location: <repo>/claude-agents/agents/speaking_coach/sessions/
 */
function getSessionsDir(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // __dirname is claude-agents/src/
  return join(__dirname, "..", "agents", "speaking_coach", "sessions");
}

// ---------------------------------------------------------------------------
// Session ID generation
// ---------------------------------------------------------------------------

async function generateSessionId(sessionsDir: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  let files: string[] = [];
  try {
    files = await readdir(sessionsDir);
  } catch {
    // directory doesn't exist yet — that's fine
  }

  const todayFiles = files.filter(
    (f) => f.startsWith(today) && f.endsWith(".json")
  );
  const maxN = todayFiles.reduce((max, f) => {
    const match = f.match(/\d{4}-\d{2}-\d{2}-(\d{3})\.json$/);
    if (!match) return max;
    return Math.max(max, parseInt(match[1], 10));
  }, 0);

  const next = String(maxN + 1).padStart(3, "0");
  return `${today}-${next}`;
}

// ---------------------------------------------------------------------------
// Session loading
// ---------------------------------------------------------------------------

async function loadRecentSessions(
  sessionsDir: string,
  count = 3
): Promise<SessionRecord[]> {
  let files: string[] = [];
  try {
    files = await readdir(sessionsDir);
  } catch {
    return [];
  }

  const jsonFiles = files
    .filter((f) => f.endsWith(".json") && !f.startsWith("."))
    .sort() // lexicographic = chronological for YYYY-MM-DD-NNN format
    .slice(-count)
    .reverse(); // most recent first

  const sessions: SessionRecord[] = [];
  for (const file of jsonFiles) {
    try {
      const raw = await readFile(join(sessionsDir, file), "utf-8");
      sessions.push(JSON.parse(raw) as SessionRecord);
    } catch {
      // skip corrupt files silently
    }
  }

  return sessions;
}

// ---------------------------------------------------------------------------
// Prompt assembly
// ---------------------------------------------------------------------------

function buildPastSessionsBlock(sessions: SessionRecord[]): string {
  if (sessions.length === 0) {
    return "No prior sessions found. This is the first session — no trend data available yet.";
  }

  const lines = sessions.map((s, i) => {
    const sc = s.scorecard;
    const label = i === 0 ? "Most Recent" : `${i + 1} Sessions Ago`;
    const scores = [
      `Clarity ${sc.clarity ?? "?"}`,
      `Structure ${sc.structure ?? "?"}`,
      `Articulation ${sc.articulationVerbalPrecision ?? "?"}`,
      `Delivery ${sc.delivery ?? "?"}`,
      `Storytelling ${sc.storytellingExamples ?? "?"}`,
      `Persuasion ${sc.persuasionMeaningTakeaway ?? "?"}`,
      `Overall ${sc.overall ?? "?"}`,
    ].join(" | ");

    return [
      `### ${label} (${s.sessionId})`,
      `Book: ${s.metadata.bookTitle ?? "not specified"}`,
      `Topic: ${s.metadata.topic ?? "not specified"}`,
      `Scores: ${scores}`,
    ].join("\n");
  });

  return [
    "Here are the speaker's most recent sessions for trend analysis:",
    "",
    ...lines,
    "",
    "When reviewing these scores, comment on trajectory in the Overall Assessment.",
    "If a category has improved, acknowledge it. If a category is stuck or declining, call it out explicitly.",
  ].join("\n");
}

function buildUserPrompt(
  transcriptContent: string,
  opts: FeedbackOptions,
  pastSessionsBlock: string
): string {
  const parts: string[] = [];

  // Metadata
  const hasMetadata =
    opts.videoLength ||
    opts.bookTitle ||
    opts.topic ||
    opts.goalForVideo ||
    opts.selfAssessment;

  if (hasMetadata) {
    parts.push("## Video Context");
    if (opts.videoLength) parts.push(`Video Length: ${opts.videoLength}`);
    if (opts.bookTitle) parts.push(`Book Being Discussed: ${opts.bookTitle}`);
    if (opts.topic) parts.push(`Topic / Trigger: ${opts.topic}`);
    if (opts.goalForVideo) parts.push(`Goal for This Video: ${opts.goalForVideo}`);
    if (opts.selfAssessment)
      parts.push(`Speaker's Self-Assessment: ${opts.selfAssessment}`);
    parts.push("");
  }

  // Past sessions
  parts.push("## Session History");
  parts.push(pastSessionsBlock);
  parts.push("");

  // Transcript
  parts.push("## Transcript");
  parts.push("<transcript>");
  parts.push(transcriptContent.trim());
  parts.push("</transcript>");
  parts.push("");
  parts.push(
    "Please provide your full speaking coach feedback using the exact output format specified in your system prompt."
  );

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Scorecard parsing
// ---------------------------------------------------------------------------

function parseScorecard(output: string): Scorecard {
  const extract = (label: string): number | "N/A" | null => {
    // Matches: "- Clarity: 7" or "- Storytelling / Examples: N/A"
    const escaped = label.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");
    const pattern = new RegExp(`-\\s*${escaped}\\s*:\\s*(\\d+|N\\/A)`, "i");
    const match = output.match(pattern);
    if (!match) return null;
    if (match[1] === "N/A") return "N/A";
    return parseInt(match[1], 10);
  };

  const clarity = extract("Clarity") as number | null;
  const structure = extract("Structure") as number | null;
  const articulation = extract("Articulation / Verbal Precision") as number | null;
  const delivery = extract("Delivery") as number | null;
  const storytelling = extract("Storytelling / Examples");
  const persuasion = extract("Persuasion / Meaning / Takeaway") as number | null;

  // Compute overall as average of numeric scores only
  const numericScores = [clarity, structure, articulation, delivery, persuasion].filter(
    (s): s is number => typeof s === "number"
  );
  if (typeof storytelling === "number") numericScores.push(storytelling);

  const overall =
    numericScores.length > 0
      ? parseFloat(
          (numericScores.reduce((a, b) => a + b, 0) / numericScores.length).toFixed(1)
        )
      : null;

  return {
    clarity,
    structure,
    articulationVerbalPrecision: articulation,
    delivery,
    storytellingExamples: storytelling,
    persuasionMeaningTakeaway: persuasion,
    overall,
  };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function runFeedback(
  opts: FeedbackOptions,
  config: AgentConfig,
  mcpServerNames?: string[]
): Promise<void> {
  const sessionsDir = getSessionsDir();

  // 1. Read transcript
  const transcriptPath = resolve(opts.transcriptPath);
  let transcriptContent: string;
  try {
    transcriptContent = await readFile(transcriptPath, "utf-8");
  } catch {
    log.error(`Cannot read transcript file: ${transcriptPath}`);
    process.exit(1);
  }

  // 2. Load past sessions for trend context
  const pastSessions = await loadRecentSessions(sessionsDir, 3);
  const pastSessionsBlock = buildPastSessionsBlock(pastSessions);

  // 3. Build enriched user prompt
  const userPrompt = buildUserPrompt(transcriptContent, opts, pastSessionsBlock);

  // 4. Pre-generate session ID
  const sessionId = await generateSessionId(sessionsDir);

  // 5. Run the agent
  const mcpServers = config.enableMcp ? getMcpServers(mcpServerNames) : {};

  const options: Options = {
    allowedTools: speakingCoach.tools,
    cwd: config.cwd,
    maxBudgetUsd: config.maxBudgetUsd,
    model: config.model,
    mcpServers,
    permissionMode: "acceptEdits",
    systemPrompt: speakingCoach.prompt,
  };

  log.debug("Starting speaking-coach with model:", config.model);

  const q = query({ prompt: userPrompt, options });
  let resultText = "";
  let costUsd = 0;
  let durationMs = 0;

  for await (const message of q) {
    const text = extractAssistantText(message);
    if (text && config.verbose) {
      process.stdout.write(text);
    }

    if (message.type === "result") {
      if (message.subtype === "success") {
        resultText = message.result;
        costUsd = message.total_cost_usd;
        durationMs = message.duration_ms;
      } else {
        log.error("Feedback agent failed:", message.errors);
        costUsd = message.total_cost_usd;
        durationMs = message.duration_ms;
      }
    }
  }

  if (!resultText) {
    log.error("No output from feedback agent.");
    printCost(costUsd, durationMs);
    process.exit(1);
  }

  // 6. Parse scorecard
  const scorecard = parseScorecard(resultText);

  // 7. Save session
  const session: SessionRecord = {
    version: "1.0.0",
    sessionId,
    timestamp: new Date().toISOString(),
    metadata: {
      transcriptFile: transcriptPath,
      videoLength: opts.videoLength ?? null,
      bookTitle: opts.bookTitle ?? null,
      topic: opts.topic ?? null,
      goalForVideo: opts.goalForVideo ?? null,
      selfAssessment: opts.selfAssessment ?? null,
    },
    scorecard,
    rawOutput: resultText,
  };

  try {
    await mkdir(sessionsDir, { recursive: true });
    await writeFile(
      join(sessionsDir, `${sessionId}.json`),
      JSON.stringify(session, null, 2),
      "utf-8"
    );
    log.debug(`Session saved: ${sessionId}`);
  } catch (err) {
    log.warn(
      "Could not save session:",
      err instanceof Error ? err.message : String(err)
    );
  }

  // 8. Print result
  printResult(resultText, "speaking-coach");
  printCost(costUsd, durationMs);
}
