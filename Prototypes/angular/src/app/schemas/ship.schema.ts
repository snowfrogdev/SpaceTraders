import {
  RxJsonSchema,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxDocument,
  RxCollection,
} from "rxdb";
export const SHIP_SCHEMA_LITERAL = {
  title: "ship schema",
  description: "describes a ship",
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
    agentSymbol: {
      type: "string",
      default: "",
      minLength: 3,
      maxLength: 14,
    },
    registration: {
      type: "object",
      properties: {
        name: {
          type: "string",
          default: "",
        },
        factionSymbol: {
          type: "string",
          default: "",
        },
        role: {
          type: "string",
          default: "",
        },
      },
    },
    nav: {
      type: "object",
      properties: {
        systemSymbol: { type: "string" },
        waypointSymbol: { type: "string" },
        route: {
          type: "object",
          properties: {
            destination: {
              type: "object",
              properties: {
                symbol: { type: "string" },
                type: { type: "string" },
                systemSymbol: { type: "string" },
                x: { type: "integer" },
                y: { type: "integer" },
              },
            },
            departure: {
              type: "object",
              properties: {
                symbol: { type: "string" },
                type: { type: "string" },
                systemSymbol: { type: "string" },
                x: { type: "integer" },
                y: { type: "integer" },
              },
            },
            origin: {
              type: "object",
              properties: {
                symbol: { type: "string" },
                type: { type: "string" },
                systemSymbol: { type: "string" },
                x: { type: "integer" },
                y: { type: "integer" },
              },
            },
            departureTime: { type: "string" },
            arrival: { type: "string" },
          },
        },
        status: { type: "string" },
        flightMode: { type: "string" },
      },
    },
    crew: {
      type: "object",
      properties: {
        current: { type: "integer" },
        required: { type: "integer" },
        capacity: { type: "integer" },
        rotation: { type: "string" },
        morale: { type: "integer" },
        wages: { type: "integer" },
      },
    },
    frame: {
      type: "object",
      properties: {
        symbol: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        condition: { type: "integer" },
        moduleSlots: { type: "integer" },
        mountingPoints: { type: "integer" },
        fuelCapacity: { type: "integer" },
        requirements: {
          type: "object",
          properties: {
            power: { type: "integer" },
            crew: { type: "integer" },
            slots: { type: "integer" },
          },
        },
      },
    },
    reactor: {
      type: "object",
      properties: {
        symbol: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        condition: { type: "integer" },
        powerOutput: { type: "integer" },
        requirements: {
          type: "object",
          properties: {
            power: { type: "integer" },
            crew: { type: "integer" },
            slots: { type: "integer" },
          },
        },
      },
    },
    engine: {
      type: "object",
      properties: {
        symbol: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        condition: { type: "integer" },
        speed: { type: "integer" },
        requirements: {
          type: "object",
          properties: {
            power: { type: "integer" },
            crew: { type: "integer" },
            slots: { type: "integer" },
          },
        },
      },
    },
    cooldown: {
      type: "object",
      properties: {
        shipSymbol: { type: "string" },
        totalSeconds: { type: "integer" },
        remainingSeconds: { type: "integer" },
        expiration: { type: "string" },
      },
    },
    modules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          symbol: { type: "string" },
          capacity: { type: "integer" },
          range: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          requirements: {
            type: "object",
            properties: {
              power: { type: "integer" },
              crew: { type: "integer" },
              slots: { type: "integer" },
            },
          },
        },
      },
    },
    mounts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          symbol: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          strength: { type: "integer" },
          deposits: { type: "array", items: { type: "string" } },
          requirements: {
            type: "object",
            properties: {
              power: { type: "integer" },
              crew: { type: "integer" },
              slots: { type: "integer" },
            },
          },
        },
      },
    },
    cargo: {
      type: "object",
      properties: {
        capacity: { type: "integer" },
        units: { type: "integer" },
        inventory: {
          type: "array",
          items: {
            type: "object",
            properties: {
              symbol: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              units: { type: "integer" },
            },
          },
        },
      },
    },
    fuel: {
      type: "object",
      properties: {
        current: { type: "integer" },
        capacity: { type: "integer" },
        consumed: {
          type: "object",
          properties: {
            amount: { type: "integer" },
            timestamp: { type: "string" },
          },
        },
      },
    },
  },
  required: [
    "symbol",
    "agentSymbol",
    "registration",
    "nav",
    "crew",
    "frame",
    "reactor",
    "engine",
    "cooldown",
    "modules",
    "mounts",
    "cargo",
    "fuel",
  ],
} as const;

const schemaTyped = toTypedRxJsonSchema(SHIP_SCHEMA_LITERAL);
export type RxShipDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const SHIP_SCHEMA: RxJsonSchema<RxShipDocumentType> = SHIP_SCHEMA_LITERAL;
export type RxShipDocument = RxDocument<RxShipDocumentType>;

export type RxShipCollection = RxCollection<RxShipDocumentType>;
