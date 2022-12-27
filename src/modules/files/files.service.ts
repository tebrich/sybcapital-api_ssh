import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import * as Jimp from 'jimp';
import { v4 as uuid } from 'uuid';

import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
    private logger = new Logger('S3Uploadder');
    private s3: AWS.S3;
    private AWS_BUCKET: string;

    constructor(
        configService: ConfigService,
        @InjectRepository(FilesRepository)
        private filesRepository: FilesRepository,
    ) {
        this.s3 = new AWS.S3({
            region: configService.get<string>('AWS_REGION'),
            credentials: new AWS.Credentials({
                accessKeyId: configService.get<string>('AWS_ACCESS_KEY'),
                secretAccessKey: configService.get<string>('AWS_SECRET_KEY'),
            }),
        });
        this.AWS_BUCKET = configService.get<string>('AWS_BUCKET_NAME');
    }

    async resizeImages(image: any): Promise<Buffer> {
        const jimpImage = await Jimp.read(image);
        const imageWidth = jimpImage.bitmap.width;

        if (imageWidth > 1800) {
            image = await jimpImage.resize(1800, Jimp.AUTO).quality(70).getBufferAsync(Jimp.MIME_JPEG);
        }
        return image;
    }

    async uploadImage(
        file: any,
        folderName: string,
        feature: boolean,
        fileName?: string,
        fileExtension?: string,
    ): Promise<{ id: number; filePath: string }> {
        if (file === undefined) throw new BadRequestException('File undefined');

        const extension = !fileExtension ? file.originalname.split('.') : fileExtension;
        const urlKey = !fileExtension
            ? `posts/${folderName}/${uuid()}.${extension[extension.length - 1]}`
            : `posts/${folderName}/${uuid()}${fileExtension}`;

        const buffer = Buffer.from(file.buffer);

        const params = {
            Body: await this.resizeImages(buffer),
            Bucket: this.AWS_BUCKET,
            Key: urlKey,
            ACL: 'public-read',
            ContentType: file.mimetype,
        };
        const data = await this.s3
            .putObject(params)
            .promise()
            .then(
                () => {
                    return {
                        filePath: `https://${this.AWS_BUCKET}.s3.amazonaws.com/${urlKey}`,
                    };
                },
                (err) => {
                    this.logger.error(err);
                    throw new InternalServerErrorException('Error loading image to S3');
                },
            );

        const files = await this.filesRepository.createFiles({ feature, url: data.filePath });
        return { id: files.id, filePath: data.filePath };
    }

    async getFilesByArrayId(filesId: number[]) {
        return await this.filesRepository.getFilesByArrayId(filesId);
    }
}
