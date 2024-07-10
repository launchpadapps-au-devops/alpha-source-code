import { ILike, Repository } from "typeorm";
import { DatabaseModule } from "../index";
import { DailyTips } from "../entities";
import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";
import { IDailyTipsService } from "../interfaces/IDailyTipsService.interface";
import { BadRequestException } from "@nestjs/common";

class DailyTipsService implements IDailyTipsService {
  static get dailyTipsRepository(): Repository<DailyTips> {
    return DatabaseModule.getRepository(DailyTips);
  }

  async addDailyTips(
    data: Partial<DailyTips>,
    position?: 'above' | 'below',
    referenceTipId?: number
  ): Promise<DailyTips> {
    return DailyTipsService.dailyTipsRepository.manager.transaction(async transactionalEntityManager => {
      if (referenceTipId && position) {
        const referenceTip = await transactionalEntityManager.findOneBy(DailyTips, { id: referenceTipId });
        if (!referenceTip) {
          throw new Error('Reference tip not found');
        }

        let newDay = referenceTip.day;

        if(position === 'above' && referenceTip.day === 1) {
          throw new BadRequestException('Cannot add a tip above the first tip');
        }

        if (position === 'below') {
          newDay = referenceTip.day + 1;
        }

        await transactionalEntityManager
          .createQueryBuilder()
          .update(DailyTips)
          .set({ day: () => `day + 1` })
          .where('day >= :newDay', { newDay: position === 'above' ? referenceTip.day : newDay })
          .execute();

        const newTip = new DailyTips();
        Object.assign(newTip, {
          ...data,
          day: position === 'above' ? referenceTip.day : newDay,
          createdBy: data.updatedBy,
        });

        return await transactionalEntityManager.save(DailyTips, newTip);
      } else {
        const existingTip = await DailyTipsService.dailyTipsRepository.findOneBy({
          day: data.day,
          status: 'ACTIVE'
        });

        if (existingTip) {
          data.version = existingTip.version + 1;
          existingTip.status = 'ARCHIVE';
          existingTip.updatedBy = data.updatedBy;
          await DailyTipsService.dailyTipsRepository.save(existingTip);
        }

        const dailyTips = new DailyTips();
        Object.assign(dailyTips, {
          ...data,
          createdBy: data.updatedBy,
        });

        return DailyTipsService.dailyTipsRepository.save(dailyTips);
      }
    });
  }

  async findDailyTipsByDay(day: number): Promise<DailyTips> {
    return DailyTipsService.dailyTipsRepository.findOne({
      where: { day, status: 'ACTIVE' }
    });
  }

  async findAllDailyTips(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sortOptions: SortingDto = { sortField: 'day', sortOrder: 'ASC' },
    filters: GenericFilterDto = {},
  ): Promise<{
    data: DailyTips[],
    totalRecords: number
    limit?: number,
    page?: number
  }> {
    const { searchText, ...restFilters } = filters;
    const [data, totalRecords] = await DailyTipsService.dailyTipsRepository.findAndCount({
      where: {
        ...(searchText ? { content: ILike(`%${searchText}%`) } : {}),
        ...restFilters
      },
      order: {
        [sortOptions.sortField]: sortOptions.sortOrder
      },
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit
    });

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page
    };
  }

}

export const dailyTipsService = new DailyTipsService();