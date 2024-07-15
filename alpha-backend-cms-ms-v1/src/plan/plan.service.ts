import { Injectable } from '@nestjs/common';
import { GenericFilterDto, PaginationDto, SortingDto, Plan, planService } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class PlanService {
    constructor() { }

    async createPlan(data: Partial<Plan>): Promise<Plan> {
        return planService.createPlan(data);
    }

    async findPlanById(id: number): Promise<Plan> {
        return planService.findPlanById(id);
    }

    async findPlanByIds(ids: number[]): Promise<Plan[]> {
        return planService.findPlanByIds(ids);
    }

    async findPlanBy(key: string, value: any): Promise<Plan> {
        return planService.findPlanBy(key, value);
    }

    async findAllPlans(
        page: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'updatedAt', sortOrder: 'DESC' },
        filters: GenericFilterDto = {}
    ): Promise<{ data: Plan[], totalRecords: number, page?: number, limit?: number }> {
        return planService.findAllPlans(page, sorting, filters);
    }

    async updatePlan(id: number, data: Partial<Plan>): Promise<Plan> {
        return planService.updatePlan(id, data);
    }

    async addThemesToPlan(planId: number, themeIds: number[]): Promise<Plan> {
        return planService.addThemesToPlan(planId, themeIds);
    }

    async removeThemesFromPlan(planId: number, themeIds: number[]): Promise<Plan> {
        return planService.removeThemesFromPlan(planId, themeIds);
    }

    async updatePlanThemes(planId: number, themeIds: number[]): Promise<Plan> {
        return planService.updatePlanThemes(planId, themeIds);
    }
}
