// Comprobamos que el user esta registrado
if (!localStorage.getItem("sesionUser")) {
  window.location.href = "/login";
}
  const sesion = JSON.parse(localStorage.getItem("sesionUser"));
  const URL = "http://localhost:3001/users/";

  async function elegirAvatar(avatar) {
    // Guardamos en localStorage el user avatar
    sesion.avatar = avatar;

    const response = await fetch(`${URL}${sesion.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar }),
    });
    const { ok, data, error } = await response.json();

    if (ok) {
      localStorage.setItem("sesionUser", JSON.stringify(sesion));
      window.location.href = "/salas";
    } else {
      console.error("Error saving user avatar", error);
    }
  }

  const logout = async () => {
    const response = await fetch(URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sesion.token),
    });
    const { ok, error } = await response.json();
    if (ok) {
      localStorage.removeItem("sesionUser");
      window.location.href = "/login";
    } else {
      console.error("Error al intentar salir", error);
    }
  };

  let logoutButton = document.getElementById("logout");
  logoutButton.addEventListener("click", logout, false);

  const headerNameElement = document.getElementById("username");

  headerNameElement.insertAdjacentHTML(
    "beforeend",
    sesion.name ? `${sesion.name}!` : "Jugador!"
  );

