import {  Not, Repository, ILike, FindManyOptions } from "typeorm";
import { DatabaseModule } from "../index";
import { ICategoryService } from "../interfaces/ICategory.interface";
import { Category } from "../entities/category.entity";
import { NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";

class CategoryService implements ICategoryService {
  static get categoryRepository(): Repository<Category> {
    return DatabaseModule.getRepository(Category);
  }


  #formatCategoryData(data: Partial<Category>) {
    return ({
      ...data,
      createdBy: data.createdBy || null,
      updatedBy: data.updatedBy || null
    });
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const category = new Category();
    Object.assign(category, data);
    await CategoryService.categoryRepository.save(category);
    return category;
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const category = await CategoryService.categoryRepository.findOne({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    Object.assign(category, data);
    await CategoryService.categoryRepository.save(category);
    return category;
  }

  async bulkUpdateCategory(data: Partial<Category>[]): Promise<Category[]> {
    return CategoryService.categoryRepository.save(data);
  }

  async findCategoryById(id: number): Promise<Category> {
    return CategoryService.categoryRepository.findOne({
      where: { id }
    });
  }

  async findAllCategories(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: Category[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, ...restFilters } = filters;

    const where: any = {
      ...(searchText ? { name: ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<Category> = {
      where,
      relations: ['createdBy', 'updatedBy'],
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };

    const [data, totalRecords] = await CategoryService.categoryRepository.findAndCount(findOptions);

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page,
    };
  }

}

export const categoryService = new CategoryService();