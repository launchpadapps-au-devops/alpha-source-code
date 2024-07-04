import { Body, Controller, Get, Headers, Param, Post, Put, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@launchpadapps-au/alpha-shared';
import { ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto, bulkUpdateCategoryDto } from './category.dto';

@ApiTags('Category')
@ApiExtraModels(CategoryResponseDto)
@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Category added sucessfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: '1' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/')
    async createCategory(
        @Request() req,
        @Body() payload: Partial<Category>
    ) {
        return this.categoryService.createCategory(payload, req.user);
    }

    @ApiBody({ type: bulkUpdateCategoryDto })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Categories updated sucessfully' },
                data: {
                    type: 'object',
                    properties: {
                        ids: { type: 'string', example: '1,2,3' }
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/bulk')
    async bulkUpdateCategory(
        @Request() req,
        @Body() payload: bulkUpdateCategoryDto
    ) {
        return this.categoryService.bulkUpdateCategory(payload, req.user);
    }

    @ApiParam({
        name: 'id',
        description: 'Category ID',
        type: 'number',
        required: true
    })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Category updated sucessfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: '1' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Put('/:id')
    async updateCategory(
        @Request() req,
        @Param('id') id: number,
        @Body() payload: Partial<Category>
    ) {
        return this.categoryService.updateCategory(id, payload, req.user);
    }


    @ApiParam({
        name: 'id',
        description: 'Category ID',
        type: 'number',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Category fetched sucessfully' },
                data: { type: 'array', items: { $ref: getSchemaPath(CategoryResponseDto) } },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/:id')
    async findCategoryById(
        @Request() req,
        @Param('id') id: number
    ) {
        return this.categoryService.findCategoryById(id);
    }

    @ApiQuery({
        name: 'page',
        type: 'number',
        required: false,
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        type: 'number',
        required: false,
        example: 10,
    })
    @ApiQuery({
        name: 'sortField',
        type: 'string',
        required: false,
        example: 'createdAt',
    })
    @ApiQuery({
        name: 'sortOrder',
        type: 'string',
        required: false,
        example: 'DESC',
    })
    @ApiQuery({
        name: 'searchText',
        type: 'string',
        required: false,
        example: 'Category Name',
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Categories fetched sucessfully' },
                data: { type: 'array', items: { $ref: getSchemaPath(CategoryResponseDto) } },
                meta: {
                    type: 'object',
                    properties: {
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 10 },
                        totalRecords: { type: 'number', example: 1 },
                        totalPages: { type: 'number', example: 1 },
                    },
                },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/')
    async findAllCategories(
        @Request() req
    ) {
        const { page, limit, sortField, sortOrder, searchText } = req.query;
        return this.categoryService.findAllCategories(
            { page, limit },
            { sortField, sortOrder },
            { searchText }
        );
    }

}
