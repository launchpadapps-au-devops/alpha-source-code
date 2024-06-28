import { Policy } from "../entities";

export interface IPolicyService {
  addPolicy(data: Partial<Policy>): Promise<Policy>;
  findActivePolicy(type: string): Promise<Policy>;
}
