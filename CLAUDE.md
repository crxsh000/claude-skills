# n8n Workflow Builder

This project uses Claude Code with the n8n-mcp server and n8n-skills to build high-quality n8n workflows for the Parallax Agency n8n cloud instance.

## Instance Details

- **URL:** https://parallaxagency.app.n8n.cloud
- **Connection:** Via n8n-mcp MCP server

## Available MCP Tools

### Documentation Tools (always available)
| Tool | Purpose |
|------|---------|
| `tools_documentation` | Get guidance on any MCP tool |
| `search_nodes` | Search 1,084 nodes (core + community) |
| `get_node` | Get node info, docs, properties, versions |
| `validate_node` | Validate node configuration |
| `validate_workflow` | Validate complete workflows |
| `search_templates` | Find workflow templates (2,709 available) |
| `get_template` | Retrieve template JSON |

### Workflow Management Tools (requires API)
| Tool | Purpose |
|------|---------|
| `n8n_health_check` | Verify API connection |
| `n8n_list_workflows` | List all workflows |
| `n8n_get_workflow` | Get workflow details |
| `n8n_create_workflow` | Create new workflow |
| `n8n_update_full_workflow` | Replace entire workflow |
| `n8n_update_partial_workflow` | Diff-based updates |
| `n8n_delete_workflow` | Delete workflow |
| `n8n_validate_workflow` | Server-side validation |
| `n8n_autofix_workflow` | Auto-fix errors |
| `n8n_workflow_versions` | Version management |
| `n8n_deploy_template` | Import from template gallery |
| `n8n_test_workflow` | Execute workflow |
| `n8n_executions` | View execution history |

## Workflow Building Process

### 1. Research Phase
```
1. Use search_nodes to find relevant nodes
2. Use get_node to understand node configuration
3. Use search_templates to find similar workflows
```

### 2. Design Phase
```
1. Plan workflow structure
2. Identify trigger type (webhook, schedule, manual)
3. Map data flow between nodes
```

### 3. Build Phase
```
1. Use validate_node for each node config
2. Use validate_workflow before creation
3. Use n8n_create_workflow to deploy
```

### 4. Test Phase
```
1. Use n8n_test_workflow to execute
2. Use n8n_executions to check results
3. Use n8n_autofix_workflow if needed
```

## Safety Guidelines

- **Never edit production workflows directly** - always copy first
- **Always validate before creating** - use validate_workflow
- **Test in isolation** - use test workflows before deploying
- **Export backups** - before major changes

## Expression Syntax Quick Reference

```javascript
// Access input data
{{ $json.fieldName }}
{{ $json["field-with-dashes"] }}

// Access previous node output
{{ $node["NodeName"].json.field }}

// Built-in variables
{{ $now }}              // Current timestamp
{{ $today }}            // Today's date
{{ $env.VARIABLE }}     // Environment variable
{{ $execution.id }}     // Current execution ID
{{ $workflow.id }}      // Current workflow ID

// Array operations
{{ $json.items.length }}
{{ $json.items[0].name }}

// Conditional
{{ $json.status === "active" ? "Yes" : "No" }}
```

## Common Workflow Patterns

### Webhook Trigger
Start workflows from external HTTP requests.

### Schedule Trigger
Run workflows on a cron schedule.

### Error Handling
Use Error Trigger node to catch failures.

### Data Transformation
Use Set, Code, or Function nodes to transform data.

### Conditional Logic
Use IF or Switch nodes for branching.

### Looping
Use SplitInBatches for processing arrays.

## Code Node Tips

### JavaScript
```javascript
// Access all input items
const items = $input.all();

// Return data
return items.map(item => ({
  json: {
    ...item.json,
    processed: true
  }
}));
```

### Python (no external libraries)
```python
# Access input
items = _input.all()

# Return data
return [{"json": {**item.json, "processed": True}} for item in items]
```

## Installed Skills

The following skills are available (install via `/install czlonkowski/n8n-skills`):

1. **n8n Expression Syntax** - Correct `{{}}` syntax
2. **n8n MCP Tools Expert** - Effective MCP tool usage
3. **n8n Workflow Patterns** - Architectural patterns
4. **n8n Validation Expert** - Fix validation errors
5. **n8n Node Configuration** - Node setup guidance
6. **n8n Code JavaScript** - JS Code node patterns
7. **n8n Code Python** - Python Code node patterns
