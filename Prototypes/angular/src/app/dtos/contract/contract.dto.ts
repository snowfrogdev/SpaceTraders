import { ContractTerms } from "./contract-terms";
import { ContractType } from "./contract-type";

export type ContractDto = {
  id: string;
  factionSymbol: string;
  type: ContractType;
  terms: ContractTerms;
  accepted: boolean;
  fulfilled: boolean;
  deadlineToAccept: string;
};
