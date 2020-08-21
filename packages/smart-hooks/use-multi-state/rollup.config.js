import { rollupConfigFactory } from '../../../configuration/rollup-config-factory';

export default rollupConfigFactory({
  cjs: {
    external: ['@smart-hooks/helper-traverse-scheme-keys'],
  },
  umd: { name: 'useMultiState' },
});
