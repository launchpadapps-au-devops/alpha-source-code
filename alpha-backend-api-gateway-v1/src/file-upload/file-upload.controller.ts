import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { Platforms } from 'src/auth/platform.decorator';

@ApiTags('File Upload')
@Controller('file')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File to upload',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
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
                        url: { type: 'string', example: 'https://example.com/patient-john-doe' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const url = await this.fileUploadService.uploadFile(file);
        return {
            message: 'File uploaded successfully',
            data: { url },
        }
    }
}
