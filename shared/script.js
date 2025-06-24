const locationField = document.getElementById('location');
const confirmation = document.getElementById('confirmation');
const disclaimerBtn = document.getElementById('disclaimerBtn');
const disclaimerPopup = document.getElementById('disclaimerPopup');
const bookingForm = document.getElementById('bookingForm');

const quickButtons = document.querySelectorAll('[data-quick-service]');
const quickPanel = document.getElementById('quickBookingPanel');
const quickForm = document.getElementById('quickBookingForm');

// ========== Full Booking GPS ==========
function getLocation() {
  if (!navigator.geolocation) {
    alert("Your browser doesn't support GPS. Please enter manually.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      if (locationField) {
        locationField.value = `Lat: ${lat}, Lng: ${lng}`;
      }
    },
    () => {
      alert("Please allow location access to continue.");
    }
  );
}

// ========== Booking Form ==========
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

// ========== Disclaimer Toggle ==========
if (disclaimerBtn && disclaimerPopup) {
  disclaimerBtn.addEventListener('click', () => {
    disclaimerPopup.classList.toggle('hidden');
  });
}

// ========== Emergency Quick Book ==========
function openQuickBooking(serviceName) {
  document.getElementById('quickService').value = serviceName;

  // Also select in full form dropdown
  const serviceDropdown = document.getElementById('service');
  if (serviceDropdown) {
    serviceDropdown.value = serviceName;
    serviceDropdown.classList.add('highlight');
    setTimeout(() => serviceDropdown.classList.remove('highlight'), 1500);
  }

  quickPanel.classList.remove('hidden');
  getQuickLocation();
}

function closeQuickBooking() {
  quickPanel.classList.add('hidden');
}

quickButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const service = btn.getAttribute('data-quick-service');
    openQuickBooking(service);
  });
});

quickForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('quickName').value;
  const phone = document.getElementById('quickPhone').value;
  alert(`🚨 Emergency booking for ${name} confirmed. We'll call ${phone}.`);
  closeQuickBooking();
});

// ========== Quick Book GPS ==========
function getQuickLocation() {
  if (!navigator.geolocation) {
    alert("Enable GPS to continue.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      document.getElementById('quickLocation').value = `Lat: ${lat}, Lng: ${lng}`;
    },
    () => {
      alert("Location access denied.");
    }
  );
}

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
  if (locationField && locationField.hasAttribute('readonly')) {
    getLocation();
  }
});