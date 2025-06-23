// Initialize Flatpickr inline calendar with time picker enabled
flatpickr("#calendar", {
  enableTime: true,
  inline: true,
  dateFormat: "Y-m-d H:i",
  onChange: function(selectedDates, dateStr) {
    // Update hidden input value to the selected date-time string
    document.getElementById('time').value = dateStr;
  }
});

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Simple validation: check if date/time is selected
  if (!document.getElementById('time').value) {
    alert('Please select a preferred time using the calendar.');
    return;
  }

  // TODO: Add your real submission logic here (e.g., API call)

  // Show confirmation message
  document.getElementById('confirmation').classList.remove('hidden');

  // Reset form (optional)
  this.reset();

  // Clear hidden date input manually after reset
  document.getElementById('time').value = '';
});