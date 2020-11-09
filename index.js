const core = require('@actions/core');
const github = require('@actions/github');
const buildFeedbackMessage = require('./feedbackMessage');
const runEslint = require('./runEslint');
const runNpm = require('./runNpm');

const run = async () => {
  try {
    const root = process.env.GITHUB_WORKSPACE || process.cwd();
    const token = core.getInput('token', { required: true });
    const client = github.getOctokit(token);
    const { owner, repo, number } = github.context.issue;
    const npmStatus = runNpm(root);
    const { status: eslintStatus, outcomes: eslintOutcomes } = runEslint(root);
    const status = npmStatus + eslintStatus;
    const feedbackMessage = buildFeedbackMessage(eslintOutcomes, root);

    console.log('Exit code:', status);
    console.log('All errors:', eslintOutcomes);
    console.log('Feedback message:\n', feedbackMessage);

    await client.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: feedbackMessage,
    });

    process.exit(status);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
