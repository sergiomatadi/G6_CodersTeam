// Comprobamos que el user esta autenticado
if (!localStorage.getItem("sesionUser")) {
  window.location.href = "/login";
}
const sesion = JSON.parse(localStorage.getItem("sesionUser"));
const URL = "http://localhost:3001/users/";

async function elegirAvatar(avatar) {
  const response = await fetch(`${URL}${sesion.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ avatar }),
  });
  const { ok, error } = await response.json();

  if (ok) {
    // Guardamos en localStorage el avatar elegido
    sesion.avatar = avatar;
    localStorage.setItem("sesionUser", JSON.stringify(sesion));
    window.location.href = "/salas";
  } else {
    console.error("Error al actualizar el avatar del usuario", error);
  }
}

const logout = async () => {
  localStorage.removeItem("sesionUser");
  window.location.href = "/login";
};

let logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout, false);

const headerNameElement = document.getElementById("username");

headerNameElement.insertAdjacentHTML(
  "beforeend",
  sesion.name ? `${sesion.name}!` : "Jugador!"
);
