import type { StoredUser } from "../types";
import type { IUser } from "../types/IUser";

export const saveUser = (user: IUser) => {
  const parseUser = JSON.stringify(user);
  localStorage.setItem("userData", parseUser);
};
export const getUSer = () => {
  return localStorage.getItem("userData");
};
export const removeUser = () => {
  localStorage.removeItem("userData");
};

export function getUsers(): StoredUser[] {
  return localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users") as string) : [];
}

export function cargarUsuariosDePrueba() {
  if(!getUsers().length) {
    localStorage.setItem("users", JSON.stringify([
          {
              "email":"admin@foodstore.com",
              "password":"1234",
              "role":"admin"
          },
          {
              "email":"cliente@foodstore.com",
              "password":"1234",
              "role":"client"
          }
    ]));
  }
}
