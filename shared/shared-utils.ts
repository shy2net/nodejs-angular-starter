import { ValidationError } from 'class-validator';

export function getFormValidationErrorText(errors: Array<ValidationError>) {
  let output = `Supplied form is invalid, please fix the following issues:\n`;
  errors.map(issue => getTextualValidationError(issue)).forEach(issueStr => (output += issueStr));

  return output;
}

export function getTextualValidationError(error: ValidationError): string {
  let output = `${error.property}:\n`;

  if (error.constraints) {
    Object.keys(error.constraints).forEach(constraint => {
      output += '- ' + error.constraints[constraint] + '\n';
    });
  }

  if (error.children && error.children.length > 0) {
    for (const child of error.children) output += this.getTextualValidationError(child) + '\n';
  }

  return output;
}
