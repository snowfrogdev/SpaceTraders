import { FactionSymbol } from "./faction-symbol";
import { FactionTrait } from "./faction-trait";

export type FactionDto = {
  symbol: FactionSymbol;
  name: string;
  description: string;
  headquarters: string;
  traits: FactionTrait[];
  isRecruiting: boolean;
};
