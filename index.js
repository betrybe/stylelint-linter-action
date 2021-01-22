const core = require('@actions/core');
const github = require('@actions/github');
const buildFeedbackMessage = require('./feedbackMessage');
const runStylelint = require('./runStylelint');
const runNpm = require('./runNpm');

const run = async () => {
  try {
    const root = process.env.GITHUB_WORKSPACE || process.cwd();
    const token = core.getInput('token', { required: true });
    const client = github.getOctokit(token);
    const { owner, repo } = github.context.issue;
    const npmStatus = runNpm(root);
    const { status: stylelintStatus, outcomes: stylelintOutcomes } = runStylelint(root);
    const status = npmStatus + stylelintStatus;
    const feedbackMessage = buildFeedbackMessage(stylelintOutcomes, root);

    console.log('Exit code:', status);
    console.log('All errors:', stylelintOutcomes);
    console.log('Feedback message:\n', feedbackMessage);

    await client.issues.createComment({
      owner,
      repo,
      issue_number: process.env.INPUT_PR_NUMBER,
      body: feedbackMessage,
    });

    process.exit(status);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
