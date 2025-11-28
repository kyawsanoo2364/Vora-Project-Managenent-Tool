import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { UpdateWorkspaceInput } from './dto/update-workspace.input';
import { PrismaService } from 'src/prisma/prisma.service';
import slug from 'slug';
import { randomUUID } from 'crypto';
import { Role } from '@prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(
    createWorkspaceInput: CreateWorkspaceInput,
    userid: string,
  ) {
    const workspace_slug = slug(
      `${createWorkspaceInput.name.trim()} ${randomUUID().slice(0, 8)}`,
      '_',
    );
    try {
      const workspace = await this.prisma.workspace.create({
        data: {
          name: createWorkspaceInput.name,
          description: createWorkspaceInput.description ?? undefined,
          slug: workspace_slug,
          ownerId: userid,
          logoId: createWorkspaceInput.logo ? createWorkspaceInput.logo : null,
          members: {
            create: {
              userId: userid,
              role: Role.ADMIN,
            },
          },
        },
      });
      return workspace;
    } catch (error) {
      throw new RequestTimeoutException(
        'Request Timeout or Something went wrong!',
      );
    }
  }

  async findAll(userId: string) {
    return await this.prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        logo: true,
      },
    });
  }
}
