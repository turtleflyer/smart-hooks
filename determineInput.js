export default function determineInput(config) {
  const {
    files: [filename],
    compilerOptions: { outDir },
  } = config;

  return outDir.replace(/^(\.\/)?/, './').replace(/\/?$/, '/') + filename.replace(/tsx?/, 'js');
}
