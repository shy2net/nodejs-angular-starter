import * as createError from 'http-errors';

export abstract class Form {
  isValid(): boolean {
    return this.getFormIssues().length === 0;
  }

  constructor(formData?: Form) {
    if (formData) {
      Object.assign(this, formData);
    }
  }

  getFormError(): Error {
    let output = `Supplied form is invalid, please fix the following issues:\n`;
    this.getFormIssues()
      .map(issue => `- ${issue.property} - ${issue.error}\n`)
      .forEach(issueStr => (output += issueStr));

    return createError(400, output);
  }

  abstract getFormIssues(): { property: string; error: string }[];
}
