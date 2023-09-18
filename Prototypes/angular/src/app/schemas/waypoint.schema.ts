import {
  RxJsonSchema,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxDocument,
  RxCollection,
} from "rxdb";
export const WAYPOINT_SCHEMA_LITERAL = {
  title: "waypoint schema",
  description: "describes a waypoint",
  version: 0,
  keyCompression: false,
  primaryKey: "symbol",
  type: "object",
  properties: {
    symbol: {
      type: "string",
      default: "",
      maxLength: 50,
    },
    type: {
      type: "string",
      default: "",
    },
    systemSymbol: {
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
      default: [],
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
    faction: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          default: "",
        },
      },
    },
    traits: {
      type: "array",
      default: [],
      items: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            default: "",
          },
          name: {
            type: "string",
            default: "",
          },
          description: {
            type: "string",
            default: "",
          },
        },
      },
    },
    chart: {
      type: "object",
      properties: {
        waypointSymbol: {
          type: "string",
          default: "",
        },
        submittedBy: {
          type: "string",
          default: "",
        },
        submittedOn: {
          type: "string",
          default: "",
        },
      },
    },
  },
  required: ["symbol", "type", "systemSymbol", "x", "y", "orbitals", "faction", "traits", "chart"],
} as const;

const schemaTyped = toTypedRxJsonSchema(WAYPOINT_SCHEMA_LITERAL);
export type RxWaypointDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const WAYPOINT_SCHEMA: RxJsonSchema<RxWaypointDocumentType> = WAYPOINT_SCHEMA_LITERAL;
export type RxWaypointDocument = RxDocument<RxWaypointDocumentType>;

export type RxWaypointtCollection = RxCollection<RxWaypointDocumentType>;
