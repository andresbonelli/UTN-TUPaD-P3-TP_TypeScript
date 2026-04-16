import type { Rol } from "./Rol";

export interface BaseUser {
    email: string;
    role: Rol;
  }