import { Injectable, Logger } from '@nestjs/common';
import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Injectable()
export class FileUploadService {
    private containerClient: ContainerClient | null = null;
    private readonly logger = new Logger(FileUploadService.name);
    private readonly isAzureConfigured: boolean;

    constructor(
        private readonly envConfigService: EnvConfigService,
    ) {
        const azureConfig = {
            accountName: this.envConfigService.bucket.azureStorageAccount,
            accountKey: this.envConfigService.bucket.azureStorageAccessKey,
            containerName: this.envConfigService.bucket.azureStorageContainer,
        };

        if (!azureConfig.accountName || !azureConfig.accountKey || !azureConfig.containerName) {
            this.logger.warn('Azure Storage credentials are not properly configured. File upload functionality is disabled.');
            this.isAzureConfigured = false;
        } else {
            const blobServiceClient = new BlobServiceClient(
                `https://${azureConfig.accountName}.blob.core.windows.net`,
                new StorageSharedKeyCredential(azureConfig.accountName, azureConfig.accountKey)
            );
            this.containerClient = blobServiceClient.getContainerClient(azureConfig.containerName);
            this.isAzureConfigured = true;

            // Check if the container exists and create if it doesn't
            this.createContainerIfNotExists().catch(error => {
                this.logger.error('Failed to create container or check its existence', error);
            });
        }
    }

    private async createContainerIfNotExists(): Promise<void> {
        if (this.containerClient) {
            const containerExists = await this.containerClient.exists();
            if (!containerExists) {
                await this.containerClient.create();
                this.logger.log(`Container '${this.containerClient.containerName}' created successfully.`);
            } else {
                this.logger.log(`Container '${this.containerClient.containerName}' already exists.`);
            }
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string | null> {
        if (!this.isAzureConfigured) {
            this.logger.warn('File upload attempted, but Azure Storage is not configured.');
            return null;
        }

        const blobName = `${Date.now()}-${file.originalname}`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });

        return blockBlobClient.url;
    }
}
