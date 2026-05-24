import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export class SchemaValidator {
  static validate<T>(data: unknown, schema: object, label = 'Response'): asserts data is T {
    const validate = ajv.compile(schema);
    if (!validate(data)) {
      const errors = validate.errors?.map(e => `  • ${e.instancePath || '(root)'} ${e.message}`).join('\n');
      throw new Error(`${label} schema validation failed:\n${errors}`);
    }
  }
}

export const userSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id:         { type: 'number' },
        email:      { type: 'string' },
        first_name: { type: 'string' },
        last_name:  { type: 'string' },
      },
      required: ['id', 'email', 'first_name', 'last_name'],
    },
  },
  required: ['data'],
};

export const userListSchema = {
  type: 'object',
  properties: {
    data:     { type: 'array' },
    total:    { type: 'number' },
    page:     { type: 'number' },
    per_page: { type: 'number' },
  },
  required: ['data', 'total'],
};