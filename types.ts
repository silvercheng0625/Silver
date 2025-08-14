export interface Task {
  id: number;
  text: string;
  completed: boolean;
  encouragement?: string;
  icon?: string;
}

export type TasksHistory = {
  [date: string]: Task[];
};

export interface User {
  id: string;
  name: string;
  tasksHistory: TasksHistory;
  lastSeenSummaryMonth?: string;
}

export interface AppData {
  users: User[];
  currentUserId: string | null;
}