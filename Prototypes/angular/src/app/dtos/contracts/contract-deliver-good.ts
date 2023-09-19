import { TradeSymbol } from "../trade-symbol";

export type ContractDeliverGood = {
  tradeSymbol: TradeSymbol;
  destinationSymbol: string;
  unitsRequired: number;
  unitsFulfilled: number;
};
