const findFilesBy = require('./findFilesBy');
const runStylelintWithConfigFile = require('./runStylelintWithConfigFile');

const runStylelint = (root) => {
  const files = findFilesBy(root, '.stylelintrc.json');

  return files.reduce((acc, file) => {
    const { status, outcomes } = runStylelintWithConfigFile(file);

    return {
      status: acc.status + status,
      outcomes: acc.outcomes.concat(outcomes),
    };
  }, { status: 0, outcomes: [] });
};

module.exports = runStylelint;
