export interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
