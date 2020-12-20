/* eslint-disable import/no-extraneous-dependencies */
import rollupConfigFactory from '@~internal/rollup-config-factory';

const esmAndCjsConfig = {
  external: ['@smart-hooks/helper-traverse-scheme-keys'],
};

export default rollupConfigFactory({
  esm: esmAndCjsConfig,
  cjs: esmAndCjsConfig,
  umd: { name: 'useMultiState' },
});
