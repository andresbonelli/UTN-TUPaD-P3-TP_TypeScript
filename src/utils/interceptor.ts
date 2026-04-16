/*
    Este script va a estar referenciado en todas las paginas y se va a encargar de redirigir al usuario 
    a la pagina que le corresponde segun su rol, o al login si no esta autenticado.
*/


import type { IUser } from "../types";
import { getUSer } from "./localStorage";
import { navigate } from "./navigate";

export const interceptarCargaPagina = () => {
    const pathActual = window.location.pathname;
    const user: IUser = JSON.parse(getUSer() || "null");
    
    // 1. Si no hay usuario o no esta authenticado: Mandar al login (Ruta desprotegida)
    if (!user || !user.loggedIn) {
      if (pathActual.includes("/auth/")) {
          return;
      }
      navigate("/src/pages/auth/login/login.html");
      return;
    }
    
    // 2. Hay usuario autenticado: definir la logica de redirección.
    const homeDestino = `/src/pages/${user.role}/home/home.html`;
    const rutaRol = `/${user.role}/`;
    // Si ya está en su propia carpeta (/admin/ o /client/) no redirigir, para evitar quedar en un bucle infinito.
    if (pathActual.includes(rutaRol)) {
        return;
    }
    // Permitir a todos los usuarios autenticados acceder a la tienda
    if (pathActual.includes("/store/") && (user.role === "admin" || user.role === "client")) {
        return;
    }
    // Si intenta entrar a una ruta que no corresponde a su rol o si está en el index.html raíz pero ya autenticado
    navigate(homeDestino);
  }