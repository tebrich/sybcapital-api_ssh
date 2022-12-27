import {
    Controller,
    Param,
    ParseBoolPipe,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';

@Controller('files')
@UseGuards(AuthGuard())
export class FilesController {
    constructor(private filesService: FilesService) {}

    @Post('upload-image/:folderName')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(
        @UploadedFile() file: any,
        @Param('folderName') folderName: string,
        @Query('feature', ParseBoolPipe) feature: boolean,
    ): Promise<{ id: number; filePath: string }> {
        return this.filesService.uploadImage(file, folderName, feature);
    }
}
