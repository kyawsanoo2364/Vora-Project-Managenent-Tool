import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';
import argon2, { verify } from 'argon2';
import { SignInInput } from './dto/signIn.input';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { GenerateTokenOptions, JWTPayload } from 'src/utils';
import { ConfigService } from '@nestjs/config';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async create(createAuthInput: CreateAuthInput) {
    const { password, ...user } = createAuthInput;
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: user.username,
          },
          {
            email: user.email,
          },
        ],
      },
    });
    if (existingUser) {
      throw new UnauthorizedException('username/email already exists.');
    }
    const hashedPassword = await argon2.hash(password);

    try {
      await this.prisma.user.create({
        data: { ...user, password: hashedPassword },
      });

      return 'Sign up successfully';
    } catch (error) {
      throw new RequestTimeoutException(
        'Database connection timeout or something went wrong!',
      );
    }
  }

  async signIn(signInInput: SignInInput) {
    const { email, password } = signInInput;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      throw new NotFoundException(
        'User does not found with this email! Please sign up.',
      );
    }

    const isMatched = await verify(existingUser.password, password);
    if (!isMatched) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const { accessToken, refreshToken } =
      await this.generateToken(existingUser);

    const result: Auth = {
      accessToken,
      refreshToken,
    };

    return result;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();
    const payload = (await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('JWT_SECRET'),
    })) as JWTPayload;

    if (!payload) {
      throw new UnauthorizedException('Invalid Token or expired');
    }

    if (!payload.sub || !payload.email) throw new UnauthorizedException();

    const existingUser = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!existingUser) throw new UnauthorizedException('User not found');

    const result = await this.generateToken(existingUser, {
      isContainsRefreshToken: false,
    });

    return result;
  }

  /**
   *  @default `isContainsRefreshToken default is true`.
   *
   */
  private async generateToken(
    user: user,
    { isContainsRefreshToken = true }: GenerateTokenOptions = {},
  ) {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    let refreshToken: string | undefined;
    if (isContainsRefreshToken) {
      refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      });
    }
    return { accessToken, refreshToken };
  }

  public async validateJWTUser(payload: JWTPayload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      return { id: payload.sub };
    } catch (error) {
      throw new RequestTimeoutException();
    }
  }
}
