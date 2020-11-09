const { spawnSync } = require('child_process');
const path = require('path');
const logProcessConclusion = require('./logProcessConclusion');

const runEslintWithConfigFile = (file) => {
  console.log('-- found:', file);

  const eslintProcess = spawnSync(
    'npx',
    [
      'eslint',
      '-f', 'json',
      '--no-inline-config',
      '--ext', '.js, .jsx',
      '--no-error-on-unmatched-pattern',
      '-c', path.basename(file),
      '.',
    ],
    { cwd: path.dirname(file) },
  );
  const outcomes = JSON.parse(eslintProcess.stdout);

  logProcessConclusion(eslintProcess);

  return { status: eslintProcess.status , outcomes };
};

module.exports = runEslintWithConfigFile;
