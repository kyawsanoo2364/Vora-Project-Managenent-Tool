export type UserType = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  createdAt: Date;
};

export type GetBoardDataType = {
  id: string;
  name: string;
  background: string;
  description?: string;
  createdAt: Date;
};
