// Initialize Flatpickr inline calendar with time enabled
flatpickr("#calendar", {
  enableTime: true,
  inline: true,
  dateFormat: "Y-m-d H:i",
  onChange: function(selectedDates, dateStr) {
    document.getElementById('time').value = dateStr;
  }
});

// Auto-locate user on page load
window.addEventListener('load', () => {
  const addressInput = document.getElementById('address');
  if (!navigator.geolocation) {
    console.log('Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
          if (data.display_name) {
            addressInput.value = data.display_name;
            addressInput.disabled = true;
          }
        })
        .catch(() => {
          console.log('Could not reverse geocode location');
          addressInput.placeholder = 'Enter address manually';
        });
    },
    error => {
      console.log('Location access denied or failed');
      addressInput.placeholder = 'Enter address manually';
    }
  );
});

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const timeValue = document.getElementById('time').value;
  if (!timeValue) {
    alert('Please select a preferred time using the calendar.');
    return;
  }

  // You can add a backend API request here

  // Show confirmation
  document.getElementById('confirmation').classList.remove('hidden');

  // Reset form for next booking
  this.reset();
  document.getElementById('time').value = '';
});