import { ApiProperty } from '@nestjs/swagger';

class BaseUserMealLogDTO {
    @ApiProperty({ example: 'breakfast', description: 'Type of meal (e.g., breakfast, lunch, dinner)' })
    mealType: string;

    @ApiProperty({ example: 'manual', description: 'Type of entry (e.g., manual, automatic)' })
    entryType: string;

    @ApiProperty({ example: 'Omelette', description: 'Name of the meal' })
    mealName: string;

    @ApiProperty({ example: '08:00 AM', description: 'Time of intake' })
    intakeTime: string;

    @ApiProperty({ example: 2, description: 'Quantity of the meal' })
    quantity: number;

    @ApiProperty({ example: 'servings', description: 'Unit of measurement for the quantity' })
    unit: string;

    @ApiProperty({ example: 200, description: 'Calories in the meal' })
    calories: number;

    @ApiProperty({ example: { calories: 200, protein: 10 }, description: 'Nutrition data in JSON format' })
    nutritionData: object;

    @ApiProperty({ example: { mood: 'happy' }, description: 'Additional metadata in JSON format' })
    meta: object;
}

export class CreateUserMealLogDTO extends BaseUserMealLogDTO {
    @ApiProperty({ example: '2024-08-04T12:00:00Z', description: 'Date and time when the meal was logged' })
    loggedAt: Date;
}


export class UpdateUserMealLogDTO extends BaseUserMealLogDTO {
    @ApiProperty({ example: '2024-08-05T12:00:00Z', description: 'Updated date and time when the meal was logged', nullable: true })
    loggedAt: Date;
}


export class GetUserMealLogDTO extends BaseUserMealLogDTO {
    @ApiProperty({ example: '1', description: 'Unique identifier for the meal log' })
    id: string;

    @ApiProperty({ example: 'user123', description: 'ID of the user who created the meal log' })
    userId: string;

    @ApiProperty({ example: '2024-08-04T12:00:00Z', description: 'Date and time when the meal was logged' })
    loggedAt: Date;

    @ApiProperty({ example: '2024-08-04T12:00:00Z', description: 'Timestamp when the record was created' })
    createdAt: Date;

    @ApiProperty({ example: '2024-08-04T12:00:00Z', description: 'Timestamp when the record was last updated' })
    updatedAt: Date;
}
