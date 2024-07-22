import { Any, FindManyOptions, FindOneOptions, ILike, Repository } from "typeorm";
import { DatabaseModule } from "../index";
import { PaginationDto } from "../dto/pagination.dto";
import { SortingDto } from "../dto/sorting.dto";
import { GenericFilterDto } from "../dto/filter.dto";
import { Plan } from "../entities";
import { themeService } from "./theme.service";
import { IPlanService } from "../interfaces/IPlanService.interface";

class PlanService  implements IPlanService {
  static get planRepository(): Repository<Plan> {
    return DatabaseModule.getRepository(Plan);
  }

  static get relations() {
    return ['themes', 'themes.lessons', 'createdBy', 'updatedBy']
  }

  async createPlan(data: Partial<Plan>): Promise<Plan> {
    const plan = new Plan();

    Object.assign(plan, data);
    await PlanService.planRepository.save(plan);
    return this.findPlanById(plan.id);
  }

  async findPlanById(id: number): Promise<Plan> {
    return PlanService.planRepository.findOne({
      relations:  PlanService.relations,
      where: { id }
    });
  }

  async findPlanByIds(ids: number[]): Promise<Plan[]> {
    return PlanService.planRepository.find({
      relations: PlanService.relations,
      where: {
        id: Any(ids)
      }
    });
  }

  async findPlanBy(key: string, value: any): Promise<Plan> {
    return PlanService.planRepository.findOne({
      relations: PlanService.relations,
      where: { [key]: value }
    });
  }

  async findOne(options: FindOneOptions): Promise<Plan> {
    return PlanService.planRepository.findOne(options);
  }

  async find(options: FindManyOptions): Promise<Plan []> {
    return PlanService.planRepository.find(options);
  }

  async findAllPlans(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sortOptions: SortingDto = { sortField: 'updatedAt', sortOrder: 'DESC' },
    filters: GenericFilterDto = {},
  ): Promise<{
    data: Plan[],
    totalRecords: number
    limit?: number,
    page?: number
  }> {

    const { searchText, ...restFilters } = filters;
    const [data, totalRecords] = await PlanService.planRepository.findAndCount({
      relations: PlanService.relations,
      where: {
        ...(searchText ? { name: ILike(`%${searchText}%`) } : {}),
        ...restFilters
      },
      order: {
        [sortOptions.sortField]: sortOptions.sortOrder
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    });

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page
    };
  }

  async updatePlan(id: number, data: Partial<Plan>): Promise<Plan> {
    const user = await this.findPlanById(id);
    Object.assign(user, data);
    await PlanService.planRepository.save(user);
    return this.findPlanById(id);
  }

  async addThemesToPlan(planId: number, themeIds: number[]): Promise<Plan> {
    const plan = await this.findPlanById(planId);
    const themes = await themeService.findThemeByIds(themeIds);
    plan.themes = [...plan.themes, ...themes];
    return PlanService.planRepository.save(plan);
  }

  async removeThemesFromPlan(planId: number, themesIds: number[]): Promise<Plan> {
    const plan = await PlanService.planRepository.findOne({
      where: { id: planId },
      relations: ['themes'],
    });

    plan.themes = plan.themes.filter(
      (theme) => !themesIds.includes(theme.id),
    );

    return PlanService.planRepository.save(plan);
  }

  async updatePlanThemes(planId: number, themeIds: number[]): Promise<Plan> {
    const plan = await this.findPlanById(planId);
    const themes = await themeService.findThemeByIds(themeIds);
    plan.themes = themes;
    return PlanService.planRepository.save(plan);
  }
}

export const planService = new PlanService();