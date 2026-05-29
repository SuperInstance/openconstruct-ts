/**
 * AgentIdentity interface for self-declaration
 */
export interface AgentIdentity {
  /** Name of the agent */
  name: string;
  /** Model identifier (e.g., 'claude-4', 'gpt-4') */
  model: string;
  /** List of capabilities the agent provides */
  capabilities: string[];
  /** List of tools the agent uses */
  tools: string[];
}

/**
 * Module information from the registry
 */
export interface ModuleInfo {
  /** Unique module identifier */
  id: string;
  /** Human-readable module name */
  name: string;
  /** Domain/category of the module */
  domain: string;
  /** Module description */
  description: string;
  /** Module version */
  version: string;
}

/**
 * Options for listing modules
 */
export interface ListModulesOptions {
  /** Filter by domain */
  domain?: string;
  /** Maximum number of results */
  limit?: number;
}

/**
 * Interface choice for the agent
 */
export interface InterfaceChoice {
  /** Interface type (e.g., 'cli', 'api', 'web') */
  type: string;
  /** Optional configuration for the interface */
  config?: Record<string, unknown>;
}

/**
 * Final onboarding configuration
 */
export interface OnboardingConfig {
  /** Unique session identifier */
  session_id: string;
  /** Agent identity declaration */
  agent: AgentIdentity;
  /** Selected modules */
  modules: string[];
  /** Chosen interfaces */
  interfaces: InterfaceChoice[];
  /** Timestamp of configuration generation */
  generated_at: string;
}

/**
 * Session state
 */
export interface SessionState {
  id: string;
  started_at: string;
  agent?: AgentIdentity;
  selected_modules?: string[];
  chosen_interfaces?: InterfaceChoice[];
}