import '../test_helper';

import * as Promise from 'bluebird';
import * as assert from 'power-assert';
import * as Sinon from 'sinon';

import * as typhen from '../../src/index';
import * as plugin from '../../src/plugin';
import * as symbol from '../../src/symbol';
import * as logger from '../../src/logger';
import * as helpers from '../../src/helpers';

describe('typhen', () => {
  const sandbox = Sinon.sandbox.create();
  let logLevelCache: logger.LogLevel;

  before(() => {
    logLevelCache = logger.level;
    logger.setLevel(logger.LogLevel.Silent);
  });

  after(() => {
    logger.setLevel(logLevelCache);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('.SymbolKind', () => {
    it('should export SymbolKind', () => {
      assert(typhen.SymbolKind === symbol.SymbolKind);
    });
  });

  describe('.logger', () => {
    it('should export logger', () => {
      assert(typhen.logger === logger);
    });
  });

  describe('.helpers', () => {
    it('should export helpers', () => {
      assert(typhen.helpers === helpers);
    });
  });

  describe('.runByTSConfig', () => {
    beforeEach(() => {
      sandbox.stub(typhen, 'loadPlugin').returns(null);
      sandbox.stub(typhen, 'run').returns(Promise.resolve([]));
      typhen.runByTSConfig(process.cwd() + '/test/fixtures/tsconfig.json');
    });

    it('should call .loadPlugin with values in tsconfig.json', () => {
      assert((<Sinon.SinonStub>typhen.loadPlugin).calledOnce);
      assert((<Sinon.SinonStub>typhen.loadPlugin).args[0][0], 'test/fixtures/plugin/typhen-test');
    });

    it('should call .run with values in tsconfig.json', () => {
      assert((<Sinon.SinonStub>typhen.run).calledOnce);
      assert.deepEqual((<Sinon.SinonStub>typhen.run).args[0][0].src, ['typings/integration/index.d.ts']);
    });
  });

  describe('.parse', () => {
    it('should return a parsed result', () => {
      const result = typhen.parse(process.cwd() + '/test/fixtures/typings/ts_files/foo.ts');
      assert(result.types.length > 0);
      assert(result.modules.length > 0);
    });
  });

  describe('.createPlugin', () => {
    it('should create the instance of Plugin', () => {
      const response = typhen.createPlugin({
        pluginDirectory: 'templates',
        generate: function(types, generator) {}
      });
      assert(response instanceof plugin.Plugin);
    });
  });

  describe('.loadPlugin', () => {
    it('should load the specified instance of Plugin', () => {
      const response = typhen.loadPlugin('./test/fixtures/plugin/typhen-test');
      const expected = process.cwd() + '/test/fixtures/plugin';
      assert(response instanceof plugin.Plugin);
      assert(response.pluginDirectory === expected);
    });
  });
});
