// Initialize Flatpickr inline calendar with time enabled
flatpickr("#calendar", {
  enableTime: true,
  inline: true,
  dateFormat: "Y-m-d H:i",
  onChange: function(selectedDates, dateStr) {
    // Update hidden input to sync with calendar selection
    document.getElementById('time').value = dateStr;
  }
});

// Booking form submission handler
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Validate that user picked date/time
  if (!document.getElementById('time').value) {
    alert('Please select a preferred time using the calendar.');
    return;
  }

  // Here you can add your backend submission logic (API call, etc.)

  // Show confirmation message
  document.getElementById('confirmation').classList.remove('hidden');

  // Reset form and hidden input after submission
  this.reset();
  document.getElementById('time').value = '';
});