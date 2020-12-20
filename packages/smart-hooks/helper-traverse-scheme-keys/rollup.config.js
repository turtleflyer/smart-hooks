/* eslint-disable import/no-extraneous-dependencies */
import rollupConfigFactory from '@~internal/rollup-config-factory';

export default rollupConfigFactory({
  umd: { disable: true },
});
