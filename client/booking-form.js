// booking-form.js

// Hamburger menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
  navToggle.setAttribute('aria-expanded', !expanded);
  if (navMenu.classList.contains('show')) {
    navMenu.classList.remove('show');
    navMenu.setAttribute('aria-hidden', 'true');
  } else {
    navMenu.classList.add('show');
    navMenu.setAttribute('aria-hidden', 'false');
  }
});

// Booking form DOM elements
const gpsBtn = document.getElementById('gpsBtn');
const addressInput = document.getElementById('address');
const extraDetailInput = document.getElementById('extraDetail');
const bookingForm = document.getElementById('bookingForm');
const confirmationModal = document.getElementById('confirmationModal');
const confirmationText = document.getElementById('confirmationText');
const closeModalBtn = document.getElementById('closeModal');

// Info modal elements
const infoBtn = document.getElementById('infoBtn');
const gpsInfoModal = document.getElementById('gpsInfoModal');
const closeGpsInfo = document.getElementById('closeGpsInfo');

// Disable form inputs except GPS and info buttons initially
const formFields = bookingForm.querySelectorAll(
  'select, input:not(#address):not(#extraDetail):not(#gpsBtn):not(#infoBtn), textarea, button[type="submit"]'
);
formFields.forEach(el => el.disabled = true);
addressInput.disabled = true;
extraDetailInput.disabled = true;

// GPS button click - get location
gpsBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  gpsBtn.textContent = 'Locating...';
  gpsBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Reverse geocode OpenStreetMap Nominatim API
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
          let road = data.address?.road || data.address?.pedestrian || '';
          let postcode = data.address?.postcode || '';
          let displayAddress = road ? `${road}, ${postcode}` : data.display_name || '';

          addressInput.value = displayAddress;
          addressInput.disabled = false;
          extraDetailInput.disabled = false;
          formFields.forEach(el => el.disabled = false);

          gpsBtn.textContent = 'Use My GPS';
          gpsBtn.disabled = false;
        })
        .catch(() => {
          alert('Unable to retrieve your address from GPS coordinates.');
          gpsBtn.textContent = 'Use My GPS';
          gpsBtn.disabled = false;
        });
    },
    () => {
      alert('Failed to get your location. Please allow location access to continue.');
      gpsBtn.textContent = 'Use My GPS';
      gpsBtn.disabled = false;
    }
  );
});

// Booking form submission
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (addressInput.disabled || !addressInput.value.trim()) {
    alert('Location is required. Please use the "Use My GPS" button first.');
    return;
  }

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    return;
  }

  const formData = new FormData(bookingForm);
  const data = Object.fromEntries(formData.entries());

  const reference = 'AUC' + Math.floor(Math.random() * 900 + 100);
  const fullLocation = data.address + (data.extraDetail ? ' - ' + data.extraDetail : '');

  confirmationText.innerHTML = `
    <h2 id="confirmationTitle">✅ Booking Confirmed!</h2>
    <p>🧾 <strong>Booking Reference:</strong> #${reference}</p>
    <p>🔧 <strong>Service Type:</strong> ${data.serviceType}</p>
    <p>🗓 <strong>Date:</strong> ${data.serviceDate}</p>
    <p>⏰ <strong>Time:</strong> ${data.serviceTime}</p>
    <p>📍 <strong>Location:</strong> ${fullLocation}</p>
    <br />
    <p>☎️ Our team will contact you shortly.</p>
    <p>📸 Please take a screenshot or save this confirmation.</p>
  `;

  confirmationModal.classList.remove('hidden');

  // Reset and disable inputs except GPS/info buttons
  bookingForm.reset();
  formFields.forEach(el => el.disabled = true);
  addressInput.disabled = true;
  extraDetailInput.disabled = true;
});

// Close confirmation modal
closeModalBtn.addEventListener('click', () => {
  confirmationModal.classList.add('hidden');
});

// Info modal handlers
infoBtn.addEventListener('click', () => {
  gpsInfoModal.classList.remove('hidden');
});

closeGpsInfo.addEventListener('click', () => {
  gpsInfoModal.classList.add('hidden');
});

// Quick Book Section JS
const quickBook = document.getElementById('quickBook');
const quickButtons = quickBook.querySelectorAll('.quick-service');
const quickForm = document.getElementById('quickBookForm');
const quickServiceName = document.getElementById('quickServiceName');
const quickDate = document.getElementById('quickDate');
const quickTime = document.getElementById('quickTime');
const quickLocation = document.getElementById('quickLocation');
const quickName = document.getElementById('quickName');
const quickPhone = document.getElementById('quickPhone');

let quickCurrentLocation = ''; // GPS address for quick book

function getCurrentDateTime() {
  const now = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  const date = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  const time = pad(now.getHours()) + ':' + pad(now.getMinutes());
  return { date, time };
}

function fillQuickBookLocation() {
  if (!navigator.geolocation) {
    quickLocation.textContent = 'Geolocation not supported';
    return;
  }
  quickLocation.textContent = 'Locating...';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
          let road = data.address?.road || data.address?.pedestrian || '';
          let postcode = data.address?.postcode || '';
          let address = road ? `${road}, ${postcode}` : data.display_name || 'Unknown address';
          quickCurrentLocation = address;
          quickLocation.textContent = address;
        })
        .catch(() => {
          quickLocation.textContent = 'Unable to get address';
        });
    },
    () => {
      quickLocation.textContent = 'GPS permission denied or unavailable';
    }
  );
}

quickButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const service = btn.getAttribute('data-service');
    quickServiceName.textContent = service;

    const { date, time } = getCurrentDateTime();
    quickDate.textContent = date;
    quickTime.textContent = time;

    quickForm.classList.remove('hidden');
    fillQuickBookLocation();
    quickForm.scrollIntoView({ behavior: 'smooth' });
  });
});

quickForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!quickName.value.trim() || !quickPhone.value.trim()) {
    alert('Please fill your name and phone number.');
    return;
  }
  if (!quickCurrentLocation) {
    alert('Location not available. Please allow GPS or use the main booking form.');
    return;
  }

  const bookingReference = 'AUC' + Math.floor(Math.random() * 900 + 100);
  alert(
    `Quick booking confirmed!\n\n` +
    `Reference: #${bookingReference}\n` +
    `Service: ${quickServiceName.textContent}\n` +
    `Date: ${quickDate.textContent}\n` +
    `Time: ${quickTime.textContent}\n` +
    `Location: ${quickCurrentLocation}\n` +
    `Name: ${quickName.value.trim()}\n` +
    `Phone: ${quickPhone.value.trim()}\n\n` +
    `Our team will contact you shortly. Please save this information.`
  );

  quickForm.reset();
  quickForm.classList.add('hidden');
  quickLocation.textContent = 'Waiting for GPS...';
  quickCurrentLocation = '';
});