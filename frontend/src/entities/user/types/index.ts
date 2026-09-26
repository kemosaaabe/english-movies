export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface RegisterUserInput extends LoginUserInput {
  name: string;
}
