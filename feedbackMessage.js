const buildIssueMessage = (line, message) => `- Linha **${line}**: ${message}`;

const buildFileSection = (filePath) => `#### Arquivo \`${filePath}\`\n`;

const buildIssue = (body, source, issues, root) => {
  if (issues.length > 0) {
    const relativePathFile = source.replace(root, '');
    body.push(buildFileSection(relativePathFile));
    issues.map(({ line, text }) => body.push(buildIssueMessage(line, text)));
  }
  return [...body];
}

const buildListIssues = (issuesData, root) => {
  return issuesData.reduce((total, currentValue) => {
    let errorFeedbackMessage = [];
    let warningFeedbackMessage = [];
    const { source, error, warning } = currentValue;

    errorFeedbackMessage = buildIssue(errorFeedbackMessage, source, error, root);
    warningFeedbackMessage = buildIssue(warningFeedbackMessage, source, warning, root);

    return {
      errorFeedbackMessage: total.errorFeedbackMessage.concat(...errorFeedbackMessage),
      warningFeedbackMessage: total.warningFeedbackMessage.concat(...warningFeedbackMessage),
    };
  }, { errorFeedbackMessage: [], warningFeedbackMessage: [] });
};

const feedBackTitle = (issueType, count) => {
  if (count === 0) return `### Nenhum ${issueType} encontrado.`;
  if (count === 1) return `### Foi encontrado 1 ${issueType}.\n`;
  return `### Foram encontrados ${count} ${issueType}s.\n`;
};

const listIssues = (body, issues, newline = false) => {
  if (issues.length > 0) {
    body.push(...issues);
    if (newline) body.push('');
  }
  return [...body];
};

const buildStylelintIssues = (stylelintOutcomes) => {
  return stylelintOutcomes.reduce((total, currentValue) => {
    const { source, warnings } = currentValue;
    let issues = {
      source,
      error: [],
      warning: [],
    };
    warnings.forEach(({ line, column, severity, text }) => {
      issues[severity].push({ line, column, text });
    });

    return {
      issues: total.issues.concat(issues),
      errorCount: total.errorCount + issues.error.length,
      warningCount: total.warningCount + issues.warning.length,
    };
  }, { issues: [], errorCount: 0, warningCount: 0 });
};

const buildFeedbackMessage = (stylelintOutcomes, root) => {
  const { issues, errorCount, warningCount } = buildStylelintIssues(stylelintOutcomes);
  const { errorFeedbackMessage, warningFeedbackMessage } = buildListIssues(issues, root);

  let feedbackMessage = [];

  feedbackMessage.push(feedBackTitle('erro', errorCount));
  feedbackMessage = listIssues(feedbackMessage, errorFeedbackMessage, true);

  feedbackMessage.push(feedBackTitle('aviso', warningCount));
  feedbackMessage = listIssues(feedbackMessage, warningFeedbackMessage);

  return feedbackMessage.join('\n');
};

module.exports = buildFeedbackMessage;
