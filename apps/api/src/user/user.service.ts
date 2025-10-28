import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  async findByNameOrEmail(searchTerms: string) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: searchTerms,
            },
          },
          {
            email: {
              contains: searchTerms,
            },
          },
        ],
      },
      take: 8,
    });

    return [
      ...users.map((u) => ({ ...u, fullName: `${u.firstName} ${u.lastName}` })),
    ];
  }

  findAll() {
    return `This action returns all user`;
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      fullName: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
