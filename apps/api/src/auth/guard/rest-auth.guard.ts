import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RestJWTAuthGuard extends AuthGuard('jwt') {}
