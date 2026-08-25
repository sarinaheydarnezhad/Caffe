// اسکریپت برای اسکرول نرم و مدیریت رزرو با Firebase

(function() {
  // تابع اسکرول نرم
  function smoothScroll(targetElement) {
    if (!targetElement) return;
    
    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }

  // مدیریت کلیک روی لینک‌های اسکرول
  const scrollLinks = document.querySelectorAll('.scroll-link');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      smoothScroll(targetElement);
    });
  });

  // مدیریت فرم رزرو با Firebase
  const reservationForm = document.getElementById('reservationForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  
  if (reservationForm) {
    reservationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // غیرفعال کردن دکمه ثبت
      submitBtn.disabled = true;
      submitBtn.textContent = 'در حال ثبت...';
      
      // مخفی کردن پیام‌های قبلی
      successMessage.style.display = 'none';
      errorMessage.style.display = 'none';
      
      // دریافت مقادیر فرم
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const date = document.getElementById('date').value;
      const guests = document.getElementById('guests').value;
      
      // اعتبارسنجی ساده
      if (!firstName || !lastName || !phone || !date || !guests) {
        alert('لطفاً تمام فیلدها را پر کنید.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'ثبت درخواست رزرو';
        return;
      }
      
      // اعتبارسنجی شماره تماس
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
        alert('لطفاً شماره تماس معتبر وارد کنید.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'ثبت درخواست رزرو';
        return;
      }
      
      try {
        // ذخیره در Firebase Firestore
        const reservationData = {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          date: date,
          guests: parseInt(guests),
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: 'pending'
        };
        
        // ذخیره در کالکشن reservations
        const docRef = await db.collection('reservations').add(reservationData);
        
        console.log('رزرو با موفقیت ثبت شد. ID:', docRef.id);
        
        // نمایش پیام موفقیت
        successMessage.style.display = 'block';
        successMessage.textContent = '✅ رزرو شما با موفقیت ثبت شد! به زودی با شما تماس می‌گیریم.';
        
        // پاک کردن فرم
        reservationForm.reset();
        
        // اسکرول به پیام موفقیت
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // مخفی کردن پیام بعد از 5 ثانیه
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
        
      } catch (error) {
        console.error('خطا در ثبت رزرو:', error);
        
        // نمایش پیام خطا
        errorMessage.style.display = 'block';
        errorMessage.textContent = '❌ خطا در ثبت رزرو. لطفاً دوباره تلاش کنید.';
        
        // مخفی کردن پیام بعد از 5 ثانیه
        setTimeout(() => {
          errorMessage.style.display = 'none';
        }, 5000);
      } finally {
        // فعال کردن دوباره دکمه
        submitBtn.disabled = false;
        submitBtn.textContent = 'ثبت درخواست رزرو';
      }
    });
  }

  // اضافه کردن کلاس active به لینک ناوبری هنگام اسکرول
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = '#b07d5b';
      }
    });
  });
})();
