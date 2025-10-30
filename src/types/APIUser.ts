// src/types/APIUser.ts
export type APIUser = {
  id: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  status?: string | null;
  membershipType?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RecentActivity = {
  action: string;
  time?: string;
  type?: string;
  page?: string;
};

export type Stats = {
  total: number;
  activeUsers: number;
  premiumUsers: number;
  verifiedUsers: number;
  newLast30Days: number;
  usersByRole: { role: string; count: number }[];
};
