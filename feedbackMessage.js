const countageFieldNameByType = (issueType) => (issueType === 'erro' ? 'errorCount' : 'warningCount');

const issueSeverityToConsider = (issueType) => (issueType === 'erro' ? 2 : 1);

const getIssuesCount = (stylelintOutcomes, issueType) => {
  const countageToConsider = countageFieldNameByType(issueType);

  return stylelintOutcomes.reduce((acc, stylelintOutcome) => acc + stylelintOutcome[countageToConsider], 0);
};

const buildIssueMessage = (line, message) => `- Linha **${line}**: ${message}`;

const buildFileSection = (filePath) => `#### Arquivo \`${filePath}\`\n`;

const filterMessagesByIssueType = (messages, issueType) => {
  const severityToConsider = issueSeverityToConsider(issueType);

  return messages.filter(({ severity }) => severity === severityToConsider);
};

const buildFileIssues = (stylelintOutcomeOnFile, root, issueType) => {
  const countageTypeToConsider = countageFieldNameByType(issueType);
  const issuesCount = stylelintOutcomeOnFile[countageTypeToConsider];

  if (issuesCount === 0) return '';

  const { filePath, messages } = stylelintOutcomeOnFile;
  const relativePathFile = filePath.replace(root, '');
  const fileSection = `${buildFileSection(relativePathFile)}\n\n`;
  const messagesToConsider = filterMessagesByIssueType(messages, issueType);

  return messagesToConsider.reduce((acc, issue) => `${acc}${buildIssueMessage(issue)}\n`, fileSection);
};

const listIssues = (stylelintOutcomes, root, issueType) => (
  stylelintOutcomes.reduce((acc, currentFile) => acc + buildFileIssues(currentFile, root, issueType), '')
);

const severity = (issueType) => (issueType === 'erro' ? 'error' : 'warning');

const getSummaryMessage = (stylelintOutcomes, issueType) => {
  let issuesCount = 0;

  const severityType = severity(issueType);

  stylelintOutcomes.forEach(({ warnings }) => {
    issuesCount = warnings.reduce((total, issue) => {
      if (issue.severity === severityType) total++;
      return total;
    }, 0);
  });

  if (issuesCount === 0) return `### Nenhum ${issueType} encontrado.`;
  if (issuesCount === 1) return `### Foi encontrado 1 ${issueType}.`;
  return `### Foram encontrados ${issuesCount} ${issueType}s.`;
};

const buildFeedbackByIssueType = (stylelintOutcomes, root, issueType) => {
  let feedbackMessage = getSummaryMessage(stylelintOutcomes, issueType);

  if (feedbackMessage !== `### Nenhum ${issueType} encontrado.`) {
    feedbackMessage = `${feedbackMessage}\n\n${listIssues(stylelintOutcomes, root, issueType)}`;
  }

  return feedbackMessage;
};

const buildFeedbackMessage = (stylelintOutcomes, root) => {
  const stylelintIssues = stylelintOutcomes.reduce((total, currentValue, currentIndex, arr) => {
    const { source, warnings } = currentValue;
    let issues = {
      source,
      error: [],
      warning: [],
    };
    warnings.forEach(({ line, column, severity, text }) => {
      issues[severity].push({
        line,
        column,
        text,
      });
    });

    return {
      issues: total.issues.concat(issues),
      errorCount: total.errorCount + issues.error.length,
      warningCount: total.warningCount + issues.warning.length,
    };
  }, { issues: [], errorCount: 0, warningCount: 0 });

  const { issues, errorCount, warningCount } = stylelintIssues;

  let feedbackMessage = [];

  const { errorFeedbackMessage, warningFeedbackMessage } = issues.reduce((total, currentValue, currentIndex, arr) => {
    let errorFeedbackMessage = [];
    let warningFeedbackMessage = [];
    let relativePathFile = '';
    const { source, error, warning } = currentValue;

    if (error.length > 0) {
      relativePathFile = source.replace(root, '');
      errorFeedbackMessage.push(buildFileSection(relativePathFile));
      error.map(({ line, text }) => errorFeedbackMessage.push(buildIssueMessage(line, text)));
    }

    if (warning.length > 0) {
      relativePathFile = source.replace(root, '');
      warningFeedbackMessage.push(buildFileSection(relativePathFile));
      warning.map(({ line, text }) => warningFeedbackMessage.push(buildIssueMessage(line, text)));
    }

    return {
      errorFeedbackMessage: total.errorFeedbackMessage.concat(...errorFeedbackMessage),
      warningFeedbackMessage: total.warningFeedbackMessage.concat(...warningFeedbackMessage),
    };
  }, { errorFeedbackMessage: [], warningFeedbackMessage: [] });

  if (errorCount === 0) feedbackMessage.push(`### Nenhum erro encontrado.`);
  if (errorCount === 1) feedbackMessage.push(`### Foi encontrado 1 erro.\n`);
  if (errorCount > 1) feedbackMessage.push(`### Foram encontrados ${errorCount} erros.\n`);
  if (errorFeedbackMessage.length > 0) feedbackMessage.push(...errorFeedbackMessage, '');

  if (warningCount === 0) feedbackMessage.push(`### Nenhum aviso encontrado.`);
  if (warningCount === 1) feedbackMessage.push(`### Foi encontrado 1 aviso.\n`);
  if (warningCount > 1) feedbackMessage.push(`### Foram encontrados ${warningCount} avisos.\n`);
  if (warningFeedbackMessage.length > 0) feedbackMessage.push(...warningFeedbackMessage);

  console.log(feedbackMessage);

  return feedbackMessage.join('\n');
};

module.exports = buildFeedbackMessage;
