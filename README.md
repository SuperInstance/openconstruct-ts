# OpenConstruct

OpenConstruct thin client - onboard agents into the SuperInstance ecosystem.

## Installation

```bash
npm install openconstruct
```

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

## API

### OpenConstructClient

Main client class for onboarding.

#### `start(): string`
Start a new onboarding session. Returns the session ID.

#### `declareAgent(identity: AgentIdentity): void`
Declare the agent's identity.

#### `listModules(options?: ListModulesOptions): ModuleInfo[]`
List available modules, optionally filtered by domain.

#### `selectModules(moduleIds: string[]): void`
Select modules for the agent to use.

#### `chooseInterface(interfaceTypes: string[]): void`
Choose interface types for the agent.

#### `chooseInterfaces(interfaces: InterfaceChoice[]): void`
Choose interfaces with custom configurations.

#### `generateConfig(): OnboardingConfig`
Generate the final onboarding configuration.

### ModuleRegistry

Browse available modules by domain.

#### `list(options?: ListModulesOptions): ModuleInfo[]`
List available modules.

#### `get(id: string): ModuleInfo | undefined`
Get a specific module by ID.

#### `getDomains(): string[]`
Get all available domains.

## Types

```typescript
interface AgentIdentity {
  name: string;
  model: string;
  capabilities: string[];
  tools: string[];
}

interface OnboardingConfig {
  session_id: string;
  agent: AgentIdentity;
  modules: string[];
  interfaces: InterfaceChoice[];
  generated_at: string;
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## License

MIT