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

/**
 * This directive simply updates all of the fields in the form according to the model validations using class-validator (https://github.com/typestack/class-validator).
 * It follows the bootstrap standard to mark fields ans invalid or valid (https://getbootstrap.com/docs/4.0/components/forms/#validation).
 */
@Directive({
  selector: '[appFormValidator]'
})
export class FormValidatorDirective implements AfterViewInit, OnChanges {
  @Input() appFormValidator: Form;
  /**
   * Forces all fields to show valid or invalid even if the user hasn't changed the value.
   */
  @Input() appFormValidatorForce: boolean;
  private _isFormValid: boolean;
  private fieldsWritten: { [name: string]: boolean } = {}; // A dictionary containing data about fields already written

  get appFormValidatorIsFormValid() {
    return this._isFormValid;
  }

  /**
   * Called each time the form is completely valid or invalid.
   *
   * @type {EventEmitter<boolean>}
   * @memberof FormValidatorDirective
   */
  @Output() appFormValidatorIsFormValidChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private inputValueChangeEventFunc: (event) => void;

  constructor(private elementRef: ElementRef<HTMLFormElement>) {
    this.inputValueChangeEventFunc = (event: Event) => {
      const el = event.target as HTMLInputElement;
      const name = el.name;

      if (name) {
        this.fieldsWritten[name] = true;
        this.updateForm();
      }
    };
  }

  ngAfterViewInit(): void {
    // Get all of the form group inputs
    this.getFormGroupInputs().forEach((input: HTMLInputElement) => {
      // Detect when a value was changed in one of the fields
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

  /**
   * Updates a specific element state according to it's validation error.
   * @param el
   * @param error
   */
  updateFormField(el: HTMLInputElement, error?: ValidationError) {
    const name = el.name;
    if (!this.appFormValidatorForce && !this.fieldsWritten[name]) return; // Check if this fields has been written, if not don't update it's validation state until it is
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

  /**
   * Goes through all of the form and checks for any issues, updates all of the fields accordingly.
   */
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

  /**
   * Returns all of the form groups found according to bootstrap standard.
   */
  getFormGroupInputs() {
    const formElement = this.elementRef.nativeElement;
    return formElement.querySelectorAll('.form-group>input');
  }
}
