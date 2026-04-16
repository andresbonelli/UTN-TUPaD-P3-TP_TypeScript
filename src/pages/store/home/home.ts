import { logout } from "../../../utils/auth";
import { getCategories, PRODUCTS } from "../../../data/data";
import type { ICategory, IUser } from "../../../types";
import { getUSer } from "../../../utils/localStorage";

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

// Cargar categorias
const listaCategorias = document.getElementById("category-list") as HTMLUListElement;
const categorias: ICategory[] = getCategories();

categorias.forEach((c) => {
  const li = document.createElement("li");
  li.classList.add("category-item");
  li.dataset.categoryId = c.id.toString();
  li.textContent = c.nombre;

  // Evento de clic para filtrar
  li.addEventListener("click", () => {
    localStorage.setItem("selectedCategory", c.id.toString());
    window.location.reload();
  });

  listaCategorias.appendChild(li);
});

// Botón para "Ver todos"
const btnVerTodos = document.getElementById("ver-todos");
btnVerTodos?.addEventListener("click", () => {
  localStorage.removeItem("selectedCategory");
  window.location.reload();
});

// Filtrar productos por Categoria
const activeCategoryId = localStorage.getItem("selectedCategory");
const productosFiltrados = activeCategoryId 
    ? PRODUCTS.filter(p => p.categorias.some(cat => cat.id === parseInt(activeCategoryId)))
    : PRODUCTS;

// Cargar y renderizar Productos
const contenedorProductos = document.getElementById('contenedor-productos');
const contadorProductos = document.getElementById('products-count');

contadorProductos!.textContent = `${productosFiltrados.length} productos`;

productosFiltrados.forEach(p => {
    const article = document.createElement('article');
    article.classList.add('product-card');
    article.innerHTML = `
      <div class="product-card-img-wrapper">
          <img src="${p.imagen}" alt="${p.nombre}" class="product-card-img" />
      </div>
      <div class="product-card-body">
          <span class="product-category-tag">${p.categorias[0].nombre}</span>
          <h3 class="product-name">${p.nombre}</h3>
          <p class="product-description">${p.descripcion}</p>
          <div class="product-footer">
            <span class="product-price">$${p.precio}</span>
            <span class="product-badge ${p.disponible ? 'available' : 'unavailable'}">
              ${p.disponible ? 'Disponible' : 'No disponible'}
          </div>
      </div>
    `;
    contenedorProductos?.appendChild(article);
});