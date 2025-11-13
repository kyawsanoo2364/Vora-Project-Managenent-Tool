export type UserType = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
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
  starred: Starred[];
};

export type Starred = {
  id: string;
};

export type BoardMemberType = {
  id: string;
  role: string;
  userId: string;
  user: UserType;
};

export type GetSingleBoardType = {
  id: string;
  name: string;
  background: string;
  members: BoardMemberType[];
};

export type WorkspaceMemberType = {
  id: string;
  role: string;
  userId: string;
  user: UserType;
};

export type ListType = {
  id: string;
  name: string;
  orderIndex: number;
};

type Priority = {
  label: "Low" | "Medium" | "High" | "Urgent";
  color: string; // hex, rgb, or tailwind class
};

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: string;
  startDate: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  createdAt: string;
  assignMembers: AssignMember[];
  checklists: Checklist[];
}

export interface AssignMember {
  id: string;
  // adjust user type if needed
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}

export interface Checklist {
  id: string;
  title: string;
  orderIndex: string; // or number if parsed
  createdAt: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  content: string;
  isCompleted: boolean;
  startDate: string | null;
  dueDate: string | null;
  assignMembers: AssignMember[] | [];
  // optional fields
  orderIndex?: string | number;
  createdAt?: string;
}

export interface ActivityType {
  id: string;
  action: string;
  user: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  createdAt: string;
}
