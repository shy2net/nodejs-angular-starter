import { ValidationError } from 'class-validator';

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
