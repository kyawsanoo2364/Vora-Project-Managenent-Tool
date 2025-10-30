import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createListInput: CreateListInput) {
    const existingBoards = await this.prisma.board.findUnique({
      where: { id: createListInput.boardId },
    });
    if (!existingBoards) {
      throw new BadRequestException(
        'Invalid Board Id (or) Board has already deleted!',
      );
    }
    const lastList = await this.prisma.list.findFirst({
      where: {
        boardId: createListInput.boardId,
      },
      orderBy: {
        orderIndex: 'desc',
      },
    });
    const newList = await this.prisma.list.create({
      data: {
        name: createListInput.name,
        boardId: createListInput.boardId,
        orderIndex: lastList ? lastList.orderIndex + 1 : 0,
      },
    });
    return newList;
  }

  async findAll(boardId: string) {
    const lists = await this.prisma.list.findMany({
      where: {
        boardId,
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });

    return lists;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  async update(id: string, updateListInput: UpdateListInput) {
    await this.prisma.$transaction(async (tx) => {
      const lists = await tx.list.findMany({
        where: { boardId: updateListInput.boardId },
        orderBy: { orderIndex: 'asc' },
      });

      const movedItem = lists.find((l) => l.id === id);
      if (!movedItem) throw new Error('List not found!');
      const filteredLists = lists.filter((l) => l.id !== id);
      filteredLists.splice(updateListInput.orderIndex, 0, movedItem);

      await Promise.all(
        filteredLists.map((list, i) => {
          return tx.list.update({
            where: { id: list.id },
            data: { orderIndex: i },
          });
        }),
      );

      return filteredLists;
    });

    return 'Successfully updated list!';
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
