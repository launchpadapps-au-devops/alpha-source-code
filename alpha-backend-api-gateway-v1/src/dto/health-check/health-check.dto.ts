import { MICROSERVICE_NAMES, MicroserviceName } from "@launchpadapps-au/alpha-shared";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class HealthCheckDto {
    @ApiProperty({
        description: 'Microservice name',
        enum: MICROSERVICE_NAMES,
    })
    @IsEnum(MICROSERVICE_NAMES)
    microserviceName: MicroserviceName;
}