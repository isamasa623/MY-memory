/* =============================================
   ★ パスワードをここで変更してください ★
============================================= */
const PASSWORD = "wedding2026";

/* =============================================
   パスワード処理
============================================= */
const $pwScreen = document.getElementById("password-screen");
const $main     = document.getElementById("main-content");
const $pwInput  = document.getElementById("pw-input");
const $pwBtn    = document.getElementById("pw-btn");
const $pwError  = document.getElementById("pw-error");

// ブラウザを閉じるまではパスワード不要
if (sessionStorage.getItem("auth") === "ok") unlock();

function unlock() {
  $pwScreen.style.display = "none";
  $main.classList.remove("hidden");
  loadAllGalleries();
  initNavScroll();
  initMobileNav();
}

function checkPassword() {
  if ($pwInput.value === PASSWORD) {
    sessionStorage.setItem("auth", "ok");
    unlock();
  } else {
    $pwError.textContent = "パスワードが違います";
    $pwInput.value = "";
    setTimeout(() => ($pwError.textContent = ""), 3000);
  }
}

$pwBtn.addEventListener("click", checkPassword);
$pwInput.addEventListener("keydown", (e) => { if (e.key === "Enter") checkPassword(); });

/* =============================================
   ナビゲーション
============================================= */
function initNavScroll() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });
}

function initMobileNav() {
  const btn   = document.getElementById("nav-menu-btn");
  const menu  = document.getElementById("nav-mobile");
  const links = menu.querySelectorAll(".nav-mobile-link");

  btn.addEventListener("click", () => menu.classList.toggle("hidden"));
  links.forEach((l) => l.addEventListener("click", () => menu.classList.add("hidden")));
}

/* =============================================
   ギャラリー読み込み
   photos/<album>/list.json に画像ファイル名を列挙
============================================= */
async function loadGallery(albumDir, containerId, statusId) {
  const container = document.getElementById(containerId);
  const status    = document.getElementById(statusId);

  try {
    const res   = await fetch(`photos/${albumDir}/list.json`);
    const files = await res.json();

    if (files.length === 0) {
      status.textContent = "写真を準備中です";
      return;
    }

    status.textContent = "";
    const paths = files.map((f) => `photos/${albumDir}/${f}`);

    paths.forEach((src, i) => {
      const img = document.createElement("img");
      img.src     = src;
      img.alt     = "";
      img.loading = "lazy";
      img.addEventListener("click", () => openLightbox(paths, i));
      container.appendChild(img);
    });

  } catch {
    status.textContent = "写真を準備中です";
  }
}

function loadAllGalleries() {
  loadGallery("wedding",   "gallery-wedding",   "status-wedding");
  loadGallery("honeymoon", "gallery-honeymoon", "status-honeymoon");
  loadGallery("memories",  "gallery-memories",  "status-memories");
}

/* =============================================
   ライトボックス
============================================= */
let lbImages = [];
let lbIndex  = 0;

const $lightbox = document.getElementById("lightbox");
const $lbImg    = document.getElementById("lb-img");
const $lbCnt    = document.getElementById("lb-counter");

function openLightbox(images, index) {
  lbImages = images;
  lbIndex  = index;
  showLbImage();
  $lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  $lightbox.classList.add("hidden");
  document.body.style.overflow = "";
}

function showLbImage() {
  $lbImg.src   = lbImages[lbIndex];
  $lbCnt.textContent = `${lbIndex + 1} / ${lbImages.length}`;
}

document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.querySelector(".lb-bg").addEventListener("click", closeLightbox);

document.getElementById("lb-prev").addEventListener("click", () => {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  showLbImage();
});
document.getElementById("lb-next").addEventListener("click", () => {
  lbIndex = (lbIndex + 1) % lbImages.length;
  showLbImage();
});

document.addEventListener("keydown", (e) => {
  if ($lightbox.classList.contains("hidden")) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowLeft")   { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLbImage(); }
  if (e.key === "ArrowRight")  { lbIndex = (lbIndex + 1) % lbImages.length; showLbImage(); }
});
