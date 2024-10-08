import { Body, Controller, Get, Headers, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category, USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto, bulkUpdateCategoryDto } from './category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Platforms } from 'src/auth/platform.decorator';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';

@ApiTags('Category')
@ApiExtraModels(CategoryResponseDto)
@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
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

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
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

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
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

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
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

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiQuery({
        name: 'status',
        type: 'string',
        required: false,
        enum: ['ACTIVE', 'ARCHIVE'],
    })
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
        const { page, limit, sortField, sortOrder, searchText, status } = req.query;
        return this.categoryService.findAllCategories(
            { page, limit },
            { sortField, sortOrder },
            { searchText, status }
        );
    }

}
