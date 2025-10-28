import { SetMetadata } from '@nestjs/common';

export const WORKSPACE_ROLE_KEY = 'workspace_roles';
export type WORKSPACE_ROLE_TYPE = 'ADMIN' | 'MEMBER';

export const WorkspaceRoles = (...roles: WORKSPACE_ROLE_TYPE[]) =>
  SetMetadata(WORKSPACE_ROLE_KEY, roles);
