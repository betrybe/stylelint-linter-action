const countageFieldNameByType = (issueType) => (issueType === 'erro' ? 'errorCount' : 'warningCount');

const issueSeverityToConsider = (issueType) => (issueType === 'erro' ? 2 : 1);

const getIssuesCount = (eslintOutcomes, issueType) => {
  const countageToConsider = countageFieldNameByType(issueType);

  return eslintOutcomes.reduce((acc, eslintOutcome) => acc + eslintOutcome[countageToConsider], 0);
};

const buildIssueMessage = ({ line, message }) => `- Linha **${line}**: ${message}`;

const buildFileSection = (filePath) => `#### Arquivo \`${filePath}\``;

const filterMessagesByIssueType = (messages, issueType) => {
  const severityToConsider = issueSeverityToConsider(issueType);

  return messages.filter(({ severity }) => severity === severityToConsider);
};

const buildFileIssues = (eslintOutcomeOnFile, root, issueType) => {
  const countageTypeToConsider = countageFieldNameByType(issueType);
  const issuesCount = eslintOutcomeOnFile[countageTypeToConsider];

  if (issuesCount === 0) return '';

  const { filePath, messages } = eslintOutcomeOnFile;
  const relativePathFile = filePath.replace(root, '');
  const fileSection = `${buildFileSection(relativePathFile)}\n\n`;
  const messagesToConsider = filterMessagesByIssueType(messages, issueType);

  return messagesToConsider.reduce((acc, issue) => `${acc}${buildIssueMessage(issue)}\n`, fileSection);
};

const listIssues = (eslintOutcomes, root, issueType) => (
  eslintOutcomes.reduce((acc, currentFile) => acc + buildFileIssues(currentFile, root, issueType), '')
);

const getSummaryMessage = (eslintOutcomes, issueType) => {
  const issuesCount = getIssuesCount(eslintOutcomes, issueType);

  if (issuesCount === 0) return `### Nenhum ${issueType} encontrado.`;
  if (issuesCount === 1) return `### Foi encontrado 1 ${issueType}.`;
  return `### Foram encontrados ${issuesCount} ${issueType}s.`;
};

const buildFeedbackByIssueType = (eslintOutcomes, root, issueType) => {
  let feedbackMessage = getSummaryMessage(eslintOutcomes, issueType);

  if (feedbackMessage !== `### Nenhum ${issueType} encontrado.`) {
    feedbackMessage = `${feedbackMessage}\n\n${listIssues(eslintOutcomes, root, issueType)}`;
  }

  return feedbackMessage;
};

const buildFeedbackMessage = (eslintOutcomes, root) => {
  const issueTypes = ['erro', 'aviso'];

  const feedbackMessages = issueTypes.map(
    (issueType) => buildFeedbackByIssueType(eslintOutcomes, root, issueType)
  );

  return feedbackMessages.join('\n');
};

module.exports = buildFeedbackMessage;
