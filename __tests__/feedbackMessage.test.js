const buildFeedbackMessage = require('../feedbackMessage');
const multipleErrorsOneFile = require('./fixtures/eslint-results/multipleErrorsOneFile.json');
const multipleWarningsOneFile = require('./fixtures/eslint-results/multipleWarningsOneFile.json');
const multipleWarningsAndErrorsOneFile = require('./fixtures/eslint-results/multipleWarningsAndErrorsOneFile.json');
const multipleErrorsMultipleFiles = require('./fixtures/eslint-results/multipleErrorsMultipleFiles.json');
const multipleWarningsMultipleFiles = require('./fixtures/eslint-results/multipleWarningsMultipleFiles.json');
const noError = require('./fixtures/eslint-results/frontEndNoError.json');
const oneError = require('./fixtures/eslint-results/oneError.json');
const oneErrorOneFileMultipleWarningsAnotherFile = require('./fixtures/eslint-results/oneErrorOneFileMultipleWarningsAnotherFile.json');
const oneWarning = require('./fixtures/eslint-results/oneWarning.json');

describe('Feedback message', () => {
  describe('No issue is found', () => {
    test('When there is no file to be evaluated, a no issue encountered message is returned', () => {
      expect(buildFeedbackMessage([], './')).toBe(
        '### Nenhum erro encontrado.\n' +
        '### Nenhum aviso encontrado.'
      )
    });

    test('When there are files to be evaluated, a no issue encountered message is returned', () => {
      expect(buildFeedbackMessage(noError, './')).toBe(
        '### Nenhum erro encontrado.\n' +
        '### Nenhum aviso encontrado.'
      )
    });
  });

  test('When one error is found, a message showing the error is returned', () => {
    expect(buildFeedbackMessage(oneError, './')).toBe(
      '### Foi encontrado 1 erro.\n' +
      '\n' +
      '#### Arquivo `/my-project/index.js`\n' +
      '\n' +
      '- Linha **1**: Function \'isPentagon\' has too many parameters (5). Maximum allowed is 4.\n' +
      '\n' +
      '### Nenhum aviso encontrado.'
    );
  });

  describe('Multiple errors are found', () => {
    test('When all errors are contained in one file, a message listing all those errors is returned', () => {
      expect(buildFeedbackMessage(multipleErrorsOneFile, './')).toBe(
        '### Foram encontrados 4 erros.\n' +
        '\n' +
        '#### Arquivo `/my-react-project/src/components/Greeting.js`\n' +
        '\n' +
        '- Linha **3**: \'name\' is missing in props validation\n' +
        '- Linha **3**: `Hello, ` must be placed on a new line\n' +
        '- Linha **3**: `{name}` must be placed on a new line\n' +
        '- Linha **5**: Missing semicolon.\n' +
        '\n' +
        '### Nenhum aviso encontrado.'
      );
    });

    test('When the errors span multiple files, a message listing all those errors is returned', () => {
      expect(buildFeedbackMessage(multipleErrorsMultipleFiles, './')).toBe(
        '### Foram encontrados 4 erros.\n' +
        '\n' +
        '#### Arquivo `/my-react-project/src/App.js`\n' +
        '\n' +
        '- Linha **2**: `react` import should occur before import of `./components/Greeting`\n' +
        '- Linha **12**: `code` must be placed on a new line\n' +
        '- Linha **24**: Expected indentation of 6 space characters but found 4.\n' +
        '' +
        '#### Arquivo `/my-react-project/src/components/Greeting.js`\n' +
        '\n' +
        '- Linha **3**: \'name\' is missing in props validation\n' +
        '\n' +
        '### Nenhum aviso encontrado.'
      );
    });
  });

  test('When one warning is found, a message showing the warning is returned', () => {
    expect(buildFeedbackMessage(oneWarning, './')).toBe(
      '### Nenhum erro encontrado.\n' +
      '### Foi encontrado 1 aviso.\n' +
      '\n' +
      '#### Arquivo `/back-end/index.js`\n' +
      '\n' +
      '- Linha **8**: Unexpected console statement.\n'
    );
  });

  describe('Multiple warnings are found', () => {
    test('When all warnings are contained in one file, a message listing all those warnings is returned', () => {
      expect(buildFeedbackMessage(multipleWarningsOneFile, './')).toBe(
        '### Nenhum erro encontrado.\n' +
        '### Foram encontrados 2 avisos.\n' +
        '\n' +
        '#### Arquivo `/front-end/src/App.js`\n' +
        '\n' +
        '- Linha **7**: Unexpected console statement.\n' +
        '- Linha **28**: Unexpected alert.\n'
      );
    });

    test('When the warnings span multiple files, a message listing all those warnings is returned', () => {
      expect(buildFeedbackMessage(multipleWarningsMultipleFiles, './')).toBe(
       '### Nenhum erro encontrado.\n' +
       '### Foram encontrados 3 avisos.\n' +
       '\n' +
       '#### Arquivo `/front-end/src/App.js`\n' +
       '\n' +
       '- Linha **7**: Unexpected console statement.\n' +
       '- Linha **28**: Unexpected alert.\n' +
       '' +
       '#### Arquivo `/front-end/src/components/Greeting.js`\n' +
       '\n' +
       '- Linha **7**: Missing trailing comma.\n'
      );
    });
  });

  describe('Errors and warnings are found', () => {
    test('When all errors and warnings are contained in one file, a message listing both errors and warnings is returned', () => {
      expect(buildFeedbackMessage(multipleWarningsAndErrorsOneFile, './')).toBe(
        '### Foi encontrado 1 erro.\n' +
        '\n' +
        '#### Arquivo `/front-end/src/App.js`\n'+
        '\n' +
        '- Linha **33**: Newline required at end of file but not found.\n' +
        '\n' +
        '### Foram encontrados 2 avisos.\n' +
        '\n' +
        '#### Arquivo `/front-end/src/App.js`\n'+
        '\n' +
        '- Linha **7**: Unexpected console statement.\n' +
        '- Linha **28**: Unexpected alert.\n'
      );
    });

    test('When errors are in one file and warnings are in another one, a message listing both errors and warnings for those files is returned', () => {
      expect(buildFeedbackMessage(oneErrorOneFileMultipleWarningsAnotherFile, './')).toBe(
        '### Foi encontrado 1 erro.\n' +
        '\n' +
        '#### Arquivo `/front-end/src/components/Greeting.js`\n'+
        '\n' +
        '- Linha **2**: Missing semicolon.\n' +
        '\n' +
        '### Foram encontrados 2 avisos.\n' +
        '\n' +
        '#### Arquivo `/front-end/src/App.js`\n'+
        '\n' +
        '- Linha **7**: Unexpected console statement.\n' +
        '- Linha **28**: Unexpected alert.\n'
      );
    });
  });

  test('The root directory path for the project isn\'t displayed for each file', () => {
    expect(buildFeedbackMessage(multipleErrorsMultipleFiles, '/my-react-project')).toBe(
      '### Foram encontrados 4 erros.\n' +
      '\n' +
      '#### Arquivo `/src/App.js`\n' +
      '\n' +
      '- Linha **2**: `react` import should occur before import of `./components/Greeting`\n' +
      '- Linha **12**: `code` must be placed on a new line\n' +
      '- Linha **24**: Expected indentation of 6 space characters but found 4.\n' +
      '' +
      '#### Arquivo `/src/components/Greeting.js`\n' +
      '\n' +
      '- Linha **3**: \'name\' is missing in props validation\n' +
      '\n' +
      '### Nenhum aviso encontrado.'
    );
  });
});
