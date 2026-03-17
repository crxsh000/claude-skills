import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";
import type { AgentDefinition } from "@anthropic-ai/claude-agent-sdk";

export interface SkillMetadata {
  name: string;
  description: string;
}

/**
 * Parse YAML frontmatter from a SKILL.md file.
 * Handles simple key: value pairs between --- delimiters.
 */
function parseFrontmatter(content: string): {
  metadata: SkillMetadata;
  body: string;
} {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    return {
      metadata: { name: "unknown", description: "" },
      body: content,
    };
  }

  const [, frontmatter, body] = match;
  const metadata: SkillMetadata = { name: "unknown", description: "" };

  for (const line of frontmatter.split("\n")) {
    const nameMatch = line.match(/^name:\s*(.+)/);
    if (nameMatch) metadata.name = nameMatch[1].trim().replace(/^["']|["']$/g, "");

    const descMatch = line.match(/^description:\s*(.+)/);
    if (descMatch) metadata.description = descMatch[1].trim().replace(/^["']|["']$/g, "");
  }

  return { metadata, body: body.trim() };
}

/**
 * List all available skills in the skills directory.
 */
export async function listSkills(
  skillsDir: string
): Promise<SkillMetadata[]> {
  let entries: string[];
  try {
    entries = await readdir(skillsDir);
  } catch {
    return [];
  }

  const skills: SkillMetadata[] = [];

  for (const entry of entries) {
    const skillDir = join(skillsDir, entry);
    const skillFile = join(skillDir, "SKILL.md");

    try {
      const s = await stat(skillDir);
      if (!s.isDirectory()) continue;

      const content = await readFile(skillFile, "utf-8");
      const { metadata } = parseFrontmatter(content);
      if (metadata.name === "unknown") metadata.name = entry;
      skills.push(metadata);
    } catch {
      // Skip directories without SKILL.md
    }
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Load a skill's prompt content from its SKILL.md file.
 */
export async function loadSkillPrompt(
  skillName: string,
  skillsDir: string
): Promise<{ metadata: SkillMetadata; body: string }> {
  const skillFile = join(skillsDir, skillName, "SKILL.md");
  const content = await readFile(skillFile, "utf-8");
  const result = parseFrontmatter(content);
  if (result.metadata.name === "unknown") result.metadata.name = skillName;
  return result;
}

/**
 * Build an AgentDefinition from a loaded skill.
 */
export function buildSkillAgent(
  skillName: string,
  body: string,
  metadata: SkillMetadata
): AgentDefinition {
  return {
    description: metadata.description || `Agent executing the "${skillName}" skill`,
    tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "WebSearch", "WebFetch"],
    prompt: `You are a specialized agent executing the "${skillName}" skill.

## Skill Instructions

${body}

## Execution Guidelines
- Follow the skill instructions above precisely.
- Use available tools to accomplish the task.
- Report what you did and the results clearly.`,
    model: "inherit",
  };
}
