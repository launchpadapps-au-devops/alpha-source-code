import { Body, Controller, Get, Headers, Param, Post, Put, Request } from '@nestjs/common';
import { Theme } from '@launchpadapps-au/alpha-shared';
import { SortOrderType } from '@launchpadapps-au/alpha-shared';
import { ThemeService } from './theme.service';

@Controller('theme')
export class ThemeController {
    constructor(
        private readonly themeService: ThemeService
    ) { }

    @Post()
    async createTheme(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<Theme>
    ) {
        const theme = await this.themeService.createTheme(data, { userId: reqUserId });
        return {
            message: `Theme ${data.name} created successfully`,
            data: {
                id: theme.id,
            },
        }
    }

    @Post('/bulk')
    async bulkUpdateTheme(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<Theme>[]
    ) {
        const themes = await this.themeService.bulkUpdateTheme(data, { userId: reqUserId });
        return {
            message: `${themes.length} themes added/updated successfully`,
            data: {
                ids: themes.map(c => c.id).join(','),
            },
        }
    }

    @Put('/:themeId')
    async updateTheme(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<Theme>,
        @Param('themeId') themeId: number
    ) {
        const theme = await this.themeService.updateTheme(themeId, data, { userId: reqUserId });
        return {
            message: `Theme ${theme.name} updated successfully`,
            data: {
                id: theme.id,
            },
        }
    }

    @Get('/:themeId')
    async findThemeById(
        @Headers('x-request-userId') reqUserId: string,
        @Param('themeId') themeId: number
    ) {
        const theme = await this.themeService.findThemeById(themeId);
        return {
            message: `Theme ${theme.name} fetched successfully`,
            data: theme,
        }
    }

    @Get()
    async findAllThemes(
        @Headers('x-request-userId') reqUserId: string,
        @Request() req
    ) {
        const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'DESC', ...filters } = req.query;
        const repsonse = await this.themeService.findAllThemes(
            {
                page: Number(page),
                limit: Number(limit),
            },
            {
                sortField,
                sortOrder: sortOrder as SortOrderType
            },
            { 
                ...filters,
            }
        );
        return {
            message: `Themes fetched successfully`,
            data: repsonse.data,
            meta: {
                page: repsonse.page,
                limit: repsonse.limit,
                totalRecords: repsonse.totalRecords,
                totalPages: Math.ceil(repsonse.totalRecords / repsonse.limit)
            }
        }
    }
}
