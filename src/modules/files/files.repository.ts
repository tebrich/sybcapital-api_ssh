import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FilesDto } from './dto/files.dto';
import { Files } from './files.entity';

@Injectable()
export class FilesRepository extends Repository<Files> {
    private logger = new Logger('FilesRepository');

    constructor(dataSource: DataSource) {
        super(Files, dataSource.manager);
    }
    async createFiles(files: FilesDto): Promise<Files> {
        try {
            const file = new Files();
            file.url = files.url;
            file.feature = files.feature;

            return await file.save();
        } catch (error) {
            this.logger.error(error);
            new BadGatewayException();
        }
    }

    async getFilesByArrayId(filesId: number[]) {
        try {
            const query = this.createQueryBuilder('files');

            query.where('files.id IN (:...filesId)', { filesId });

            return await query.getMany();
        } catch (error) {
            this.logger.error(error);
            new BadGatewayException();
        }
    }

    async getFile(id: number): Promise<Files> {
        try {
            return await this.findOneBy({ id });
        } catch (error) {
            this.logger.error(error);
            new BadGatewayException();
        }
    }
}
