import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";
import { Theme } from "../entities";

export interface IThemeService {
  createTheme(data: Partial<Theme>): Promise<Theme>;
  updateTheme(id: number, data: Partial<Theme>): Promise<Theme>;
  bulkUpdateTheme(data: Partial<Theme>[]): Promise<Theme[]>;
  findThemeById(id: number): Promise<Theme>;
  findAllThemes(pagination: PaginationDto, sortingOptions: SortingDto, filters: GenericFilterDto): Promise<{
    data: Theme[],
    totalRecords: number,
    limit?: number,
    page?: number
  }>;
}
