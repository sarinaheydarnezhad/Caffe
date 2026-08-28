// این فایل فقط مسئول انیمیشن‌های ورود عناصر و اسلایدر محصولاته
// (کاملاً جدا از منطق فرم رزرو در script.js نگه داشته شده)

document.addEventListener('DOMContentLoaded', () => {
  // ۱) عناصر هیرو: همون لحظه‌ی بارگذاری صفحه با تاخیر پشت‌سرهم ظاهر می‌شن
  const heroItems = document.querySelectorAll('.hero .reveal-up');
  heroItems.forEach((el) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('in-view'));
    });
  });

  // ۲) بقیه‌ی عناصر (مثل کارت‌های منو): وقتی کاربر اسکرول کرد و بهشون رسید ظاهر می‌شن
  const scrollItems = document.querySelectorAll(
    '.reveal-blur, .reveal-up:not(.hero .reveal-up)'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    scrollItems.forEach((el) => observer.observe(el));
  } else {
    scrollItems.forEach((el) => el.classList.add('in-view'));
  }

  // ۳) دکمه‌های چپ/راست اسلایدر محصولات
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');

  if (track && prevBtn && nextBtn) {
    const scrollByCard = (direction) => {
      const card = track.querySelector('.slide-card');
      const cardWidth = card ? card.offsetWidth + 20 : 220; // ۲۰ = فاصله‌ی gap
      // چون صفحه RTL هست، جهت اسکرول برعکس می‌شه
      track.scrollBy({ left: direction * cardWidth * -1, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
  }
});
