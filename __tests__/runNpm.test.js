jest.mock('../runNpmOnFile');
jest.mock('../findFilesBy');

const findFilesBy = require('../findFilesBy');
const runNpmOnFile = require('../runNpmOnFile');
const runNpm = require('../runNpm');

describe('Running npm', () => {
  beforeAll(() => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.error = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success status', () => {
    test('The dependencies are successfully installed at a directory containing one package', () => {
      const directory = '/my-project';
      const packageFile = `${directory}/package.json`;

      findFilesBy.mockReturnValue([packageFile]);
      runNpmOnFile.mockReturnValue(0);

      expect(runNpm(directory)).toBe(0);
      expect(findFilesBy).toHaveBeenCalledWith(directory, 'package.json');
      expect(runNpmOnFile).toHaveBeenCalledTimes(1);
      expect(runNpmOnFile).toHaveBeenCalledWith(packageFile);
    });

    test('The dependencies are successfully installed at a directory containing multiple packages', () => {
      const directory = '/my-monorepo-project';
      const packageFileFrontProject = `${directory}/front-end/package.json`;
      const packageFileBackProject = `${directory}/back-end/package.json`;

      findFilesBy.mockReturnValue([packageFileFrontProject, packageFileBackProject]);
      runNpmOnFile.mockReturnValueOnce(0);

      expect(runNpm(directory)).toBe(0);
      expect(findFilesBy).toHaveBeenCalledWith(directory, 'package.json');
      expect(runNpmOnFile).toHaveBeenCalledTimes(2);
      expect(runNpmOnFile).toHaveBeenNthCalledWith(1, packageFileFrontProject);
      expect(runNpmOnFile).toHaveBeenNthCalledWith(2, packageFileBackProject);
    });

    test('When the directory has no package to install its dependencies, a success status is returned', () => {
      const directory = '/my-project';

      findFilesBy.mockReturnValue([]);

      expect(runNpm(directory)).toBe(0);
      expect(findFilesBy).toHaveBeenCalledWith(directory, 'package.json');
      expect(runNpmOnFile).not.toHaveBeenCalled();
    });
  });

  describe('Error status', () => {
    test('When the directory has one package that is not successfully installed, an error status is returned', () => {
      const directory = '/my-monorepo-project';
      const packageFileFrontProject = `${directory}/front-end/package.json`;
      const packageFileBackProject = `${directory}/back-end/package.json`;

      findFilesBy.mockReturnValue([packageFileFrontProject, packageFileBackProject]);
      runNpmOnFile.mockReturnValueOnce(0).mockReturnValueOnce(1);

      expect(runNpm(directory)).toBe(1);
      expect(findFilesBy).toHaveBeenCalledWith(directory, 'package.json');
      expect(runNpmOnFile).toHaveBeenCalledTimes(2);
      expect(runNpmOnFile).toHaveBeenNthCalledWith(1, packageFileFrontProject);
      expect(runNpmOnFile).toHaveBeenNthCalledWith(2, packageFileBackProject);
    });

    test('When the directory has multiple packages and they are not successfully installed, an error status is returned', () => {
      const directory = '/my-monorepo-project';
      const packageFileFrontProject = `${directory}/front-end/package.json`;
      const packageFileBackProject = `${directory}/back-end/package.json`;

      findFilesBy.mockReturnValue([packageFileFrontProject, packageFileBackProject]);
      runNpmOnFile.mockReturnValueOnce(1).mockReturnValueOnce(1);

      expect(runNpm(directory)).toBe(2);
      expect(findFilesBy).toHaveBeenCalledWith(directory, 'package.json');
      expect(runNpmOnFile).toHaveBeenCalledTimes(2);
      expect(runNpmOnFile).toHaveBeenNthCalledWith(1, packageFileFrontProject);
      expect(runNpmOnFile).toHaveBeenNthCalledWith(2, packageFileBackProject);
    });

    test('When the directory has one package and it is not successfully installed, an error status is returned', () => {
      const directory = '/my-project';
      const packageFile = `${directory}/package.json`;

      findFilesBy.mockReturnValue([packageFile]);
      runNpmOnFile.mockReturnValueOnce(1);

      expect(runNpm(directory)).toBe(1);
      expect(findFilesBy).toHaveBeenCalledWith(directory, 'package.json');
      expect(runNpmOnFile).toHaveBeenCalledTimes(1);
      expect(runNpmOnFile).toHaveBeenNthCalledWith(1, packageFile);
    });
  });
});
