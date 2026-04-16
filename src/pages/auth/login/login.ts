import { login } from "../../../utils/auth";

const form = document.querySelector<HTMLFormElement>("#login");
const mensaje = document.querySelector<HTMLDivElement>("#mensaje");
const inputs = form?.querySelectorAll("input");

// Limpiar el mensaje de error si el usuario escribe de nuevo
inputs?.forEach(input => {
  input.addEventListener("input", () => {
    if (mensaje) {
      mensaje.innerHTML = "";
    }
  });
});


form?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const formElement = e.currentTarget as HTMLFormElement;

  const formData = new FormData(formElement);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    login(email, password);
  } catch (error) {
    if (error instanceof Error) {
      if (mensaje) {
        mensaje.innerHTML = `<p class="msg-error">${error.message}</p>`;
      }
    } else {
      if (mensaje) {
        mensaje.innerHTML = `<p class="msg-error">Ocurrió un error inesperado. Inténtalo de nuevo.</p>`;
      }
    }
  }

});