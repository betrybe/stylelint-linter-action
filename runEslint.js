const findFilesBy = require('./findFilesBy');
const runEslintWithConfigFile = require('./runEslintWithConfigFile');

const runEslint = (root) => {
  const files = findFilesBy(root, '.eslintrc.json');

  return files.reduce((acc, file) => {
    const { status, outcomes } = runEslintWithConfigFile(file);

    return {
      status: acc.status + status,
      outcomes: acc.outcomes.concat(outcomes),
    };
  }, { status: 0, outcomes: [] });
};

module.exports = runEslint;
