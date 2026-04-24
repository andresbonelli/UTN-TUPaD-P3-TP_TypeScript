import { getCategories, PRODUCTS } from "../../../data/data";
import type { CartItem, ICategory, Product } from "../../../types";
import { clearStoredCategory, getStoredCategory, storeCategory } from "../../../utils/localStorage";
import { actualizarContadorCarrito, showToast } from "../store";

const searchInput = document.getElementById("search-input") as HTMLInputElement;

// Filtrado de productos combinando la Categoría guardada en localStorage y la busqueda por nombre
const aplicarFiltrosYRenderizarProductos = () => {
  const searchQuery = searchInput.value.toLowerCase();
  const categoryFilter = getStoredCategory();

  let productosFiltrados: Product[] = PRODUCTS;
  
  // 1. Filtrar por categoría
  if (categoryFilter) {
    productosFiltrados = PRODUCTS.filter(p => p.categorias.some(cat => cat.id === categoryFilter.id))
  }

  // 2. Filtrar por nombre
  if (searchQuery) {
    productosFiltrados = productosFiltrados.filter(p =>
      p.nombre.toLowerCase().includes(searchQuery)
    );
  }

  // 3. Actualizar titulo de la grilla de productos con el nombre de la Categoria seleccionada.
  const tituloProductos = document.getElementById("products-title") as HTMLHeadingElement;
  if (tituloProductos) {
    tituloProductos.textContent = categoryFilter?.nombre || "Todos los Productos";
  }

  renderizarProductos(productosFiltrados);
};

// Aplicar filtro y renderizar cada vez que se escriba algo en el input de búsqueda
searchInput.addEventListener("input", aplicarFiltrosYRenderizarProductos);

// Cargar categorias
const listaCategorias = document.getElementById("category-list") as HTMLUListElement;
const categorias: ICategory[] = getCategories();

categorias.forEach((c) => {
  const li = document.createElement("li");
  li.classList.add("category-item");
  li.textContent = c.nombre;
  li.addEventListener("click", () => {
    storeCategory(c);
    // limpiar la búsqueda por nombre
    searchInput.value = ""; 
    window.location.reload();
  });
  listaCategorias.appendChild(li);
});

// Botón para "Ver todos"
document.getElementById("ver-todos")?.addEventListener("click", () => {
  clearStoredCategory();
  window.location.reload();
});

// Mostrar Productos
const renderizarProductos = (productos: Product[]) => {
  const contenedorProductos = document.getElementById('contenedor-productos');
  const contadorProductos = document.getElementById('products-count');
  if (!contenedorProductos || !contadorProductos) return;

  // limpiar por las dudas el contenedor de productos para que no se dupliquen en cada renderizado
  contenedorProductos.innerHTML = "";
  contadorProductos.textContent = `${productos.length} productos`;

  if (productos.length === 0) {
    contenedorProductos.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state-title">No se encontraron productos</h3>
        <p class="empty-state-subtitle">Intenta con otra búsqueda o filtro</p>
      </div>
    `;
    return;
  }

  productos.forEach(p => {
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
            <button 
              id="btn-add-${p.id}"
              class="btn-add-cart" 
              ${!p.disponible ? 'disabled' : ''}
            >
              ${p.disponible ? 'Agregar' : 'Sin stock'}
            </button>
          </div>
      </div>
    `;
    contenedorProductos.appendChild(article);

    // Agregar funcionalidad al botón de agregar al carrito
    const btnAdd = document.getElementById(`btn-add-${p.id}`);
    
    btnAdd?.addEventListener('click', () => {
      const cartExistente = localStorage.getItem("cart");
      let cart: CartItem[] = cartExistente ? JSON.parse(cartExistente) : [];
      const itemExistente = cart.find(item => item.product?.id === p.id);

      if (itemExistente) {
        itemExistente.quantity += 1;
      } else {
        const nuevoItem: CartItem = {
          product: p,
          quantity: 1
        };
        cart.push(nuevoItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      actualizarContadorCarrito();

      showToast("¡Agregado al carrito!", p.nombre);

      const btn = btnAdd as HTMLButtonElement;
      const textoOriginal = btn.textContent;
      btn.textContent = "✓ Agregado";
      btn.classList.add("added");
      // evitar repetidos clicks sobre el mismo producto
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = textoOriginal;
        btn.classList.remove("added");
        btn.disabled = false;
      }, 1000);
    });
  });
};

// Carga inicial
aplicarFiltrosYRenderizarProductos();