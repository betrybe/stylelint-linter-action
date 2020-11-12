const { spawnSync } = require('child_process');
const path = require('path');
const logProcessConclusion = require('./logProcessConclusion');

const runStylelintWithConfigFile = (file) => {
  console.log('-- found:', file);

  const stylelintProcess = spawnSync(
    'npx',
    [
      'stylelint',
      '**/*.css',
      '--config', path.basename(file),
      '--formatter', 'json',
      '--ignore-disables',
      '--allow-empty-input',
    ],
    { cwd: path.dirname(file) },
  );
  const outcomes = JSON.parse(stylelintProcess.stdout);

  logProcessConclusion(stylelintProcess);

  return { status: stylelintProcess.status , outcomes };
};

module.exports = runStylelintWithConfigFile;
