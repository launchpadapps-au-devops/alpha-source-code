import { FindOneOptions } from "typeorm";
import { Plan } from "../entities";
import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";

export interface IPlanService {
    createPlan(data: Partial<Plan>): Promise<Plan>;
    findPlanById(id: number): Promise<Plan>;
    findPlanByIds(ids: number[]): Promise<Plan[]>;
    findPlanBy(key: string, value: any): Promise<Plan>;
    findOne(options: FindOneOptions): Promise<Plan>;
    find(options: FindOneOptions): Promise<Plan[]>;
    findAllPlans(
        pagination: PaginationDto,
        sorting: SortingDto,
        filter: GenericFilterDto
    ): Promise<{ data: Plan[]; totalRecords: number; limit?: number; page?: number }>;
    addThemesToPlan(planId: number, themeIds: number[]): Promise<Plan>;
    removeThemesFromPlan(planId: number, themeIds: number[]): Promise<Plan>;
    updatePlanThemes(planId: number, themeIds: number[]): Promise<Plan>;
  }
