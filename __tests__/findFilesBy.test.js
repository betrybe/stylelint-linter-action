const findFilesBy = require('../findFilesBy');

describe('Find files in directory', () => {
  const rootDirectory = process.cwd();

  describe('Files are found', () => {
    test('When one file is found, a one element list containing it is returned', () => {
      const startPath = `${rootDirectory}/__tests__/fixtures/projects/back-end`;
      const givenResult = findFilesBy(startPath, '.eslintrc.json');
      const expectedResult = [`${startPath}/.eslintrc.json`];

      expect(givenResult).toEqual(expectedResult);
    });

    test('When multiple files are found, a list containing them is returned', () => {
      const startPath = `${rootDirectory}/__tests__/fixtures/projects/monorepo`;
      const givenResult = findFilesBy(startPath, '.eslintrc.json').sort();
      const expectedResult = [
        `${startPath}/api/.eslintrc.json`,
        `${startPath}/front-end/.eslintrc.json`,
      ];

      expect(givenResult).toEqual(expectedResult);
    });
  });

  describe('No files are found', () => {
    test('When no file in the directory meets the search string, an empty list is returned', () => {
      const startPath = `${rootDirectory}/__tests__/fixtures/projects/monorepo`;
      const givenResult = findFilesBy(startPath, 'non-existent.file');

      expect(givenResult).toEqual([]);
    });

    test('When the directory does not exist, an empty list is returned', () => {
      const startPath = `${rootDirectory}/non/existent/path`;
      const givenResult = findFilesBy(startPath, '.eslintrc.json');

      expect(givenResult).toEqual([]);
    });
  });

  test('Disregards files in node_modules directory', () => {
    const fs = require('fs');

    jest
      .spyOn(fs, 'readdirSync')
      .mockReturnValue(['package.json']);

    jest
      .spyOn(fs, 'existsSync')
      .mockReturnValue(true);

    const startPath = '/my-project/node_modules/my-package';
    const givenResult = findFilesBy(startPath, 'package.json');

    expect(givenResult).toEqual([]);
  })
});
