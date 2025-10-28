import { registerEnumType } from '@nestjs/graphql';

export enum WorkspaceRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

registerEnumType(WorkspaceRole, { name: 'WorkspaceRole' });
