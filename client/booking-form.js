// booking-form.js

// Get DOM elements
const gpsBtn = document.getElementById('gpsBtn');
const addressInput = document.getElementById('address');
const extraDetailInput = document.getElementById('extraDetail');
const bookingForm = document.getElementById('bookingForm');
const confirmationModal = document.getElementById('confirmationModal');
const confirmationText = document.getElementById('confirmationText');
const closeModalBtn = document.getElementById('closeModal');

// Select all inputs/selects/textarea except GPS button and address fields
const formFields = bookingForm.querySelectorAll(
  'select, input:not(#address):not(#extraDetail):not(#gpsBtn), textarea, button[type="submit"]'
);

// Initially disable all form fields except GPS button
formFields.forEach(el => el.disabled = true);
addressInput.disabled = true;
extraDetailInput.disabled = true;

// Handle GPS button click
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

      // Reverse geocode with OpenStreetMap Nominatim API
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
          // Build address string (road + postcode if available)
          let road = data.address?.road || data.address?.pedestrian || '';
          let postcode = data.address?.postcode || '';
          let displayAddress = road ? `${road}, ${postcode}` : data.display_name || '';

          // Autofill address input & enable fields
          addressInput.value = displayAddress;
          addressInput.disabled = false;
          extraDetailInput.disabled = false;

          // Enable rest of form fields
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
    (error) => {
      alert('Failed to get your location. Please allow location access to continue.');
      gpsBtn.textContent = 'Use My GPS';
      gpsBtn.disabled = false;
    }
  );
});

// Handle booking form submission
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Ensure GPS address is filled and enabled
  if (addressInput.disabled || !addressInput.value.trim()) {
    alert('Location is required. Please use the "Use My GPS" button first.');
    return;
  }

  // Check built-in HTML5 validation for the rest of form
  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    return;
  }

  // Extract form data
  const formData = new FormData(bookingForm);
  const data = Object.fromEntries(formData.entries());

  // Create booking reference
  const reference = 'AUC' + Math.floor(Math.random() * 900 + 100);

  // Compose full location string including optional extra details
  const fullLocation = data.address + (data.extraDetail ? ' - ' + data.extraDetail : '');

  // Build confirmation HTML
  confirmationText.innerHTML = `
    <h2>✅ Booking Confirmed!</h2>
    <p>🧾 <strong>Booking Reference:</strong> #${reference}</p>
    <p>🔧 <strong>Service Type:</strong> ${data.serviceType}</p>
    <p>🗓 <strong>Date:</strong> ${data.serviceDate}</p>
    <p>⏰ <strong>Time:</strong> ${data.serviceTime}</p>
    <p>📍 <strong>Location:</strong> ${fullLocation}</p>
    <br>
    <p>☎️ Our team will contact you shortly.</p>
    <p>📸 Please take a screenshot or save this confirmation.</p>
  `;

  // Show modal popup
  confirmationModal.classList.remove('hidden');

  // Reset form and disable inputs again (except GPS button)
  bookingForm.reset();
  formFields.forEach(el => el.disabled = true);
  addressInput.disabled = true;
  extraDetailInput.disabled = true;
});

// Close modal on button click
closeModalBtn.addEventListener('click', () => {
  confirmationModal.classList.add('hidden');
});