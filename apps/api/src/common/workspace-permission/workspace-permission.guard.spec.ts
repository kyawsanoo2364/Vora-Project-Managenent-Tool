import { WorkspacePermissionGuard } from './workspace-permission.guard';

describe('WorkspacePermissionGuard', () => {
  it('should be defined', () => {
    expect(new WorkspacePermissionGuard()).toBeDefined();
  });
});
