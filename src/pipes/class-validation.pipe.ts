import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { IPipe, OverrideProvider, ParamMetadata, ValidationPipe } from '@tsed/common';

// Based on: https://tsed.io/docs/validation.html#custom-validation

/**
 * A pipe which validates using built in ts.Ed validation using class-validator.
 */
@OverrideProvider(ValidationPipe)
export class ClassValidationPipe extends ValidationPipe
  implements IPipe<unknown> {
  async transform(value: unknown, metadata: ParamMetadata): Promise<unknown> {
    // Apply super validations if required
    value = super.transform(value, metadata);

    if (!this.shouldValidate(metadata)) {
      // there is no type and collectionType
      return value;
    }

    const object = plainToClass(metadata.type, value);
    const errors = await validate(object);

    // We handle this errors array on the global error handling middleware
    if (errors.length > 0) throw errors;

    return value;
  }

  protected shouldValidate(metadata: ParamMetadata): boolean {
    const types: unknown[] = [String, Boolean, Number, Array, Object];

    return !super.shouldValidate(metadata) || !types.includes(metadata.type);
  }
}
