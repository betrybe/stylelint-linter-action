const fs = require('fs');
const path = require('path');
const minimatch = require("minimatch");

const readFiles = (startPath) => {
  if (!fs.existsSync(startPath)) {
    console.log('Path does not exist:', startPath);

    return [];
  }

  return fs.readdirSync(startPath);
};

const findFilesBy = (startDirectory, stringSearch) => {
  const directories = [startDirectory];
  const foundFiles = [];
  const pathsToIgnore = fs.readFileSync(`${startDirectory}/.stylelintignore`)
    .toString()
    .split('\n')
    .map((pathToIgnore) => path.join(startDirectory, pathToIgnore));

  while (directories.length > 0) {
    const currentDirectory = directories.pop();
    const files = readFiles(currentDirectory);

    files.forEach((file) => {
      const filename = path.join(currentDirectory, file);

      if (filename.indexOf('node_modules') !== -1) return;
      if (pathsToIgnore.some((pathToIgnore) => minimatch(filename, pathToIgnore))) return;

      const stat = fs.lstatSync(filename);

      if (stat.isDirectory()) directories.push(filename);
      else if (filename.indexOf(stringSearch) >= 0) foundFiles.push(filename);
    });
  }

  return foundFiles;
};

module.exports = findFilesBy;
