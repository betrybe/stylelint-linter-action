jest.mock('../runStylelintWithConfigFile');
jest.mock('../findFilesBy');

const findFilesBy = require('../findFilesBy');
const runStylelintWithConfigFile = require('../runStylelintWithConfigFile');
const runStylelint = require('../runStylelint');
const stylelintResultWithNoError = require('./fixtures/stylelint-results/noError.json');
const stylelintResultWithOneError = require('./fixtures/stylelint-results/oneError.json');

describe('Stylelint analysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success status', () => {
    test('The analysis ends successfully at a directory containing one project with stylelint configured', () => {
      const directory = '/my-project';
      const stylelintFile = `${directory}/.stylelintrc.json`;

      findFilesBy.mockReturnValue([stylelintFile]);
      runStylelintWithConfigFile.mockReturnValue({ status: 0, outcomes: stylelintResultWithNoError });

      expect(runStylelint(directory)).toStrictEqual({ status: 0, outcomes: stylelintResultWithNoError });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.stylelintrc.json');
      expect(runStylelintWithConfigFile).toHaveBeenCalledTimes(1);
      expect(runStylelintWithConfigFile).toHaveBeenCalledWith(stylelintFile);
    });

    test('The analysis ends successfully at a directory containing multiple projects with stylelint configured', () => {
      const directory = '/my-monorepo-project';
      const stylelintFileFrontProject1 = `${directory}/front-end1/.stylelintrc.json`;
      const stylelintFileFrontProject2 = `${directory}/front-end2/.stylelintrc.json`;

      findFilesBy.mockReturnValue([stylelintFileFrontProject1, stylelintFileFrontProject2]);
      runStylelintWithConfigFile
        .mockReturnValueOnce({ status: 0, outcomes: stylelintResultWithNoError })
        .mockReturnValueOnce({ status: 0, outcomes: stylelintResultWithNoError });

      expect(runStylelint(directory)).toStrictEqual({ status: 0, outcomes: stylelintResultWithNoError.concat(stylelintResultWithNoError) });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.stylelintrc.json');
      expect(runStylelintWithConfigFile).toHaveBeenCalledTimes(2);
      expect(runStylelintWithConfigFile).toHaveBeenNthCalledWith(1, stylelintFileFrontProject1);
      expect(runStylelintWithConfigFile).toHaveBeenNthCalledWith(2, stylelintFileFrontProject2);
    });

    test('When the directory has no stylelint to analyse, a success status is returned', () => {
      const directory = '/my-project';

      findFilesBy.mockReturnValue([]);

      expect(runStylelint(directory)).toStrictEqual({ status: 0, outcomes: [] });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.stylelintrc.json');
      expect(runStylelintWithConfigFile).not.toHaveBeenCalled();
    });
  });

  describe('Error status', () => {
    test('The analysis fails at a directory containing only one project with stylelint configured', () => {
      const directory = '/my-project';
      const stylelintFile = `${directory}/.stylelintrc.json`;

      findFilesBy.mockReturnValue([stylelintFile]);
      runStylelintWithConfigFile.mockReturnValue({ status: 1, outcomes: stylelintResultWithOneError });

      expect(runStylelint(directory)).toStrictEqual({ status: 1, outcomes: stylelintResultWithOneError });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.stylelintrc.json');
      expect(runStylelintWithConfigFile).toHaveBeenCalledTimes(1);
      expect(runStylelintWithConfigFile).toHaveBeenCalledWith(stylelintFile);
    });

    test('When the directory has one project whose stylelint analysis fails, an error status is returned', () => {
      const directory = '/my-monorepo-project';
      const stylelintFileFrontProject1 = `${directory}/front-end1/.stylelintrc.json`;
      const stylelintFileFrontProject2 = `${directory}/front-end2/.stylelintrc.json`;

      findFilesBy.mockReturnValue([stylelintFileFrontProject1, stylelintFileFrontProject2]);
      runStylelintWithConfigFile
        .mockReturnValueOnce({ status: 0, outcomes: stylelintResultWithNoError })
        .mockReturnValueOnce({ status: 1, outcomes: stylelintResultWithOneError });

      expect(runStylelint(directory)).toStrictEqual({ status: 1, outcomes: stylelintResultWithNoError.concat(stylelintResultWithOneError) });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.stylelintrc.json');
      expect(runStylelintWithConfigFile).toHaveBeenCalledTimes(2);
      expect(runStylelintWithConfigFile).toHaveBeenNthCalledWith(1, stylelintFileFrontProject1);
      expect(runStylelintWithConfigFile).toHaveBeenNthCalledWith(2, stylelintFileFrontProject2);
    });

    test('When the directory has multiple projects whose stylelint analyses fail, an error status is returned', () => {
      const directory = '/my-monorepo-project';
      const stylelintFileFrontProject1 = `${directory}/front-end1/.stylelintrc.json`;
      const stylelintFileFrontProject2 = `${directory}/front-end2/.stylelintrc.json`;

      findFilesBy.mockReturnValue([stylelintFileFrontProject1, stylelintFileFrontProject2]);
      runStylelintWithConfigFile
        .mockReturnValueOnce({ status: 1, outcomes: stylelintResultWithOneError })
        .mockReturnValueOnce({ status: 1, outcomes: stylelintResultWithOneError });

      expect(runStylelint(directory)).toStrictEqual({ status: 2, outcomes: stylelintResultWithOneError.concat(stylelintResultWithOneError) });
      expect(findFilesBy).toHaveBeenCalledWith(directory, '.stylelintrc.json');
      expect(runStylelintWithConfigFile).toHaveBeenCalledTimes(2);
      expect(runStylelintWithConfigFile).toHaveBeenNthCalledWith(1, stylelintFileFrontProject1);
      expect(runStylelintWithConfigFile).toHaveBeenNthCalledWith(2, stylelintFileFrontProject2);
    });
  });
});
