import {
  RxJsonSchema,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxDocument,
  RxCollection,
} from "rxdb";
export const SYSTEM_SCHEMA_LITERAL = {
  title: "system schema",
  description: "describes a system",
  version: 0,
  keyCompression: false,
  primaryKey: "symbol",
  type: "object",
  properties: {
    symbol: {
      type: "string",
      default: "",
      maxLength: 100,
    },
    sectorSymbol: {
      type: "string",
      default: "",
    },
    type: {
      type: "string",
      default: "",
    },
    x: {
      type: "integer",
      default: 0,
    },
    y: {
      type: "integer",
      default: 0,
    },
    waypoints: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          default: "",
        },
        type: {
          type: "string",
          default: "",
        },
        x: {
          type: "integer",
          default: 0,
        },
        y: {
          type: "integer",
          default: 0,
        },
        orbitals: {
          type: "array",
          items: {
            type: "object",
            properties: {
              symbol: {
                type: "string",
                default: "",
              },
            },
          },
        },
        orbits: {
          type: "string",
          default: "",
        },
      },
    },
    factions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            default: "",
          },
        },
      },
    },
  },
  required: ["symbol", "sectorSymbol", "type", "x", "y", "waypoints", "factions"],
} as const;

const schemaTyped = toTypedRxJsonSchema(SYSTEM_SCHEMA_LITERAL);
export type RxSystemDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const SYSTEM_SCHEMA: RxJsonSchema<RxSystemDocumentType> = SYSTEM_SCHEMA_LITERAL;
export type RxSystemDocument = RxDocument<RxSystemDocumentType>;

export type RxSystemCollection = RxCollection<RxSystemDocumentType>;
