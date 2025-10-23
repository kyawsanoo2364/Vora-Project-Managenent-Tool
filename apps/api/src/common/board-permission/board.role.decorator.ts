import { SetMetadata } from '@nestjs/common';

export const BOARD_ROLES_KEY = 'board_roles';
export type BoardRoleType = 'ADMIN' | 'MEMBER' | 'VIEWER';

export const BoardRole = (...roles: BoardRoleType[]) =>
  SetMetadata(BOARD_ROLES_KEY, roles);
