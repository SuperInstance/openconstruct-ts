import type {
  AgentIdentity,
  InterfaceChoice,
  OnboardingConfig,
  SessionState
} from './types.js';
import { ModuleRegistry } from './registry.js';

/**
 * OpenConstructClient - main client class with phase flow for onboarding
 */
export class OpenConstructClient {
  private session: SessionState | null;
  private registry: ModuleRegistry;

  constructor() {
    this.session = null;
    this.registry = new ModuleRegistry();
  }

  /**
   * Start a new onboarding session
   * @returns The new session ID
   */
  start(): string {
    const sessionId = this.generateSessionId();
    this.session = {
      id: sessionId,
      started_at: new Date().toISOString()
    };
    return sessionId;
  }

  /**
   * Declare the agent's identity
   */
  declareAgent(identity: AgentIdentity): void {
    if (!this.session) {
      throw new Error('Session not started. Call start() first.');
    }
    this.session.agent = identity;
  }

  /**
   * List available modules
   */
  listModules(options?: { domain?: string; limit?: number }) {
    return this.registry.list(options);
  }

  /**
   * Get module information by ID
   */
  getModule(id: string) {
    return this.registry.get(id);
  }

  /**
   * Get all available domains
   */
  getDomains(): string[] {
    return this.registry.getDomains();
  }

  /**
   * Select modules for the agent to use
   */
  selectModules(moduleIds: string[]): void {
    if (!this.session) {
      throw new Error('Session not started. Call start() first.');
    }

    // Validate all modules exist
    for (const id of moduleIds) {
      if (!this.registry.has(id)) {
        throw new Error(`Module '${id}' not found in registry`);
      }
    }

    this.session.selected_modules = [...moduleIds];
  }

  /**
   * Choose interfaces for the agent
   */
  chooseInterface(interfaceTypes: string[]): void {
    if (!this.session) {
      throw new Error('Session not started. Call start() first.');
    }

    const interfaces: InterfaceChoice[] = interfaceTypes.map(type => ({
      type
    }));

    this.session.chosen_interfaces = interfaces;
  }

  /**
   * Choose interfaces with custom configurations
   */
  chooseInterfaces(interfaces: InterfaceChoice[]): void {
    if (!this.session) {
      throw new Error('Session not started. Call start() first.');
    }

    this.session.chosen_interfaces = [...interfaces];
  }

  /**
   * Generate the final onboarding configuration
   */
  generateConfig(): OnboardingConfig {
    if (!this.session) {
      throw new Error('Session not started. Call start() first.');
    }
    if (!this.session.agent) {
      throw new Error('Agent identity not declared. Call declareAgent() first.');
    }
    if (!this.session.selected_modules) {
      throw new Error('No modules selected. Call selectModules() first.');
    }
    if (!this.session.chosen_interfaces) {
      throw new Error('No interfaces chosen. Call chooseInterface() or chooseInterfaces() first.');
    }

    return {
      session_id: this.session.id,
      agent: this.session.agent,
      modules: this.session.selected_modules,
      interfaces: this.session.chosen_interfaces,
      generated_at: new Date().toISOString()
    };
  }

  /**
   * Get current session state
   */
  getSession(): SessionState | null {
    return this.session ? { ...this.session } : null;
  }

  /**
   * Reset the client for a new session
   */
  reset(): void {
    this.session = null;
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 11);
    return `oc_${timestamp}_${random}`;
  }
}