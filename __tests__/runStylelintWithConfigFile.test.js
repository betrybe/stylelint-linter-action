jest.mock('child_process');

const { spawnSync } = require('child_process');
const stylelintResultWithError = require('./fixtures/stylelint-results/oneError.json');
const stylelintResultWithoutError = require('./fixtures/stylelint-results/noError.json');
const runStylelintWithConfigFile = require('../runStylelintWithConfigFile');

describe('Running stylelint', () => {
  test('When there is a stylelint config file to analyse and the analysis shows no issue, a success status is returned', () => {
    spawnSync.mockReturnValue({ status: 0, stdout: JSON.stringify(stylelintResultWithoutError) });

    const packageDirectory = '/path/to/project';
    const packageFile = `${packageDirectory}/.stylelintrc.json`;
    const receivedStatus = runStylelintWithConfigFile(packageFile);

    expect(receivedStatus).toStrictEqual({ status: 0, outcomes: stylelintResultWithoutError });
    expect(spawnSync).toHaveBeenCalledWith(
      'npx',
      [
        'stylelint',
        '**/*.css',
        '--config', '.stylelintrc.json',
        '--formatter', 'json',
        '--ignore-disables',
      ],
      { cwd: packageDirectory },
    );
  });

  test('When there is a stylelint config file to analyse but there is no css file to be analysed, a success status is returned', () => {
    const emptyStylelintResult = [];

    spawnSync.mockReturnValue({ status: 0, stdout: JSON.stringify(emptyStylelintResult) });

    const packageDirectory = '/path/to/project';
    const packageFile = `${packageDirectory}/.stylelintrc.json`;
    const receivedStatus = runStylelintWithConfigFile(packageFile);

    expect(receivedStatus).toStrictEqual({ status: 0, outcomes: emptyStylelintResult });
    expect(spawnSync).toHaveBeenCalledWith(
      'npx',
      [
        'stylelint',
        '**/*.css',
        '--config', '.stylelintrc.json',
        '--formatter', 'json',
        '--ignore-disables',
      ],
      { cwd: packageDirectory },
    );
  });

  test('When there is a stylelint config file to analyse and the analysis shows some issue, an error status is returned', () => {
    spawnSync.mockReturnValue({ status: 1, stdout: JSON.stringify(stylelintResultWithError) });

    const packageDirectory = '/path/to/project';
    const packageFile = `${packageDirectory}/.stylelintrc.json`;
    const receivedStatus = runStylelintWithConfigFile(packageFile);

    expect(receivedStatus).toStrictEqual({ status: 1, outcomes: stylelintResultWithError });
    expect(spawnSync).toHaveBeenCalledWith(
      'npx',
      [
        'stylelint',
        '**/*.css',
        '--config', '.stylelintrc.json',
        '--formatter', 'json',
        '--ignore-disables',
      ],
      { cwd: packageDirectory },
    );
  });
});
