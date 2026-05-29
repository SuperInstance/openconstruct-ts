import { describe, it, expect, beforeEach } from 'vitest';
import { OpenConstructClient } from '../src/client.js';
import type { AgentIdentity } from '../src/types.js';

describe('OpenConstructClient', () => {
  let client: OpenConstructClient;

  beforeEach(() => {
    client = new OpenConstructClient();
  });

  describe('start', () => {
    it('creates a session with a valid ID', () => {
      const sessionId = client.start();
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.startsWith('oc_')).toBe(true);
    });

    it('creates a session with started_at timestamp', () => {
      client.start();
      const session = client.getSession();
      expect(session).not.toBeNull();
      expect(session?.started_at).toBeDefined();
      expect(new Date(session!.started_at)).toBeInstanceOf(Date);
    });

    it('creates unique session IDs', () => {
      const id1 = client.start();
      client.reset();
      const id2 = client.start();
      expect(id1).not.toBe(id2);
    });
  });

  describe('declareAgent', () => {
    it('stores agent identity', () => {
      client.start();
      const identity: AgentIdentity = {
        name: 'test-agent',
        model: 'claude-4',
        capabilities: ['code_generation'],
        tools: ['exec']
      };
      client.declareAgent(identity);

      const session = client.getSession();
      expect(session?.agent).toEqual(identity);
    });

    it('throws when session not started', () => {
      const identity: AgentIdentity = {
        name: 'test-agent',
        model: 'claude-4',
        capabilities: [],
        tools: []
      };

      expect(() => {
        client.declareAgent(identity);
      }).toThrow('Session not started');
    });
  });

  describe('listModules', () => {
    it('returns array of modules', () => {
      client.start();
      const modules = client.listModules();
      expect(Array.isArray(modules)).toBe(true);
      expect(modules.length).toBeGreaterThan(0);
    });

    it('filters by domain', () => {
      client.start();
      const mathModules = client.listModules({ domain: 'math' });
      expect(mathModules.every(m => m.domain === 'math')).toBe(true);
    });

    it('respects limit option', () => {
      client.start();
      const limited = client.listModules({ limit: 2 });
      expect(limited.length).toBeLessThanOrEqual(2);
    });

    it('returns modules with expected structure', () => {
      client.start();
      const modules = client.listModules();
      const module = modules[0];

      expect(module).toHaveProperty('id');
      expect(module).toHaveProperty('name');
      expect(module).toHaveProperty('domain');
      expect(module).toHaveProperty('description');
      expect(module).toHaveProperty('version');
    });
  });

  describe('selectModules', () => {
    it('stores module selection', () => {
      client.start();
      client.selectModules(['spectral-graph-core']);

      const session = client.getSession();
      expect(session?.selected_modules).toEqual(['spectral-graph-core']);
    });

    it('throws when session not started', () => {
      expect(() => {
        client.selectModules(['spectral-graph-core']);
      }).toThrow('Session not started');
    });

    it('throws for non-existent module', () => {
      client.start();
      expect(() => {
        client.selectModules(['non-existent-module']);
      }).toThrow("Module 'non-existent-module' not found");
    });

    it('accepts multiple modules', () => {
      client.start();
      client.selectModules(['spectral-graph-core', 'plato-room']);

      const session = client.getSession();
      expect(session?.selected_modules).toEqual(['spectral-graph-core', 'plato-room']);
    });
  });

  describe('chooseInterface', () => {
    it('stores interface choices', () => {
      client.start();
      client.chooseInterface(['cli', 'api']);

      const session = client.getSession();
      expect(session?.chosen_interfaces).toEqual([
        { type: 'cli' },
        { type: 'api' }
      ]);
    });

    it('throws when session not started', () => {
      expect(() => {
        client.chooseInterface(['cli']);
      }).toThrow('Session not started');
    });
  });

  describe('generateConfig', () => {
    it('produces config object', () => {
      client.start();

      const identity: AgentIdentity = {
        name: 'test-agent',
        model: 'claude-4',
        capabilities: ['code_generation', 'web_search'],
        tools: ['exec', 'read', 'write']
      };
      client.declareAgent(identity);
      client.selectModules(['spectral-graph-core', 'plato-room']);
      client.chooseInterface(['cli', 'api']);

      const config = client.generateConfig();

      expect(config).toBeDefined();
      expect(config).toHaveProperty('session_id');
      expect(config).toHaveProperty('agent');
      expect(config).toHaveProperty('modules');
      expect(config).toHaveProperty('interfaces');
      expect(config).toHaveProperty('generated_at');
    });

    it('has required fields', () => {
      client.start();

      const identity: AgentIdentity = {
        name: 'test-agent',
        model: 'claude-4',
        capabilities: [],
        tools: []
      };
      client.declareAgent(identity);
      client.selectModules(['spectral-graph-core']);
      client.chooseInterface(['cli']);

      const config = client.generateConfig();

      expect(config.session_id).toBeDefined();
      expect(config.agent).toEqual(identity);
      expect(config.modules).toEqual(['spectral-graph-core']);
      expect(config.interfaces).toEqual([{ type: 'cli' }]);
    });

    it('throws when session not started', () => {
      expect(() => {
        client.generateConfig();
      }).toThrow('Session not started');
    });

    it('throws when agent not declared', () => {
      client.start();
      client.selectModules(['spectral-graph-core']);
      client.chooseInterface(['cli']);

      expect(() => {
        client.generateConfig();
      }).toThrow('Agent identity not declared');
    });

    it('throws when modules not selected', () => {
      client.start();
      const identity: AgentIdentity = {
        name: 'test-agent',
        model: 'claude-4',
        capabilities: [],
        tools: []
      };
      client.declareAgent(identity);
      client.chooseInterface(['cli']);

      expect(() => {
        client.generateConfig();
      }).toThrow('No modules selected');
    });

    it('throws when interfaces not chosen', () => {
      client.start();
      const identity: AgentIdentity = {
        name: 'test-agent',
        model: 'claude-4',
        capabilities: [],
        tools: []
      };
      client.declareAgent(identity);
      client.selectModules(['spectral-graph-core']);

      expect(() => {
        client.generateConfig();
      }).toThrow('No interfaces chosen');
    });

    it('includes generation timestamp', () => {
      client.start();

      const identity: AgentIdentity = {
        name: 'test-agent',
        model: 'claude-4',
        capabilities: [],
        tools: []
      };
      client.declareAgent(identity);
      client.selectModules(['spectral-graph-core']);
      client.chooseInterface(['cli']);

      const config = client.generateConfig();
      expect(config.generated_at).toBeDefined();
      expect(new Date(config.generated_at)).toBeInstanceOf(Date);
    });
  });

  describe('full lifecycle', () => {
    it('completes full onboarding flow', () => {
      // Start session
      const sessionId = client.start();
      expect(sessionId).toBeDefined();

      // Declare agent
      const identity: AgentIdentity = {
        name: 'my-agent',
        model: 'claude-4',
        capabilities: ['code_generation', 'web_search'],
        tools: ['exec', 'read', 'write']
      };
      client.declareAgent(identity);
      expect(client.getSession()?.agent).toEqual(identity);

      // List and select modules
      const modules = client.listModules({ domain: 'math' });
      expect(modules.length).toBeGreaterThan(0);

      const moduleIds = modules.slice(0, 2).map(m => m.id);
      client.selectModules(moduleIds);
      expect(client.getSession()?.selected_modules).toEqual(moduleIds);

      // Choose interfaces
      client.chooseInterface(['cli', 'api']);
      expect(client.getSession()?.chosen_interfaces).toHaveLength(2);

      // Generate config
      const config = client.generateConfig();
      expect(config.session_id).toBe(sessionId);
      expect(config.agent).toEqual(identity);
      expect(config.modules).toEqual(moduleIds);
      expect(config.interfaces).toHaveLength(2);
      expect(config.generated_at).toBeDefined();
    });
  });

  describe('getModule', () => {
    it('returns module by ID', () => {
      client.start();
      const module = client.getModule('spectral-graph-core');

      expect(module).toBeDefined();
      expect(module?.id).toBe('spectral-graph-core');
    });

    it('returns undefined for non-existent module', () => {
      client.start();
      const module = client.getModule('non-existent');

      expect(module).toBeUndefined();
    });
  });

  describe('getDomains', () => {
    it('returns array of domains', () => {
      client.start();
      const domains = client.getDomains();

      expect(Array.isArray(domains)).toBe(true);
      expect(domains.length).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('clears session state', () => {
      client.start();
      const identity: AgentIdentity = {
        name: 'test-agent',
        model: 'claude-4',
        capabilities: [],
        tools: []
      };
      client.declareAgent(identity);

      client.reset();
      expect(client.getSession()).toBeNull();
    });

    it('allows new session after reset', () => {
      client.start();
      client.reset();
      const sessionId = client.start();

      expect(sessionId).toBeDefined();
      expect(client.getSession()).not.toBeNull();
    });
  });
});