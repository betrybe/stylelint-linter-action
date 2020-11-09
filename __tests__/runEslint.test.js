jest.mock('../runEslintWithConfigFile');
jest.mock('../findFilesBy');

const findFilesBy = require('../findFilesBy');
const runEslintWithConfigFile = require('../runEslintWithConfigFile');
const runEslint = require('../runEslint');
const backEndWithoutEslintError = require('./fixtures/eslint-results/backEndNoError.json');
const eslintResultWithOneError = require('./fixtures/eslint-results/oneError.json');
const frontEndWithoutEslintError = require('./fixtures/eslint-results/frontEndNoError.json');
const frontEndWithEslintError = require('./fixtures/eslint-results/multipleErrorsOneFile.json');

describe('Eslint analysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success status', () => {
    test('The analysis ends successfully at a directory containing one project with eslint configured', () => {
      const directory = '/my-project';
      const eslintFile = `${directory}/.eslintrc.json`;

      findFilesBy.mockReturnValue([eslintFile]);
      runEslintWithConfigFile.mockReturnValue({ status: 0, outcomes: frontEndWithoutEslintError });

      expect(runEslint(directory)).toStrictEqual({ status: 0, outcomes: frontEndWithoutEslintError });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.eslintrc.json');
      expect(runEslintWithConfigFile).toHaveBeenCalledTimes(1);
      expect(runEslintWithConfigFile).toHaveBeenCalledWith(eslintFile);
    });

    test('The analysis ends successfully at a directory containing multiple projects with eslint configured', () => {
      const directory = '/my-monorepo-project';
      const eslintFileFrontProject = `${directory}/front-end/.eslintrc.json`;
      const eslintFileBackProject = `${directory}/back-end/.eslintrc.json`;

      findFilesBy.mockReturnValue([eslintFileFrontProject, eslintFileBackProject]);
      runEslintWithConfigFile
        .mockReturnValueOnce({ status: 0, outcomes: frontEndWithoutEslintError })
        .mockReturnValueOnce({ status: 0, outcomes: backEndWithoutEslintError });

      expect(runEslint(directory)).toStrictEqual({ status: 0, outcomes: frontEndWithoutEslintError.concat(backEndWithoutEslintError) });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.eslintrc.json');
      expect(runEslintWithConfigFile).toHaveBeenCalledTimes(2);
      expect(runEslintWithConfigFile).toHaveBeenNthCalledWith(1, eslintFileFrontProject);
      expect(runEslintWithConfigFile).toHaveBeenNthCalledWith(2, eslintFileBackProject);
    });

    test('When the directory has no eslint to analyse, a success status is returned', () => {
      const directory = '/my-project';

      findFilesBy.mockReturnValue([]);

      expect(runEslint(directory)).toStrictEqual({ status: 0, outcomes: [] });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.eslintrc.json');
      expect(runEslintWithConfigFile).not.toHaveBeenCalled();
    });
  });

  describe('Error status', () => {
    test('The analysis fails at a directory containing only one project with eslint configured', () => {
      const directory = '/my-project';
      const eslintFile = `${directory}/.eslintrc.json`;

      findFilesBy.mockReturnValue([eslintFile]);
      runEslintWithConfigFile.mockReturnValue({ status: 1, outcomes: eslintResultWithOneError });

      expect(runEslint(directory)).toStrictEqual({ status: 1, outcomes: eslintResultWithOneError });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.eslintrc.json');
      expect(runEslintWithConfigFile).toHaveBeenCalledTimes(1);
      expect(runEslintWithConfigFile).toHaveBeenCalledWith(eslintFile);
    });

    test('When the directory has one project whose eslint analysis fails, an error status is returned', () => {
      const directory = '/my-monorepo-project';
      const eslintFileFrontProject = `${directory}/front-end/.eslintrc.json`;
      const eslintFileBackProject = `${directory}/back-end/.eslintrc.json`;

      findFilesBy.mockReturnValue([eslintFileFrontProject, eslintFileBackProject]);
      runEslintWithConfigFile
        .mockReturnValueOnce({ status: 0, outcomes: frontEndWithoutEslintError })
        .mockReturnValueOnce({ status: 1, outcomes: eslintResultWithOneError });

      expect(runEslint(directory)).toStrictEqual({ status: 1, outcomes: frontEndWithoutEslintError.concat(eslintResultWithOneError) });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.eslintrc.json');
      expect(runEslintWithConfigFile).toHaveBeenCalledTimes(2);
      expect(runEslintWithConfigFile).toHaveBeenNthCalledWith(1, eslintFileFrontProject);
      expect(runEslintWithConfigFile).toHaveBeenNthCalledWith(2, eslintFileBackProject);
    });

    test('When the directory has multiple projects whose eslint analyses fail, an error status is returned', () => {
      const directory = '/my-monorepo-project';
      const eslintFileFrontProject = `${directory}/front-end/.eslintrc.json`;
      const eslintFileBackProject = `${directory}/back-end/.eslintrc.json`;

      findFilesBy.mockReturnValue([eslintFileFrontProject, eslintFileBackProject]);
      runEslintWithConfigFile
        .mockReturnValueOnce({ status: 1, outcomes: frontEndWithEslintError })
        .mockReturnValueOnce({ status: 1, outcomes: eslintResultWithOneError });

      expect(runEslint(directory)).toStrictEqual({ status: 2, outcomes: frontEndWithEslintError.concat(eslintResultWithOneError) });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.eslintrc.json');
      expect(runEslintWithConfigFile).toHaveBeenCalledTimes(2);
      expect(runEslintWithConfigFile).toHaveBeenNthCalledWith(1, eslintFileFrontProject);
      expect(runEslintWithConfigFile).toHaveBeenNthCalledWith(2, eslintFileBackProject);
    });
  });
});
