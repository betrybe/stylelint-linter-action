jest.mock('child_process');

const { spawnSync } = require('child_process');
const runNpmOnFile = require('../runNpmOnFile');

describe('Running npm', () => {
  test('When there is package.json to install the dependencies and the execution succeeds, a success status is returned', () => {
    spawnSync.mockReturnValue({ status: 0 });

    const packageDirectory = '/path/to/project';
    const packageFile = `${packageDirectory}/package.json`;
    const receivedStatus = runNpmOnFile(packageFile);

    expect(receivedStatus).toBe(0);
    expect(spawnSync).toHaveBeenCalledWith(
      'npm',
      ['ci'],
      { cwd: packageDirectory },
    );
  });

  test('When there is package.json to install the dependencies and the execution fails, an error status is returned', () => {
    spawnSync.mockReturnValue({ status: 1 });

    const packageDirectory = '/path/to/project';
    const packageFile = `${packageDirectory}/package.json`;
    const receivedStatus = runNpmOnFile(packageFile);

    expect(receivedStatus).toBe(1);
    expect(spawnSync).toHaveBeenCalledWith(
      'npm',
      ['ci'],
      { cwd: packageDirectory },
    );
  });
});
