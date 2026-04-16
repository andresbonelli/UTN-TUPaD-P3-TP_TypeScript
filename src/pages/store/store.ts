// Logica compartida del Store

import type { CartItem, IUser } from "../../types";
import { logout } from "../../utils/auth";
import { getUSer } from "../../utils/localStorage";

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
buttonLogout?.addEventListener("click", () => {
  logout();
});

// Cargar nombre de usuario al navbar y mostrar link de admin si corresponde
const navbar = document.getElementById("navbar-links") as HTMLDivElement;
const userNameElement = document.getElementById("navbar-username") as HTMLSpanElement;
const usuario: IUser = getUSer() ? JSON.parse(getUSer() as string) : null;

if (usuario) {
  userNameElement.textContent = usuario.email;
  if (usuario.role === "admin") {
    const adminLink = document.createElement("a");
    adminLink.href = "/src/pages/admin/home/home.html";
    adminLink.textContent = "Administracion";
    adminLink.classList.add("nav-link");
    navbar?.appendChild(adminLink);
  }
}

export const actualizarContadorCarrito = () => {
  const contador = document.getElementById("cart-badge") as HTMLSpanElement;
  if (!contador) return;

  const cartExistente = localStorage.getItem("cart");
  const cart: CartItem[] = cartExistente ? JSON.parse(cartExistente) : [];

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  contador.textContent = totalItems.toString();
};

actualizarContadorCarrito();