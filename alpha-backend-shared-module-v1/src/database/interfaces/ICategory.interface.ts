import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";
import { Category } from "../entities";

export interface ICategoryService {
  createCategory(data: Partial<Category>): Promise<Category>;
  updateCategory(id: number, data: Partial<Category>): Promise<Category>;
  bulkUpdateCategory(data: Partial<Category>[]): Promise<Category[]>;
  findCategoryById(id: number): Promise<Category>;
  findAllCategories(pagination: PaginationDto, sortingOptions: SortingDto, filters: GenericFilterDto): Promise<{
    data: Category[],
    totalRecords: number,
    limit?: number,
    page?: number
  }>;
}
