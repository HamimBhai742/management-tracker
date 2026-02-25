export interface UserPayload {
  name: string;
  email: string;
  password: string;
}

export interface IJwtPayload {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;

  otp?: string | null;
  otpExpires?: Date | null;
  otpAttempts?: number;

  role: Role;
  status: UserStatus;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
