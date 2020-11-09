const { spawnSync } = require('child_process');
const path = require('path');
const logProcessConclusion = require('./logProcessConclusion');

const runNpmOnFile = (file) => {
  console.log('-- found:', file);

  const npmProcess = spawnSync(
    'npm',
    ['ci'],
    { cwd: path.dirname(file) },
  );

  logProcessConclusion(npmProcess);

  return npmProcess.status;
};

module.exports = runNpmOnFile;
