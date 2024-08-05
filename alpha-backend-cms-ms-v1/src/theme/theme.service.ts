import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Theme, themeService, habitService, GenericFilterDto, PaginationDto, SortingDto, SortOrderType, userThemeService } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class ThemeService {
    constructor() {}
    
    async createTheme(data: Partial<Theme>, reqUser = { userId: null }): Promise<Theme> {
        const theme = await themeService.createTheme({
            ...data,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId,
        });

        if(data.habits) {
            try {
                await habitService.bulkUpdateHabit(
                    data.habits.map(h => ({
                        ...h,
                        themeId: theme.id,
                        createdBy: reqUser.userId,
                        updatedBy: reqUser.userId,
                    })),
                );
            }
            catch(err) {
                Logger.error(err);
            }
        }

        return theme;
    }
    
    async updateTheme(id: number, data: Partial<Theme>, reqUser = { userId: null }): Promise<Theme> {
        // check if theme already used in userTheme
        const userThemes = await userThemeService.findUserThemeByThemeId(id);
        if(userThemes?.length) {
            //throw new Error(`Theme with id ${id} is already used in userThemes`);
        }

        const theme = await themeService.updateTheme(id, {
            ...data,
            updatedBy: reqUser.userId,
        });

        if(data.habits) {
            try {
                await habitService.bulkUpdateHabit(
                    data.habits.map(h => ({
                        ...h,
                        themeId: theme.id,
                        createdBy: reqUser.userId,
                        updatedBy: reqUser.userId,
                    })),
                );
            } catch (error) {
                Logger.error(error);
            }
        }

        return theme;
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
        const theme = await themeService.findThemeById(id);
        if(!theme) {
            throw new NotFoundException(`Theme with id ${id} not found`);
        }

        return theme;
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
