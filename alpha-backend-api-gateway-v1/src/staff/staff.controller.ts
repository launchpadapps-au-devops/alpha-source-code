import { Request, Body, Controller, Get, Param, Post, Put, Query, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiHeader, ApiHeaders, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto, StaffResponseDto } from './staff.dto';
import { MessagingService } from '../common/messaging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { Platforms } from 'src/auth/platform.decorator';
import { EnvConfigService } from 'src/common/config/envConfig.service';

function generatePassword(length = 12) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    const allChars = lowercase + uppercase + digits + specialChars;

    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest of the password length with a random mix of all character types
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/;
    if (!regex.test(password)) {
        return generatePassword(length);
    }

    return password;
}

@ApiTags('Staff')
@ApiExtraModels(CreateStaffDto, StaffResponseDto)
@Controller('staff')
export class StaffController {
    constructor(
        private readonly staffService: StaffService,
        private readonly messageService: MessagingService,
        private readonly envConfigService: EnvConfigService
    ) { }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userData: { $ref: getSchemaPath(CreateStaffDto) },
                permissions: { type: 'array', items: { type: 'number' } }
            }
        }
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Staff John Doe has been added successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/')
    async createStaffUserProfile(
        @Request() req,
        @Body() payload: {
            userData: CreateStaffDto,
            permissions: number[]
        }
    ): Promise<object> {
        return this.staffService.createStaffUserProfile(payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'searchText', required: false, type: String })
    @ApiQuery({ name: 'sortField', required: false, type: String })
    @ApiQuery({ name: 'sortOrder', required: false, type: String })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Staff fetched successfully' },
                data: { type: 'array', items: { $ref: getSchemaPath(StaffResponseDto) } },
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
    async getStaffUserProfiles(
        @Request() req,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('sortField') sortField?: string,
        @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
        @Query('searchText') searchText?: string
    ): Promise<object> {
        return this.staffService.getStaffProfiles(
            { page, limit },
            { sortField, sortOrder },
            { searchText },
            req.user
        );
    }

    @ApiTags('Super Admin')
    @ApiHeader({
        description: 'A High Security Token to create a staff Admin',
        name: 'x-request-super-admin-token',
        required: true,
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userData: { $ref: getSchemaPath(CreateStaffDto) },
                permissions: { type: 'array', items: { type: 'number' } }
            }
        }
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Staff John Doe has been added successfully' },
                data: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', example: 'abc@example.com' },
                        password: { type: 'string', example: '123@password' }
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/admin')
    async createStaffAdmin(
        @Request() req,
        @Headers('x-request-super-admin-token') superAdminToken: string,
        @Body() payload: {
            userData: CreateStaffDto,
        }
    ): Promise<object> {
        if (superAdminToken !== this.envConfigService.app.superAdminToken) {
            throw new UnauthorizedException('Not Autorized');
        }

        const staff = await this.staffService.createStaffUserProfile(
            { userData: {
                ...payload.userData,
                userType: 'admin'
            }, permissions: [] },
            req.user
        );

        const password = generatePassword();
        await this.staffService.updateStaffUserProfile(staff.data.id, {
            userData: { password },
            permissions: []
        }, req.user);

        return {
            message: 'Staff Admin has been added successfully',
            data: {
                email: payload.userData.email,
                password
            }
        }

    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'staffId',
        type: 'string',
        description: 'Staff ID',
        required: true,
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Staff John Doe fetched successfully' },
                data: { $ref: getSchemaPath(StaffResponseDto) },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/:staffId')
    async getStaffUserProfile(
        @Request() req,
        @Param('staffId') staffId: string
    ): Promise<object> {
        return this.staffService.getStaffProfile(staffId, req.user);
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'staffId',
        type: 'string',
        description: 'Staff ID',
        required: true,
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userData: { $ref: getSchemaPath(CreateStaffDto) },
                permissions: { type: 'array', items: { type: 'number' } }
            }
        }
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: `Staff John Doe's details has been updated successfully` },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Put('/:staffId')
    async updateStaffUserProfile(
        @Request() req,
        @Param('staffId') staffId: string,
        @Body() payload: {
            userData: Partial<CreateStaffDto>,
            permissions: number[]
        }
    ): Promise<object> {
        return this.staffService.updateStaffUserProfile(
            staffId,
            payload,
            req.user
        );
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'staffId',
        type: 'string',
        description: 'Staff ID',
        required: true,
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Invitation sent successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/:staffId/invite')
    async sendInvitation(
        @Request() req,
        @Param('staffId') staffId: string
    ): Promise<object> {
        const tempPassword = generatePassword();
        const staff =
            await this.staffService.updateStaffUserProfile(staffId, {
                userData: { password: tempPassword },
                permissions: []
            }, req.user);

        const { data } = await this.staffService.getStaffProfile(staffId, req.user);
        await this.messageService.publishToNotification(
            'notification.register',
            {
                recipients: [data.id],
                type: 'email',
                categoryId: 1, // Account Invitation
                subcategoryId: 3, // Staff Invitation
                data: {
                    ...data,
                    tempPassword
                }
            },
        );

        return {
            message: 'Invitation sent successfully',
            data: {
                id: staffId
            }
        };
    }
}