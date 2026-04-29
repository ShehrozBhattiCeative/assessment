# Hooks Configuration

Hooks run automatically before/after Claude Code tool calls. Configure them in `.claude/settings.json`.

## Available Hook Events
- `PreToolUse` — runs before a tool call
- `PostToolUse` — runs after a tool call
- `Stop` — runs when Claude finishes a response

## Current Hooks (add to settings.json to activate)

### Type-check after file edits
Runs TypeScript compiler after any `.ts` or `.tsx` file is edited to catch type errors immediately.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "cd nexusai-frontend && npx tsc --noEmit --skipLibCheck 2>&1 | tail -5"
          }
        ]
      }
    ]
  }
}
```

### Lint after frontend edits
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "cd nexusai-frontend && npm run lint -- --max-warnings 0 2>&1 | tail -10"
          }
        ]
      }
    ]
  }
}
```

### Notify when done
Shows a notification when Claude finishes a long task.
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Claude finished task'"
          }
        ]
      }
    ]
  }
}
```

## How to Activate a Hook
Add the hook config to `.claude/settings.json` under the `"hooks"` key.

## NexusAI Recommended Hooks
For active development, enable the type-check hook to catch `'use client'` missing errors
and CSS variable violations early.
