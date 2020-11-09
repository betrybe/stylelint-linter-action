jest.mock('child_process');

const { spawnSync } = require('child_process');
const eslintResultWithError = require('./fixtures/eslint-results/oneError.json');
const eslintResultWithoutError = require('./fixtures/eslint-results/frontEndNoError.json');
const runEslintWithConfigFile = require('../runEslintWithConfigFile');

describe('Running eslint', () => {
  test('When there is an eslint config file to analyse and the analysis shows no issue, a success status is returned', () => {
    spawnSync.mockReturnValue({ status: 0, stdout: JSON.stringify(eslintResultWithoutError) });

    const packageDirectory = '/path/to/project';
    const packageFile = `${packageDirectory}/.eslintrc.json`;
    const receivedStatus = runEslintWithConfigFile(packageFile);

    expect(receivedStatus).toStrictEqual({ status: 0, outcomes: eslintResultWithoutError });
    expect(spawnSync).toHaveBeenCalledWith(
      'npx',
      [
        'eslint',
        '-f', 'json',
        '--no-inline-config',
        '--ext', '.js, .jsx',
        '--no-error-on-unmatched-pattern',
        '-c', '.eslintrc.json',
        '.'
      ],
      { cwd: packageDirectory },
    );
  });

  test('When there is an eslint config file to analyse but there is no js file to be analysed, a success status is returned', () => {
    const emptyEslintResult = [];

    spawnSync.mockReturnValue({ status: 0, stdout: JSON.stringify(emptyEslintResult) });

    const packageDirectory = '/path/to/project';
    const packageFile = `${packageDirectory}/.eslintrc.json`;
    const receivedStatus = runEslintWithConfigFile(packageFile);

    expect(receivedStatus).toStrictEqual({ status: 0, outcomes: emptyEslintResult });
    expect(spawnSync).toHaveBeenCalledWith(
      'npx',
      [
        'eslint',
        '-f', 'json',
        '--no-inline-config',
        '--ext', '.js, .jsx',
        '--no-error-on-unmatched-pattern',
        '-c', '.eslintrc.json',
        '.'
      ],
      { cwd: packageDirectory },
    );
  });

  test('When there is an eslint config file to analyse and the analysis shows some issue, an error status is returned', () => {
    spawnSync.mockReturnValue({ status: 1, stdout: JSON.stringify(eslintResultWithError) });

    const packageDirectory = '/path/to/project';
    const packageFile = `${packageDirectory}/.eslintrc.json`;
    const receivedStatus = runEslintWithConfigFile(packageFile);

    expect(receivedStatus).toStrictEqual({ status: 1, outcomes: eslintResultWithError });
    expect(spawnSync).toHaveBeenCalledWith(
      'npx',
      [
        'eslint',
        '-f', 'json',
        '--no-inline-config',
        '--ext', '.js, .jsx',
        '--no-error-on-unmatched-pattern',
        '-c', '.eslintrc.json',
        '.'
      ],
      { cwd: packageDirectory },
    );
  });
});
