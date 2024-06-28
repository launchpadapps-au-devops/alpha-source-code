import { Request, Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDetailsDto, PatientResponseDto } from './patient.dto';
import { MessagingService } from '../common/messaging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Patient')
@ApiExtraModels(PatientResponseDto)

@Controller('patient')
export class PatientController {
    constructor(
        private readonly patientService: PatientService,
        private readonly messageService: MessagingService
    ) { }

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
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('searchKey') searchKey?: string,
        @Query('searchValue') searchValue?: string
    ): Promise<object> {
        return await this.patientService.getPatientUserProfiles({
            page,
            limit,
            searchKey,
            searchValue
        },
            req.user
        );
    }

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

    // send invitation to patient
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
        const tempPassword = Math.random().toString(36).slice(-8);
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
    @ApiParam({
        name: 'termsVersion',
        type: 'string',
        description: 'Terms Version',
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
    @UseGuards(JwtAuthGuard)
    @Roles('patient')
    @Put('/accept-terms/:termsVersion')
    async acceptTerms(
        @Request() req,
        @Param('termsVersion') termsVersion: string
    ): Promise<object> {
        return this.patientService.acceptTerms(req.user.userId, termsVersion, req.user);
    }
}
