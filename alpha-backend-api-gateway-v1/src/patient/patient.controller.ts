import { Request, Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDetailsDto, PatientResponseDto } from './patient.dto';
import { MessagingService } from '../common/messaging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { POLICY_TYPES, PolicyType, USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { Platforms } from 'src/auth/platform.decorator';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';

@ApiTags('Patient')
@ApiExtraModels(PatientResponseDto)

@Controller('patient')
export class PatientController {
    constructor(
        private readonly patientService: PatientService,
        private readonly messageService: MessagingService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiBody({ type: CreatePatientDetailsDto })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Patient John Doe has been added successfully' },
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
    async createPatientUserProfile(
        @Request() req,
        @Body() payload: CreatePatientDetailsDto
    ): Promise<object> {
        return await this.patientService.createPatientUserProfile(payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'searchKey', required: false, type: String })
    @ApiQuery({ name: 'searchValue', required: false, type: String })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Patients fetched successfully' },
                data: { type: 'array', items: { $ref: getSchemaPath(PatientResponseDto) } },
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
    async getPatients(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('searchKey') searchKey?: string,
        @Query('searchValue') searchValue?: string
    ): Promise<object> {
        return await this.patientService.getPatientUserProfiles({
            page: isNaN(page) ? 1 : page,
            limit: isNaN(limit) ? 10 : limit,
            searchKey,
            searchValue
        },
            req.user
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Your profile fetched successfully' },
                data: { $ref: getSchemaPath(PatientResponseDto) },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/my-profile/')
    async getPatientOwnProfile(
        @Request() req,
    ): Promise<object> {
        return await this.patientService.getPatientUserProfile(req.user.userId, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Patient ID',
        required: true,
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Patient John Doe fetched successfully' },
                data: { $ref: getSchemaPath(PatientResponseDto) },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/:id')
    async getPatientUserProfile(
        @Request() req,
        @Param('id') id: string
    ): Promise<object> {
        return await this.patientService.getPatientUserProfile(id, req.user);
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Patient ID',
        required: true,
    })
    @ApiBody({ type: CreatePatientDetailsDto })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: `Patient John Doe's details has been updated successfully` },
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
    @Put('/:id')
    async updatePatientUserProfile(
        @Request() req,
        @Param('id') id: string,
        @Body() payload: CreatePatientDetailsDto
    ): Promise<object> {
        return await this.patientService.updatePatientUserProfile(id, payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Patient ID',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
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
    @Post('/:id/invite')
    async sendInvitation(
        @Request() req,
        @Param('id') id: string
    ): Promise<object> {
        const tempPassword = generatePassword();
        await this.patientService.updatePatientUserProfile(id, { password: tempPassword }, req.user);
        const { data } = await this.patientService.getPatientUserProfile(id, req.user);
        await this.messageService.publishToNotification(
            'notification.register',
            {
                recipients: [data.id],
                type: 'email',
                categoryId: 1, // Account Invitation
                subcategoryId: 1, // Patient Invitation
                data: {
                    ...data,
                    tempPassword
                }
            },
        );

        return {
            message: 'Invitation sent successfully',
            data: {
                id
            }
        };
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiParam({
        name: 'policyType',
        type: 'string',
        description: 'Policy Type',
        enum: POLICY_TYPES,
        required: true,
    })
    @ApiParam({
        name: 'version',
        type: 'string',
        description: 'Policy Version',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Terms and Condition accepted sucessfully' },
                data: null
            },
            required: ['statusCode', 'data'],
        },
    })
    @Put('/accept/:policyType/:version')
    async acceptTerms(
        @Request() req,
        @Param('policyType') policyType: PolicyType,
        @Param('version') termsVersion: string
    ): Promise<object> {
        return this.patientService.acceptTerms(req.user.userId, policyType, termsVersion, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiParam({
        name: 'policyType',
        type: 'string',
        description: 'Policy Type',
        enum: POLICY_TYPES,
        required: true,
    })
    @ApiParam({
        name: 'version',
        type: 'string',
        description: 'Policy Version',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Terms and Condition accepted sucessfully' },
                data: null
            },
            required: ['statusCode', 'data'],
        },
    })
    @Put('/revoke/:policyType/:version/acceptance')
    async revokeTermsAcceptance(
        @Request() req,
        @Param('policyType') policyType: PolicyType,
        @Param('version') termsVersion: string
    ): Promise<object> {
        return this.patientService.revokeTermsAcceptance(req.user.userId, policyType, termsVersion, req.user);
    }
}

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