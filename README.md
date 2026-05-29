# OpenConstruct TypeScript — Node.js Agent Onboarding

TypeScript client for [OpenConstruct](https://github.com/SuperInstance/OpenConstruct). Onboard agents into the SuperInstance ecosystem from any Node.js or edge runtime.

## What This Gives You

- **5-phase onboarding** — `start()` → `declareAgent()` → `selectModules()` → `chooseInterface()` → `generateConfig()`
- **Full type safety** — `AgentIdentity`, `ModuleInfo`, `OnboardingConfig`, `InterfaceChoice` interfaces
- **Module registry** — domain-filtered catalog
- **Dual interface selection** — choose one or multiple interface types with custom configs

## Quick Start

```typescript
import { OpenConstructClient, AgentIdentity } from 'openconstruct';

const client = new OpenConstructClient();
client.start();

const identity: AgentIdentity = {
  name: 'my-agent',
  model: 'claude-4',
  capabilities: ['code_generation', 'web_search'],
  tools: ['exec', 'read', 'write']
};
client.declareAgent(identity);

const modules = client.listModules({ domain: 'math' });
client.selectModules(['spectral-graph-core', 'plato-room']);
client.chooseInterface(['cli', 'api']);

const config = client.generateConfig();
console.log(config);
```

## Installation

```bash
npm install openconstruct
```

## Testing

```bash
npm test
```

## License

MIT
