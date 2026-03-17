import type { McpServerConfig } from "@anthropic-ai/claude-agent-sdk";

/**
 * Registry of available MCP servers.
 * Add new servers here or load them from a config file.
 */
export const mcpServerRegistry: Record<string, McpServerConfig> = {
  playwright: {
    type: "stdio",
    command: "npx",
    args: ["@playwright/mcp@latest"],
  },
  filesystem: {
    type: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", process.cwd()],
  },
  github: {
    type: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN:
        process.env.GITHUB_TOKEN ?? "",
    },
  },
};

/**
 * Get MCP server configs for the given server names.
 * If no names provided, returns an empty object.
 */
export function getMcpServers(
  serverNames?: string[]
): Record<string, McpServerConfig> {
  if (!serverNames || serverNames.length === 0) return {};

  const servers: Record<string, McpServerConfig> = {};
  for (const name of serverNames) {
    const server = mcpServerRegistry[name];
    if (server) {
      servers[name] = server;
    } else {
      console.warn(
        `MCP server "${name}" not found in registry. Available: ${Object.keys(mcpServerRegistry).join(", ")}`
      );
    }
  }
  return servers;
}
