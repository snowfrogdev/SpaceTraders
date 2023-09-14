import { ContractDeliverGood } from "./contract-deliver-good";
import { ContractPayment } from "./contract-payment";

export type ContractTerms = {
  deadline: string;
  payment: ContractPayment;
  deliver: ContractDeliverGood[];
};
