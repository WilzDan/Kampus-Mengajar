//footer
fetch("/partials/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
//footer tutup    
    
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.classList.add('translate-x-0');
    });

    closeMenu.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
      mobileMenu.classList.remove('translate-x-0');
    });

function openLightbox(imageSrc, title, desc) {
  const lightbox = document.getElementById('lightbox');
  document.getElementById('lightbox-image').src = imageSrc;
  document.getElementById('lightbox-title').innerText = title;
  document.getElementById('lightbox-desc').innerText = desc;

  lightbox.classList.remove('hidden');
  lightbox.classList.add('flex'); // <== penting!
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('hidden');
  lightbox.classList.remove('flex');
}
