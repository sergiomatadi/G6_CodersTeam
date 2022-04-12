const sesion = JSON.parse(localStorage.getItem("sesionUser"));
async function elegirAvatar(avatar) {
  // Guardamos en localStorage el user avatar
  const updatedSesion = {
    avatar,
    ...sesion,
  };
  localStorage.setItem("sesionUser", JSON.stringify(updatedSesion));

  const url = "http://localhost:3001/users/save_avatar";

  const response = await fetch(`${url}?user=${sesion.email}`, {
    method: "POST",
    body: JSON.stringify({ avatar }),
  });
  const { statusCode } = await response.json();

  if (statusCode === 200) {
    window.location.href = "salas.html";
    sessionStorage.avatarJugador = avatar;
  } else {
    console.error("Error saving user avatar");
  }
}

const logout = () => {
  localStorage.removeItem("sesionUser");
  window.location.href = "/login";
};

let logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout, false);

const headerNameElement = document.getElementById("username");

headerNameElement.insertAdjacentHTML(
  "beforeend",
  sesion ? `${sesion.user}!` : "Jugador!"
);
