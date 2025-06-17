// Footer
fetch("./partials/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDS6NsBdy6jSz9C1RORyC3Xq3-xBapPi64",
  authDomain: "kampus-mengajar-8a514.firebaseapp.com",
  projectId: "kampus-mengajar-8a514",
  storageBucket: "kampus-mengajar-8a514.appspot.com",
  messagingSenderId: "673406086917",
  appId: "1:673406086917:web:84193e9c42b5ccfd62516c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

let unsubscribeKomentar = null;
let currentUser = null;

// Login
window.handleGoogleLogin = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    showToast("Berhasil login sebagai " + result.user.displayName);
  } catch (error) {
    alert("Gagal login: " + error.message);
  }
};

// Logout
window.handleLogout = function () {
  signOut(auth)
    .then(() => {
      showToast("Berhasil logout.");
    })
    .catch((error) => {
      alert("Gagal logout: " + error.message);
    });
};

// Pantau auth state
onAuthStateChanged(auth, (user) => {
  currentUser = user;

  if (user) {
    updateUISetelahLogin(user);
  } else {
    updateUISetelahLogout();
  }

  // Reset listener komentar setiap kali login/logout
  if (unsubscribeKomentar) unsubscribeKomentar();
  unsubscribeKomentar = tampilkanKomentarRealtime();
});

// UI saat login
function updateUISetelahLogin(user) {
  const belumLogin = document.getElementById("belum-login");
  const sudahLogin = document.getElementById("sudah-login");
  if (belumLogin && sudahLogin) {
    belumLogin.classList.add("hidden");
    sudahLogin.classList.remove("hidden");
    document.getElementById("user-name").innerText = user.displayName;
    document.getElementById("user-photo").src = user.photoURL;
  }

  const loginBtn = document.getElementById("login-btn");
  const userInfo = document.getElementById("user-info");
  if (loginBtn && userInfo) {
    loginBtn.classList.add("hidden");
    userInfo.classList.remove("hidden");
    document.getElementById("nav-user-name").innerText = user.displayName;
    document.getElementById("nav-user-photo").src = user.photoURL;
  }
}

// UI saat logout
function updateUISetelahLogout() {
  const belumLogin = document.getElementById("belum-login");
  const sudahLogin = document.getElementById("sudah-login");
  if (belumLogin && sudahLogin) {
    belumLogin.classList.remove("hidden");
    sudahLogin.classList.add("hidden");
    document.getElementById("user-name").innerText = "";
    document.getElementById("user-photo").src = "";
  }

  const loginBtn = document.getElementById("login-btn");
  const userInfo = document.getElementById("user-info");
  if (loginBtn && userInfo) {
    loginBtn.classList.remove("hidden");
    userInfo.classList.add("hidden");
    document.getElementById("nav-user-name").innerText = "";
    document.getElementById("nav-user-photo").src = "";
  }
}

// Notifikasi
function showToast(pesan) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "bg-blue-500 text-white px-4 py-2 rounded shadow transition-opacity duration-500";
  toast.textContent = pesan;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// Kirim komentar
window.kirimKomentar = async function () {
  const input = document.getElementById("komentar-input");
  const isiKomentar = input.value.trim();
  if (!isiKomentar) {
    showToast("Komentar tidak boleh kosong.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    showToast("Anda harus login terlebih dahulu.");
    return;
  }

  try {
    await addDoc(collection(db, "komentar"), {
      nama: user.displayName,
      foto: user.photoURL,
      komentar: isiKomentar,
      uid: user.uid,
      waktu: new Date()
    });

    input.value = "";
    showToast("Komentar berhasil dikirim.");
  } catch (error) {
    alert("Gagal menyimpan komentar: " + error.message);
  }
};

// Tampilkan komentar realtime
function tampilkanKomentarRealtime() {
  const daftarKomentar = document.getElementById("daftar-komentar");
  const q = query(collection(db, "komentar"), orderBy("waktu", "desc"));

  return onSnapshot(q, (snapshot) => {
    daftarKomentar.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.className = "bg-gray-100 rounded-lg p-4 mb-4";

      let tombolAksi = "";
      if (currentUser && currentUser.uid === data.uid) {
        tombolAksi = `
          <div class="flex gap-2 mt-2">
            <button onclick="editKomentar('${docSnap.id}', '${data.komentar.replace(/'/g, "\\'")}')" class="text-blue-500 text-sm">Edit</button>
            <button onclick="hapusKomentar('${docSnap.id}')" class="text-red-500 text-sm">Hapus</button>
          </div>
        `;
      }

      const waktu = data.waktu?.toDate?.().toLocaleString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }) || "";

      div.innerHTML = `
        <div class="flex items-center space-x-2 mb-2">
          <img src="${data.foto}" alt="Foto" class="w-8 h-8 rounded-full" />
          <div>
            <p class="font-semibold">${data.nama}</p>
            <p class="text-xs text-gray-400">${waktu}</p>
          </div>
        </div>
        <p class="text-sm text-gray-700" id="komentar-${docSnap.id}">${data.komentar}</p>
        ${tombolAksi}
      `;

      daftarKomentar.appendChild(div);
    });
  });
}

// Hapus komentar
window.hapusKomentar = async function (id) {
  try {
    await deleteDoc(doc(db, "komentar", id));
    showToast("Komentar dihapus.");
  } catch (error) {
    alert("Gagal hapus: " + error.message);
  }
};

// Edit komentar
window.editKomentar = function (id, isiLama) {
  const teks = prompt("Edit komentar:", isiLama);
  if (teks && teks.trim()) {
    updateDoc(doc(db, "komentar", id), {
      komentar: teks.trim()
    }).then(() => {
      showToast("Komentar diperbarui.");
    }).catch((err) => {
      alert("Gagal edit: " + err.message);
    });
  }
};
