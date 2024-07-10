import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { CreateStaffDto } from './staff.dto';
import { SortOrderType } from '@launchpadapps-au/alpha-shared';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
    constructor(
        private readonly staffService: StaffService
    ) { }

    @Post()
    async createStaffUserProfile(
        @Headers('x-request-userId') reqUserId: string,
        @Body() payload: {
            userData: CreateStaffDto,
            permissions: number[]
        }
    ) {
        const staff = await this.staffService.createStaffUserProfile(
            payload.userData,
            { userId: reqUserId }
        );

        if (payload.permissions.length) {
            await this.staffService.updateStaffPermission(staff.id, payload.permissions, { userId: reqUserId });
        }

        return {
            message: `Staff ${payload.userData.firstName} ${payload.userData.lastName} has been added successfully`,
            data: {
                id: staff.id,
            },
            meta: {}
        };
    }

    @Get('/')
    async getStaffUserProfiles(
        @Headers('x-request-userId') reqUserId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortField') sortField: string = 'updatedAt',
        @Query('sortOrder') sortOrder: SortOrderType = 'DESC',
        @Query('searchText') searchText: string = '',
    ) {
        const response = await this.staffService.getStaffProfiles(
            { page, limit },
            { sortField, sortOrder },
            { searchText }
        );

        return {
            message: 'Staff fetched successfully',
            data: response.data,
            meta: {
                page: response.page,
                limit: response.limit,
                totalRecords: response.totalRecords,
                totalPages: Math.ceil(response.totalRecords / response.limit)
            }
        };
    }

    @Get('/:staffId')
    async getStaffUserProfile(
        @Headers('x-request-userId') reqUserId: string,
        @Param('staffId') staffId: string
    ) {
        const staff = await this.staffService.getStaffProfile(staffId);
        return {
            message: 'Staff fetched successfully',
            data: staff,
            meta: {}
        };
    }

    @Put('/:staffId')
    async updateStaffUserProfile(
        @Headers('x-request-userId') reqUserId: string,
        @Param('staffId') staffId: string,
        @Body() payload: {
            userData: Partial<CreateStaffDto>,
            permissions: number[]
        }
    ) {
        const staff = await this.staffService.updateStaffUserProfile(
            staffId,
            payload.userData,
            { userId: reqUserId }
        );

        if (payload.permissions.length) {
            await this.staffService.updateStaffPermission(staff.id, payload.permissions, { userId: reqUserId });
        }

        return {
            message: `Staff ${staff.firstName} ${staff.lastName} has been updated successfully`,
            data: {
                id: staff.id,
            },
            meta: {}
        };
    }
}