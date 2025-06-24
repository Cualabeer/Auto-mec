// ========== DOM ELEMENTS ==========
const locationField = document.getElementById('location');
const confirmation = document.getElementById('confirmation');
const disclaimerBtn = document.getElementById('disclaimerBtn');
const disclaimerPopup = document.getElementById('disclaimerPopup');
const quickButtons = document.querySelectorAll('[data-quick-service]');
const bookingForm = document.getElementById('bookingForm');

// ========== 1. GET USER GPS LOCATION ==========
function getLocation() {
  if (!navigator.geolocation) {
    alert("Your browser doesn't support GPS. Please enter your address manually.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      locationField.value = `Lat: ${lat}, Lng: ${lng}`;
    },
    () => {
      alert("Location access denied. Please allow GPS to continue.");
    }
  );
}

// ========== 2. BOOKING FORM HANDLER ==========
if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const name = formData.get('name');
    const phone = formData.get('phone');

    confirmation.innerText = `✅ Booking confirmed for ${name}. We'll call you at ${phone}.`;
    confirmation.style.display = 'block';
  });
}

// ========== 3. DISCLAIMER POP-UP ==========
if (disclaimerBtn && disclaimerPopup) {
  disclaimerBtn.addEventListener('click', () => {
    disclaimerPopup.classList.toggle('visible');
  });
}

// ========== 4. QUICK BOOK BUTTONS ==========
quickButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const service = btn.getAttribute('data-quick-service');
    document.getElementById('service').value = service;
    const now = new Date();
    document.getElementById('datetime').value = now.toISOString().slice(0, 16); // Format: yyyy-MM-ddTHH:mm
  });
});

// ========== INIT ON LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
  if (locationField && locationField.hasAttribute('readonly')) {
    getLocation();
  }
});