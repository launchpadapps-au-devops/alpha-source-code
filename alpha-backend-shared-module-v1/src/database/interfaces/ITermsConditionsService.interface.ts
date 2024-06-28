import { TermsConditions } from "../entities";

export interface ITermsConditionsService {
  addTermsConditions(data: Partial<TermsConditions>): Promise<TermsConditions>;
  findActiveTermsConditions(): Promise<TermsConditions>;
}
