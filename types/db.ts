export type RecentLogin = {
  name: string;
  email: string;
  last_login: Date;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: Date;
  last_login: Date | null;
};

export type AdminStats = {
  total_users: number;
  admin_count: number;
  active_users: number;
  new_users: number;
};