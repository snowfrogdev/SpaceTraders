import {
  RxJsonSchema,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxDocument,
  RxCollection,
} from "rxdb";
export const AGENT_SCHEMA_LITERAL = {
  title: "agent schema",
  description: "describes an agent",
  version: 0,
  keyCompression: false,
  primaryKey: "symbol",
  type: "object",
  properties: {
    accountId: {
      type: "string",
      default: "",
    },
    symbol: {
      type: "string",
      default: "",
      minLength: 3,
      maxLength: 14,
    },
    headquarters: {
      type: "string",
      default: "",
    },
    credits: {
      type: "integer",
      default: 0,
    },
    startingFaction: {
      type: "string",
      default: "",
    },
    shipCount: {
      type: "integer",
      default: 0,
    },
  },
  required: ["symbol", "headquarters", "credits", "startingFaction", "shipCount"],
} as const;

const schemaTyped = toTypedRxJsonSchema(AGENT_SCHEMA_LITERAL);
export type RxAgentDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const AGENT_SCHEMA: RxJsonSchema<RxAgentDocumentType> = AGENT_SCHEMA_LITERAL;
export type RxAgentDocument = RxDocument<RxAgentDocumentType>;

export type RxAgentCollection = RxCollection<RxAgentDocumentType>;
