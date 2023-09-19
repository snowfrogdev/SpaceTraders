import {
  RxJsonSchema,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxDocument,
  RxCollection,
} from "rxdb";
export const CONTRACT_SCHEMA_LITERAL = {
  title: "contract schema",
  description: "describes a contract",
  version: 0,
  keyCompression: false,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      default: "",
      maxLength: 100,
    },
    agentSymbol: {
      type: "string",
      default: "",
    },
    factionSymbol: {
      type: "string",
      default: "",
    },
    type: {
      type: "string",
      default: "",
    },
    terms: {
      type: "object",
      properties: {
        deadline: {
          type: "string",
          default: "",
        },
        payment: {
          type: "object",
          properties: {
            onAccepted: {
              type: "integer",
              default: 0,
            },
            onFulfilled: {
              type: "integer",
              default: 0,
            },
          },
          required: ["onAccepted", "onFulfilled"],
        },
        deliver: {
          type: "array",
          items: {
            type: "object",
            properties: {
              tradeSymbol: {
                type: "string",
                default: "",
              },
              destinationSymbol: {
                type: "string",
                default: "",
              },
              unitsRequired: {
                type: "integer",
                default: 0,
              },
              unitsFulfilled: {
                type: "integer",
                default: 0,
              },
            },
            required: ["tradeSymbol", "destinationSymbol", "unitsRequired", "unitsFulfilled"],
          },
        },
      },
      required: ["deadline", "payment", "deliver"],
    },
    accepted: {
      type: "boolean",
      default: false,
    },
    fulfilled: {
      type: "boolean",
      default: false,
    },
    deadlineToAccept: {
      type: "string",
      default: "",
    },
  },
  required: ["id", "agentSymbol", "factionSymbol", "type", "terms", "accepted", "fulfilled"],
} as const;

const schemaTyped = toTypedRxJsonSchema(CONTRACT_SCHEMA_LITERAL);
export type RxContractDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const CONTRACT_SCHEMA: RxJsonSchema<RxContractDocumentType> = CONTRACT_SCHEMA_LITERAL;
export type RxContractDocument = RxDocument<RxContractDocumentType>;

export type RxContractCollection = RxCollection<RxContractDocumentType>;
