import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(private configService: ConfigService) {
        super(
            {
                header: 'apiKey',
                prefix: '',
            },
            true,
            (apikey: string, done: (err: HttpException, data: boolean) => void) => {
                if (this.configService.get<string>('APIKEY') === apikey) {
                    done(null, true);
                }

                return done(
                    new HttpException('Unauthorized access, verify the token is correct', HttpStatus.UNAUTHORIZED),
                    false,
                );
            },
        );
    }
}
