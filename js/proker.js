// Footer loader
fetch("/partials/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });

// Mobile menu toggle
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

burgerBtn?.addEventListener('click', () => {
  mobileMenu.classList.remove('translate-x-full');
  mobileMenu.classList.add('translate-x-0');
});

closeMenu?.addEventListener('click', () => {
  mobileMenu.classList.add('translate-x-full');
  mobileMenu.classList.remove('translate-x-0');
});

// Tab dan Slide Handler
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll('.tab-button');
  const contents = document.querySelectorAll('.tab-content');
  const numberGroups = document.querySelectorAll('.tab-numbers');

  function moveIndicator(button) {
    const rect = button.getBoundingClientRect();
    const containerRect = button.parentElement.getBoundingClientRect();

    // Cek apakah tombol berasal dari mobile atau desktop
    const isMobile = button.closest('.sm\\:hidden') !== null;

    const indicator = isMobile
      ? document.getElementById('tab-indicator-mobile')
      : document.getElementById('tab-indicator');

    if (indicator) {
      indicator.style.width = `${rect.width}px`;
      indicator.style.transform = `translateX(${rect.left - containerRect.left}px)`;
    }
  }

  function moveNumberIndicator(button) {
    const indicator = button.parentElement.querySelector('.number-indicator');
    const rect = button.getBoundingClientRect();
    const parentRect = button.parentElement.getBoundingClientRect();
    if (indicator) {
      indicator.style.width = `${rect.width}px`;
      indicator.style.transform = `translateX(${rect.left - parentRect.left}px)`;
    }
  }

  // Klik tombol tab
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;

      moveIndicator(button);

      // Tampilkan konten tab yang sesuai
      contents.forEach(content => {
        content.classList.toggle('hidden', content.id !== tabId);
      });

      // Tampilkan nomor yang sesuai tab
      numberGroups.forEach(group => {
        const isActive = group.dataset.parent === tabId;
        group.classList.toggle('hidden', !isActive);

        if (isActive) {
          const firstBtn = group.querySelector('.number-btn');
          if (firstBtn) moveNumberIndicator(firstBtn);
        }
      });

      // Tampilkan slide pertama di tab aktif
      const tabContent = document.querySelector(`#${tabId}`);
      if (tabContent) {
        tabContent.querySelectorAll('.slide-content').forEach((slide, index) => {
          slide.classList.toggle('hidden', index !== 0);
        });
      }
    });
  });

  // Klik tombol angka (1–7/8)
  document.querySelectorAll('.number-btn').forEach(button => {
    button.addEventListener('click', () => {
      moveNumberIndicator(button);

      const slideNumber = button.textContent.trim();
      const tabId = button.closest('.tab-numbers').dataset.parent;

      // Sembunyikan semua slide
      document.querySelectorAll('.tab-content').forEach(container => {
        container.querySelectorAll('.slide-content').forEach(slide => {
          slide.classList.add('hidden');
        });
      });

      // Tampilkan hanya slide yang sesuai
      const activeSlide = document.querySelector(`#${tabId} .slide-content[data-slide="${slideNumber}"]`);
      if (activeSlide) {
        activeSlide.classList.remove('hidden');
      }
    });
  });

  // Trigger tab pertama saat load
  const firstTab = document.querySelector('.tab-button');
  if (firstTab) firstTab.click();

  // Posisikan indikator mobile ke tombol pertama
  const mobileIndicator = document.getElementById('tab-indicator-mobile');
  const mobileFirstTab = document.querySelector('.sm\\:hidden .tab-button');

  if (mobileIndicator && mobileFirstTab) {
    const rect = mobileFirstTab.getBoundingClientRect();
    const parentRect = mobileFirstTab.parentElement.getBoundingClientRect();
    mobileIndicator.style.width = `${rect.width}px`;
    mobileIndicator.style.transform = `translateX(${rect.left - parentRect.left}px)`;
  }
});
