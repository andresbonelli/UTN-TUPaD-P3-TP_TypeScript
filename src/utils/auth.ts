import type { IUser, StoredUser } from "../types";
import { getUsers, removeUser, saveUser } from "./localStorage";
import { navigate } from "./navigate";

export const logout = () => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
};

export const login = (email: string, password: string) => {
  const userList = getUsers();
  const foundUser = userList.find(
    (user) => user.email === email && user.password === password
  );

  if (foundUser) {
    const loggedInUser: IUser = {
      email: foundUser.email,
      role: foundUser.role,
      loggedIn: true,
    };
    // guardar el usuario logueado en localStorage para mantener la sesión activa
    saveUser(loggedInUser);
    console.log("Usuario logueado:", loggedInUser);
    // dejar que el interceptor de raiz se encargue de redirigir segun el rol
    navigate("./index.html");
  } else {
    // Mismo mensaje de error para todos los casos: 
    // usuario no encontrado, contraseña incorrecta o lista de usuarios vacia
    throw new Error("Credenciales inválidas.");
  }
}

export const registrar = (nuevoUsuario: StoredUser) => {
  const userList = getUsers();
  if (userList.some(user => user.email === nuevoUsuario.email)) {
    throw new Error("Ese usuario ya existe.");
  }
  userList.push(nuevoUsuario);
  const parseUserList = JSON.stringify(userList);
  localStorage.setItem("users", parseUserList);
  console.log(`Usuario registrado: ${nuevoUsuario.email}, rol: ${nuevoUsuario.role}`);
  navigate("/src/pages/auth/login/login.html");
}
