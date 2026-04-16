import type { BaseUser } from "./BaseUser";

export interface IUser extends BaseUser {
  loggedIn: boolean;
}
