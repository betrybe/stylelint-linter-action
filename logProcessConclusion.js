const logProcessConclusion = ({ error, status, stderr, stdout }) => {
  const parsedStderr = stderr ? stderr.toString() : '';
  const parsedStdout = stdout ? stdout.toString() : '';
  const logMessages = [];

  if (error) logMessages.push(`error: ${error.message}`);
  if (parsedStderr) logMessages.push(`stderr: ${parsedStderr}`);

  logMessages.push(`stdout: ${parsedStdout}`)
  logMessages.push(`status: ${status}`)

  console.log(logMessages.join('\n'));
};

module.exports = logProcessConclusion;
