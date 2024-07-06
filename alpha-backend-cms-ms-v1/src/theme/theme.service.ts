import { Injectable } from '@nestjs/common';
import { Theme, themeService, GenericFilterDto, PaginationDto, SortingDto, SortOrderType } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class ThemeService {
    constructor() {}
    
    async createTheme(data: Partial<Theme>, reqUser = { userId: null }): Promise<Theme> {
        return themeService.createTheme({
            ...data,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId,
        });
    }
    
    async updateTheme(id: number, data: Partial<Theme>, reqUser = { userId: null }): Promise<Theme> {
        return themeService.updateTheme(id, {
            ...data,
            updatedBy: reqUser.userId,
        });
    }
    
    async bulkUpdateTheme(data: Partial<Theme>[], reqUser = { userId: null }): Promise<Theme[]> {
        return themeService.bulkUpdateTheme(
            data.map(t => ({
                ...t,
                ...(!t.id ? { createdBy: reqUser.userId } : {}),
                updatedBy: reqUser.userId,
            })),
        );
    }
    
    async findThemeById(id: number): Promise<Theme> {
        return themeService.findThemeById(id);
    }
    
    async findAllThemes(
        pagination: PaginationDto,
        sortingOptions: SortingDto,
        filters: GenericFilterDto,
    ): Promise<{
        data: Theme[];
        totalRecords: number;
        limit?: number;
        page?: number;
    }> {
        return themeService.findAllThemes(pagination, sortingOptions, filters);
    }
}
