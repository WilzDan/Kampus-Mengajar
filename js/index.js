//footer
fetch("./partials/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
//footer tutup

//simulasi login akun google
function handleGoogleLogin() {
  const nama = "User Demo";
  const foto = "https://via.placeholder.com/40";

  // Komentar
  document.getElementById("belum-login").classList.add("hidden");
  document.getElementById("sudah-login").classList.remove("hidden");
  document.getElementById("user-name").innerText = nama;
  document.getElementById("user-photo").src = foto;

  // Navbar
  document.getElementById("login-btn").classList.add("hidden");
  document.getElementById("user-info").classList.remove("hidden");
  document.getElementById("nav-user-name").innerText = nama;
  document.getElementById("nav-user-photo").src = foto;

  // Notif
  showToast("Berhasil login sebagai " + nama);
}

function handleLogout() {
  document.getElementById("belum-login").classList.remove("hidden");
  document.getElementById("sudah-login").classList.add("hidden");
  document.getElementById("user-name").innerText = "";
  document.getElementById("user-photo").src = "";

  document.getElementById("login-btn").classList.remove("hidden");
  document.getElementById("user-info").classList.add("hidden");
  document.getElementById("nav-user-name").innerText = "";
  document.getElementById("nav-user-photo").src = "";

  showToast("Berhasil logout.");
}
//tutup simulasi login akun google

//simulasi notifikasi login dan logout
function showToast(pesan) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "bg-blue-500 text-white px-4 py-2 rounded shadow transition-opacity duration-500";
  toast.textContent = pesan;

  container.appendChild(toast);

  // Hilangkan setelah 3 detik
  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
//tutup simulasi notifikasi login dan logout