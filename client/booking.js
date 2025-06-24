// client/booking.js
const form = document.getElementById("bookingForm");
const locateBtn = document.getElementById("locateBtn");

locateBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const data = await response.json();
      form.address.value = data.locality + ", " + data.principalSubdivision;
    },
    (err) => alert("Location access denied")
  );
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form).entries());
  const res = await fetch("https://your-backend-url/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  if (res.ok) {
    document.getElementById("confirmation").innerText = "✅ Booking submitted!";
    document.getElementById("confirmation").style.display = "block";
    form.reset();
  } else {
    alert("❌ Error submitting booking.");
  }
});
