import {
  RxJsonSchema,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxDocument,
  RxCollection,
} from 'rxdb';
export const USER_SCHEMA_LITERAL = {
  title: 'user schema',
  description: 'describes a user',
  version: 0,
  keyCompression: false,
  primaryKey: 'id',
  type: 'object',
  properties: {
      id: {
          type: 'string',
          default: '',
          maxLength: 100
      },
      userName: {
          type: 'string',
          default: '',
      },
  },
  required: [
      'id',
      'userName',
  ]
} as const;

const schemaTyped = toTypedRxJsonSchema(USER_SCHEMA_LITERAL);
export type RxUserDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const USER_SCHEMA: RxJsonSchema<RxUserDocumentType> = USER_SCHEMA_LITERAL;
export type RxUserDocument = RxDocument<RxUserDocumentType>;

export type RxUserCollection = RxCollection<RxUserDocumentType>;

