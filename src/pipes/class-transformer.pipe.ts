import { plainToClass } from 'class-transformer';

import { DeserializerPipe, IPipe, ParamMetadata } from '@tsed/common';
import { OverrideProvider } from '@tsed/di';

@OverrideProvider(DeserializerPipe)
export class ClassTransformerPipe implements IPipe {
  transform(value: any, metadata: ParamMetadata) {
    return plainToClass(metadata.type, value);
  }
}
