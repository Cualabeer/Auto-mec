const form = document.getElementById('bookingForm');
const gpsToggle = document.getElementById('locationToggle');
const addressField = document.getElementById('address');
const confirmation = document.getElementById('confirmation');

gpsToggle.addEventListener('change', () => {
  if (gpsToggle.checked) {
    addressField.disabled = true;
    navigator.geolocation.getCurrentPosition(success => {
      const { latitude, longitude } = success.coords;
      addressField.value = `Lat: ${latitude}, Lng: ${longitude}`;
    }, () => {
      alert('Unable to retrieve location.');
      gpsToggle.checked = false;
      addressField.disabled = false;
    });
  } else {
    addressField.disabled = false;
    addressField.value = '';
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    serviceType: document.getElementById('serviceType').value,
    time: document.getElementById('time').value,
    address: addressField.value,
    description: document.getElementById('description').value
  };
  console.log("Booking submitted:", data);
  form.reset();
  addressField.disabled = false;
  confirmation.classList.remove('hidden');
  setTimeout(() => {
    confirmation.classList.add('hidden');
  }, 3000);
});