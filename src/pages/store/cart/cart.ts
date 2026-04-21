import type { CartItem, Product } from "../../../types";
import { actualizarContadorCarrito, showToast } from "../store";

const emptyCartButton = document.getElementById("vaciar-carrito") as HTMLButtonElement;
const summaryContainer = document.getElementById("cart-summary") as HTMLDivElement;

emptyCartButton.addEventListener("click", () => {
  localStorage.removeItem("cart");
  renderizarCarrito([]);
  actualizarContadorCarrito();
});

const renderizarCarrito = (cart: CartItem[]) => {
  const cartContainer = document.getElementById("cart-container") as HTMLDivElement;
  if (!cartContainer) return;

  actualizarResumen(cart);
  actualizarContadorCarrito();
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state-title">Carrito de compras vacío</h3>
        <p class="empty-state-subtitle">Vuelve al inicio para agregar productos</p>
      </div>`;
    return;
  }
  cartContainer.innerHTML = "";

  cart.forEach((item) => {
    const subtotal = item.product.precio * item.quantity;
    
    const article = document.createElement("article");
    article.classList.add("cart-item");
    article.innerHTML = `
      <img
        src="${item.product.imagen}"
        alt="${item.product.nombre}"
        class="cart-item-img"
      />
      <div class="cart-item-info">
        <h3 class="cart-item-name">${item.product.nombre}</h3>
        <p class="cart-item-description">${item.product.descripcion || ''}</p>
        <span class="cart-item-unit-price">$${item.product.precio.toLocaleString()} c/u</span>
      </div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn btn-minus" data-id="${item.product.id}">−</button>
        <span class="cart-qty-value">${item.quantity}</span>
        <button class="cart-qty-btn btn-plus" data-id="${item.product.id}">+</button>
        <span class="cart-item-subtotal">$${subtotal.toLocaleString()}</span>
        <button class="cart-delete-btn btn-delete" data-id="${item.product.id}">🗑</button>
      </div>
    `;

    cartContainer.appendChild(article);

  });
  
  asignarEventosCarrito();
};

const asignarEventosCarrito = () => {
  // Botones de Sumar
  document.querySelectorAll(".btn-plus").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt((e.currentTarget as HTMLButtonElement).dataset.id!);
      modificarCantidad(id, 1);
    });
  });

  // Botones de Restar
  document.querySelectorAll(".btn-minus").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt((e.currentTarget as HTMLButtonElement).dataset.id!);
      modificarCantidad(id, -1);
    });
  });

  // Botones de Eliminar
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt((e.currentTarget as HTMLButtonElement).dataset.id!);
      eliminarDelCarrito(id);
    });
  });
};

const modificarCantidad = (productId: number, cantidad: number) => {
  const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
  const item = cart.find(i => i.product.id === productId);

  if (item) {
    item.quantity += cantidad;

    if (item.quantity <= 0) {
      eliminarDelCarrito(productId);
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderizarCarrito(cart);
  }
};

const eliminarDelCarrito = (productId: number) => {
  const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
  const productoEliminado: Product | undefined = cart.find(i => i.product.id === productId)?.product;
  const nuevoCarrito = cart.filter(i => i.product.id !== productId);
  
  localStorage.setItem("cart", JSON.stringify(nuevoCarrito));
  renderizarCarrito(nuevoCarrito);
  showToast("¡Producto eliminado!", productoEliminado?.nombre || "");
};

const actualizarResumen = (cart: CartItem[]) => {
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryEnvio = document.getElementById("summary-envio");
  const summaryTotal = document.getElementById("summary-total");

  if (!summarySubtotal || !summaryEnvio || !summaryTotal) return;

  if (cart.length === 0) {
    summaryContainer.style.display = "none";
    return;
  }

  const subtotal = cart.reduce((acc, i) => acc + i.product.precio * i.quantity, 0);
  const envio = (subtotal > 5000 || subtotal === 0) ? 0 : 500;
  const total = subtotal + envio;

  summarySubtotal.textContent = `$${subtotal.toLocaleString()}`;
  summaryEnvio.textContent = subtotal === 0 ? "$0" : (envio === 0 ? "Gratis" : `$${envio.toLocaleString()}`);
  summaryTotal.textContent = `$${total.toLocaleString()}`;
};

// Carga inicial
const cartExistente: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
renderizarCarrito(cartExistente);