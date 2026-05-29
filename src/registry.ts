import type { ModuleInfo, ListModulesOptions } from './types.js';

/**
 * ModuleRegistry - browse available modules by domain
 */
export class ModuleRegistry {
  private modules: Map<string, ModuleInfo>;

  constructor() {
    this.modules = new Map();
    this.initializeDefaultModules();
  }

  /**
   * Initialize with default modules (placeholder data)
   * In production, this would fetch from a remote registry
   */
  private initializeDefaultModules(): void {
    const defaultModules: ModuleInfo[] = [
      {
        id: 'spectral-graph-core',
        name: 'Spectral Graph Core',
        domain: 'math',
        description: 'Core spectral graph algorithms and utilities',
        version: '1.0.0'
      },
      {
        id: 'plato-room',
        name: 'Plato Room',
        domain: 'reasoning',
        description: 'Advanced reasoning and dialogue framework',
        version: '2.1.0'
      },
      {
        id: 'neural-bridge',
        name: 'Neural Bridge',
        domain: 'ml',
        description: 'Neural network integration layer',
        version: '0.9.0'
      },
      {
        id: 'data-pipeline',
        name: 'Data Pipeline',
        domain: 'data',
        description: 'Stream processing and transformation pipeline',
        version: '1.5.2'
      },
      {
        id: 'quantum-sim',
        name: 'Quantum Simulator',
        domain: 'math',
        description: 'Quantum circuit simulation library',
        version: '0.5.0'
      },
      {
        id: 'nlp-toolkit',
        name: 'NLP Toolkit',
        domain: 'nlp',
        description: 'Natural language processing utilities',
        version: '3.0.0'
      }
    ];

    defaultModules.forEach(mod => {
      this.modules.set(mod.id, mod);
    });
  }

  /**
   * List available modules, optionally filtered by domain
   */
  list(options: ListModulesOptions = {}): ModuleInfo[] {
    let result = Array.from(this.modules.values());

    if (options.domain) {
      result = result.filter(mod => mod.domain === options.domain);
    }

    if (options.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  /**
   * Get a specific module by ID
   */
  get(id: string): ModuleInfo | undefined {
    return this.modules.get(id);
  }

  /**
   * Check if a module exists
   */
  has(id: string): boolean {
    return this.modules.has(id);
  }

  /**
   * Get all available domains
   */
  getDomains(): string[] {
    const domains = new Set<string>();
    for (const mod of this.modules.values()) {
      domains.add(mod.domain);
    }
    return Array.from(domains).sort();
  }

  /**
   * Register a custom module
   */
  register(module: ModuleInfo): void {
    this.modules.set(module.id, module);
  }

  /**
   * Unregister a module
   */
  unregister(id: string): boolean {
    return this.modules.delete(id);
  }
}