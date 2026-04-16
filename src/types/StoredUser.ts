import type { BaseUser } from "./BaseUser";

export interface StoredUser extends BaseUser {
    password: string;
  }