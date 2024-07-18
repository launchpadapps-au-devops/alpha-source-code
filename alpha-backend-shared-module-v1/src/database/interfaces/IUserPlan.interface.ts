import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";
import { UserPlan } from "../entities";

export interface IUserPlanService {
  createUserPlan(data: Partial<UserPlan>): Promise<UserPlan>;
  updateUserPlan(id: string, data: Partial<UserPlan>): Promise<UserPlan>;
  findUserPlanById(id: string): Promise<UserPlan>;
  findUserPlanByIds(ids: string[]): Promise<UserPlan[]>;
  findAllUserPlans(pagination: PaginationDto, sorting: SortingDto, filters: GenericFilterDto): Promise<{
    data: UserPlan[],
    totalRecords: number,
    limit?: number,
    page?: number
  }>;
}