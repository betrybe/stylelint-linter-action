const buildFeedbackMessage = require('../feedbackMessage');
const multipleErrorsOneFile = require('./fixtures/stylelint-results/multipleErrorsOneFile.json');
const multipleWarningsOneFile = require('./fixtures/stylelint-results/multipleWarningsOneFile.json');
const multipleWarningsAndErrorsOneFile = require('./fixtures/stylelint-results/multipleErrorsAndWarningsOneFile.json');
const multipleErrorsMultipleFiles = require('./fixtures/stylelint-results/multipleErrorsMultipleFiles.json');
const multipleWarningsMultipleFiles = require('./fixtures/stylelint-results/multipleWarningsMultipleFiles.json');
const noError = require('./fixtures/stylelint-results/noError.json');
const oneError = require('./fixtures/stylelint-results/oneError.json');
const oneErrorOneFileMultipleWarningsAnotherFile = require('./fixtures/stylelint-results/oneErrorOneFileMultipleWarningsAnotherFile.json');
const multipleErrosAndWarningsMultipleFiles = require('./fixtures/stylelint-results/multipleErrorsAndWarningsMultipleFiles.json');
const oneWarning = require('./fixtures/stylelint-results/oneWarning.json');

describe('Feedback message', () => {
  beforeAll(() => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.error = jest.fn();
  });

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
      '#### Arquivo `/frontend/main.css`\n' +
      '\n' +
      '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
      '\n' +
      '### Nenhum aviso encontrado.'
    );
  });

  describe('Multiple errors are found', () => {
    test('When all errors are contained in one file, a message listing all those errors is returned', () => {
      expect(buildFeedbackMessage(multipleErrorsOneFile, './')).toBe(
        '### Foram encontrados 2 erros.\n' +
        '\n' +
        '#### Arquivo `/frontend/main.css`\n' +
        '\n' +
        '- Linha **5**: Unexpected invalid hex color \"#ye\" (color-no-invalid-hex)\n' +
        '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
        '\n' +
        '### Nenhum aviso encontrado.'
      );
    });

    test('When the errors span multiple files, a message listing all those errors is returned', () => {
      expect(buildFeedbackMessage(multipleErrorsMultipleFiles, './')).toBe(
        '### Foram encontrados 5 erros.\n' +
        '\n' +
        '#### Arquivo `/frontend/main.css`\n' +
        '\n' +
        '- Linha **5**: Unexpected invalid hex color \"#ye\" (color-no-invalid-hex)\n' +
        '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
        '- Linha **9**: Unexpected unknown unit \"pixels\" (unit-no-unknown)\n' +
        '#### Arquivo `/frontend/sidebar.css`\n' +
        '\n' +
        '- Linha **8**: Unexpected duplicate name serif (font-family-no-duplicate-names)\n' +
        '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
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
      '#### Arquivo `/frontend/main.css`\n' +
      '\n' +
      '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)'
    );
  });

  describe('Multiple warnings are found', () => {
    test('When all warnings are contained in one file, a message listing all those warnings is returned', () => {
      expect(buildFeedbackMessage(multipleWarningsOneFile, './')).toBe(
        '### Nenhum erro encontrado.\n' +
        '### Foram encontrados 2 avisos.\n' +
        '\n' +
        '#### Arquivo `/frontend/main.css`\n' +
        '\n' +
        '- Linha **5**: Unexpected invalid hex color \"#ye\" (color-no-invalid-hex)\n' +
        '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)'
      );
    });

    test('When the warnings span multiple files, a message listing all those warnings is returned', () => {
      expect(buildFeedbackMessage(multipleWarningsMultipleFiles, './')).toBe(
       '### Nenhum erro encontrado.\n' +
       '### Foram encontrados 5 avisos.\n' +
       '\n' +
       '#### Arquivo `/frontend/main.css`\n' +
       '\n' +
       '- Linha **5**: Unexpected invalid hex color \"#ye\" (color-no-invalid-hex)\n' +
       '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
       '- Linha **9**: Unexpected unknown unit \"pixels\" (unit-no-unknown)\n' +
       '' +
       '#### Arquivo `/frontend/sidebar.css`\n' +
       '\n' +
       '- Linha **8**: Unexpected duplicate name serif (font-family-no-duplicate-names)\n' +
       '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)'
      );
    });
  });

  describe('Errors and warnings are found', () => {
    test('When all errors and warnings are contained in one file, a message listing both errors and warnings is returned', () => {
      expect(buildFeedbackMessage(multipleWarningsAndErrorsOneFile, './')).toBe(
        '### Foram encontrados 2 erros.\n' +
        '\n' +
        '#### Arquivo `/frontend/main.css`\n'+
        '\n' +
        '- Linha **9**: Unexpected duplicate name serif (font-family-no-duplicate-names)\n' +
        '- Linha **10**: Unexpected unknown unit \"pixels\" (unit-no-unknown)\n' +
        '\n' +
        '### Foram encontrados 2 avisos.\n' +
        '\n' +
        '#### Arquivo `/frontend/main.css`\n'+
        '\n' +
        '- Linha **5**: Unexpected invalid hex color \"#ye\" (color-no-invalid-hex)\n' +
        '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)'
      );
    });

    test('When errors are in one file and warnings are in another one, a message listing both errors and warnings for those files is returned', () => {
      expect(buildFeedbackMessage(oneErrorOneFileMultipleWarningsAnotherFile, './')).toBe(
        '### Foi encontrado 1 erro.\n' +
        '\n' +
        '#### Arquivo `/frontend/main.css`\n'+
        '\n' +
        '- Linha **5**: Unexpected invalid hex color \"#ye\" (color-no-invalid-hex)\n' +
        '\n' +
        '### Foram encontrados 3 avisos.\n' +
        '\n' +
        '#### Arquivo `/frontend/sidebar.css`\n'+
        '\n' +
        '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
        '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
        '- Linha **9**: Unexpected unknown unit \"pixels\" (unit-no-unknown)'
      );
    });

    test('When errors and warning are in multiple files, a message listing both errors and warnings is returned', () => {
      expect(buildFeedbackMessage(multipleErrosAndWarningsMultipleFiles, './')).toBe(
        '### Foram encontrados 2 erros.\n' +
        '\n' +
        '#### Arquivo `/frontend/main.css`\n'+
        '\n' +
        '- Linha **5**: Unexpected invalid hex color \"#ye\" (color-no-invalid-hex)\n' +
        '' +
        '#### Arquivo `/frontend/sidebar.css`\n'+
        '\n' +
        '- Linha **8**: Unexpected duplicate name serif (font-family-no-duplicate-names)\n' +
        '\n' +
        '### Foram encontrados 3 avisos.\n' +
        '\n' +
        '#### Arquivo `/frontend/main.css`\n'+
        '\n' +
        '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
        '- Linha **9**: Unexpected unknown unit \"pixels\" (unit-no-unknown)\n' +
        '#### Arquivo `/frontend/sidebar.css`\n'+
        '\n' +
        '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)'
      );
    });
  });

  test('The root directory path for the project isn\'t displayed for each file', () => {
    expect(buildFeedbackMessage(multipleErrorsMultipleFiles, '/my-react-project')).toBe(
      '### Foram encontrados 5 erros.\n' +
      '\n' +
      '#### Arquivo `/frontend/main.css`\n' +
      '\n' +
      '- Linha **5**: Unexpected invalid hex color \"#ye\" (color-no-invalid-hex)\n' +
      '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
      '- Linha **9**: Unexpected unknown unit \"pixels\" (unit-no-unknown)\n' +
      '' +
      '#### Arquivo `/frontend/sidebar.css`\n' +
      '\n' +
      '- Linha **8**: Unexpected duplicate name serif (font-family-no-duplicate-names)\n' +
      '- Linha **4**: Unexpected unknown property \"nokey\" (property-no-unknown)\n' +
      '\n' +
      '### Nenhum aviso encontrado.'
    );
  });
});
