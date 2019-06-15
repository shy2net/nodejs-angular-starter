import { validate, ValidationError } from 'class-validator';
import { getTextualValidationError, getFormValidationErrorText } from '../../shared-utils';

export abstract class Form {
  async isValid(): Promise<boolean> {
    return (await this.getFormIssues()).length === 0;
  }

  constructor(formData?: Form) {
    if (formData) Object.assign(this, formData);
  }

  async getFormError(): Promise<Error> {
    let output = `Supplied form is invalid, please fix the following issues:\n`;
    const formIssues = await this.getFormIssues();
    if (!formIssues) return null;
    formIssues.map(issue => getTextualValidationError(issue)).forEach(issueStr => (output += issueStr));

    return new Error(getFormValidationErrorText(await this.getFormIssues());
  }

  toJson(): Promise<any> {
    return Promise.resolve(this);
  }

  async getFieldIssue(field: string): Promise<ValidationError> {
    const issues = await this.getFormIssues();
    return issues.find(issue => issue.property === field);
  }

  getFormIssues(): Promise<ValidationError[]> {
    return validate(this);
  }
}
