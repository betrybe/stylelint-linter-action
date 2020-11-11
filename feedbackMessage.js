const buildFeedbackMessage = (stylelintOutcomes, root) => {
  const { issues, errorCount, warningCount } = extractStylelintIssues(stylelintOutcomes);
  const { errorIssues, warningIssues } = splitIssues(issues, root);

  let feedbackMessage = [];

  feedbackMessage.push(feedBackTitleMessage('erro', errorCount));
  feedbackMessage = addIssueLineMessage(feedbackMessage, errorIssues, true);

  feedbackMessage.push(feedBackTitleMessage('aviso', warningCount));
  feedbackMessage = addIssueLineMessage(feedbackMessage, warningIssues);

  return feedbackMessage.join('\n');
};

const extractStylelintIssues = (stylelintOutcomes) => {
  return stylelintOutcomes.reduce((total, currentValue) => {
    const { source, warnings } = currentValue;
    let issues = {
      source,
      error: [],
      warning: [],
    };

    warnings.forEach(({ line, column, severity, text }) => (
      issues[severity].push({ line, column, text })
    ));

    return {
      issues: total.issues.concat(issues),
      errorCount: total.errorCount + issues.error.length,
      warningCount: total.warningCount + issues.warning.length,
    };
  }, { issues: [], errorCount: 0, warningCount: 0 });
};

const splitIssues = (issues, root) => {
  return issues.reduce((total, currentValue) => {
    let errorIssues = [];
    let warningIssues = [];
    const { source, error, warning } = currentValue;

    errorIssues = buildIssuesMessage(source, error, root);
    warningIssues = buildIssuesMessage(source, warning, root);

    return {
      errorIssues: total.errorIssues.concat(...errorIssues),
      warningIssues: total.warningIssues.concat(...warningIssues),
    };
  }, { errorIssues: [], warningIssues: [] });
};

const buildIssuesMessage = (source, issues, root) => {
  let messages = [];
  if (issues.length > 0) {
    messages.push(buildFileSection(source, root));
    issues.map(({ line, text }) => messages.push(buildDetailedMessage(line, text)));
  }
  return [...messages];
};

const buildFileSection = (filePath, root) => {
  const relativePathFile = filePath.replace(root, '');
  return `#### Arquivo \`${relativePathFile}\`\n`;
};

const buildDetailedMessage = (line, message) => `- Linha **${line}**: ${message}`;

const feedBackTitleMessage = (issueType, count) => {
  if (count === 0) return `### Nenhum ${issueType} encontrado.`;
  if (count === 1) return `### Foi encontrado 1 ${issueType}.\n`;
  return `### Foram encontrados ${count} ${issueType}s.\n`;
};

const addIssueLineMessage = (messages, issues, newline = false) => {
  if (issues.length > 0) {
    messages.push(...issues);
    if (newline) messages.push('');
  }
  return [...messages];
};

module.exports = buildFeedbackMessage;
