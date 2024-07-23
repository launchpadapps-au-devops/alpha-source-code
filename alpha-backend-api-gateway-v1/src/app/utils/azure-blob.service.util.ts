// azure-blob.service.ts
import { Injectable } from '@nestjs/common';
import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class AzureBlobService {
    private containerClient: ContainerClient;

    constructor(
        private readonly envConfigService: EnvConfigService,
    ) {
        const azureConfig = {
            accountName: this.envConfigService.bucket.azureStorageAccount,
            accountKey: this.envConfigService.bucket.azureStorageAccessKey,
            containerName: this.envConfigService.bucket.azureStorageContainer,
        };

        const blobServiceClient = new BlobServiceClient(
            `https://${azureConfig.accountName}.blob.core.windows.net`,
            new StorageSharedKeyCredential(azureConfig.accountName, azureConfig.accountKey)
        );

        this.containerClient = blobServiceClient.getContainerClient(azureConfig.containerName);
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const blobName = `${Date.now()}-${file.originalname}`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });

        return blockBlobClient.url;
    }
}
