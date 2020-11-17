const findFilesBy = require('./findFilesBy');
const runNpmOnFile = require('./runNpmOnFile');

const runNpm = (root) => {
  const files = findFilesBy(root, 'package.json');

  return files.reduce((executionStatus, file) => executionStatus + runNpmOnFile(file), 0);
};

module.exports = runNpm;
