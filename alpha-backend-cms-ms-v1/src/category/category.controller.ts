import { Body, Controller, Get, Headers, Param, Post, Put, Query, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category, SortOrderType } from '@launchpadapps-au/alpha-shared';
import { response } from 'express';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    async createCategory(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<Category>
    ) {
        const category = await this.categoryService.createCategory(data, { userId: reqUserId });
        return {
            message: `Category ${data.name} created successfully`,
            data: category,
        }
    }

    @Post('/bulk')
    async bulkUpdateCategory(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<Category>[]
    ) {
        const categories = await this.categoryService.bulkUpdateCategory(data, { userId: reqUserId });
        return {
            message: `${categories.length} categories added/updated successfully`,
            data: {
                ids: categories.map(c => c.id).join(','),
            },
        }
    }

    @Put('/:categoryId')
    async updateCategory(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<Category>,
        @Param('categoryId') categoryId: number
    ) {
        const category = await this.categoryService.updateCategory(categoryId, data);
        return {
            message: `Category ${category.name} updated successfully`,
            data: category,
        }
    }

    @Get('/:categoryId')
    async findCategoryById(
        @Headers('x-request-userId') reqUserId: string,
        @Param('categoryId') categoryId: number
    ) {
        const category = await this.categoryService.findCategoryById(categoryId);
        return {
            message: `Category ${category.name} fetched successfully`,
            data: category,
        }
    }

    @Get()
    async findAllCategories(
        @Headers('x-request-userId') reqUserId: string,
        @Request() req
    ) {
        const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'DESC', ...filters } = req.query;
        const repsonse = await this.categoryService.findAllCategories(
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
            message: `Categories fetched successfully`,
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
