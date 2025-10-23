import { registerEnumType } from '@nestjs/graphql';

export enum ROLE {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

registerEnumType(ROLE, {
  name: 'ROLE',
});
