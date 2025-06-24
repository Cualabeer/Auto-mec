const form = document.getElementById("bookingForm");
const locateBtn = document.getElementById("locateBtn");
const priceDisplay = document.getElementById("priceDisplay");
const serviceDropdown = document.getElementById("serviceDropdown");
const customJob = document.getElementById("customJob");

// 📌 Replace with your actual what3words API key:
const W3W_API_KEY = "YOUR_API_KEY_HERE";

// Show/hide textarea for custom job
serviceDropdown.addEventListener("change", () => {
  const value = serviceDropdown.value;
  if (value === "Custom") {
    customJob.style.display = "block";
    priceDisplay.innerText = "Custom pricing will be discussed after submission.";
  } else {
    customJob.style.display = "none";

    const priceMap = {
      "Breakdown": "from £60",
      "Battery Jump": "£40",
      "Oil Leak": "£70",
      "Flat Tyre": "£50",
      "Brake Pads & Discs": "£100",
      "Oil & Filter Change": "£50",
      "Starter Motor Replacement": "£90",
      "Battery Replacement": "£50",
      "Alternator Replacement": "£100",
      "Coolant Leak Diagnosis": "£70",
      "Suspension Inspection & Repair": "from £90",
      "Full Vehicle Diagnostic": "£60",
      "DPF / EGR Clean": "£100",
      "Timing Belt / Chain Inspection": "£70",
      "Clutch Inspection": "£60",
      "Pre-Purchase Vehicle Check": "£60"
    };
    priceDisplay.innerText = priceMap[value] ? `Estimated Labour: ${priceMap[value]}` : "";
  }
});

locateBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      // Reverse geocoding using BigDataCloud API
      const addressRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const addressData = await addressRes.json();
      const fullAddress = `${addressData.locality}, ${addressData.principalSubdivision}`;
      form.address.value = fullAddress;

      // what3words conversion
      const w3res = await fetch(`https://api.what3words.com/v3/convert-to-3wa?coordinates=${latitude},${longitude}&key=${W3W_API_KEY}`);
      const w3data = await w3res.json();

      if (w3data && w3data.words) {
        let existingW3 = document.getElementById("w3-display");
        existingW3.style.display = "block";
        existingW3.innerText = `📍 what3words: ///${w3data.words}`;
      }
    },
    (error) => {
      alert("⚠️ Location access was denied or failed. Please enter your address manually.");
      console.error(error);
    }
  );
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch("https://auto-mec-production.up.railway.app/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      document.getElementById("confirmation").innerText = "✅ Booking submitted successfully!";
      document.getElementById("confirmation").style.display = "block";
      form.reset();
      priceDisplay.innerText = "";
      customJob.style.display = "none";
    } else {
      throw new Error("Submission failed");
    }
  } catch (err) {
    alert("❌ Error submitting booking. Please try again.");
    console.error(err);
  }
});