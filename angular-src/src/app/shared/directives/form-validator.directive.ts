import { ValidationError } from 'class-validator';

import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { Form } from '../../../../../shared/models/forms/form';

@Directive({
  selector: '[appFormValidator]'
})
export class FormValidatorDirective implements AfterViewInit, OnChanges {
  @Input() appFormValidator: Form;
  private _isFormValid: boolean;

  get appFormValidatorIsFormValid() {
    return this._isFormValid;
  }

  @Output() appFormValidatorIsFormValidChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private inputValueChangeEventFunc: (event) => void;

  constructor(private elementRef: ElementRef<HTMLFormElement>) {
    this.inputValueChangeEventFunc = (event: Event) => {
      const el = event.target as HTMLInputElement;
      const name = el.name;

      if (name) this.updateForm();
    };
  }

  ngAfterViewInit(): void {
    this.getFormGroupInputs().forEach((input: HTMLInputElement) => {
      input.addEventListener('input', this.inputValueChangeEventFunc);

      // Add Description text field if not exists
      const next = input.nextElementSibling as HTMLElement;
      if (!next) {
        const div = document.createElement('div');
        div.className = 'input-description-validation';
        input.parentElement.appendChild(div);
      } else next.classList.add('input-description-validation');
    });

    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('appFormValidator' in changes) this.updateForm();
  }

  updateFormField(el: HTMLInputElement, error?: ValidationError) {
    const name = el.name;
    el.classList.remove('is-valid', 'is-invalid');
    el.classList.add(error ? 'is-invalid' : 'is-valid');

    const validationDesc = el.nextElementSibling;

    if (validationDesc) {
      validationDesc.classList.remove('invalid-feedback', 'valid-feedback');
      validationDesc.classList.add(error ? 'invalid-feedback' : 'valid-feedback');
      validationDesc.innerHTML = null;

      if (error) {
        let errHTML = `<ul>`;
        for (const key of Object.keys(error.constraints)) {
          const constraint = error.constraints[key];
          errHTML += `<li>${constraint}</li>`;
        }

        errHTML += `</ul>`;
        validationDesc.innerHTML = errHTML;
      }
    }
  }

  updateForm(): Promise<boolean> {
    const prevIsFormValid = this._isFormValid;
    this._isFormValid = true;

    return this.appFormValidator.getFormIssues().then(results => {
      this.getFormGroupInputs().forEach((input: HTMLInputElement) => {
        const name = input.name;
        const validationError = results.find(result => result.property === name);
        this.updateFormField(input, validationError);

        if (validationError) this._isFormValid = false;
      });

      if (prevIsFormValid !== this._isFormValid)
        this.appFormValidatorIsFormValidChange.emit(this._isFormValid);

      return this._isFormValid;
    });
  }

  getFormGroupInputs() {
    const formElement = this.elementRef.nativeElement;
    return formElement.querySelectorAll('.form-group>input');
  }
}
