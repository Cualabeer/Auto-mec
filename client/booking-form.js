<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Auto-mec Booking Form with Quick Book</title>
<style>
  /* === Color Variables === */
  :root {
    --hi-vis-orange: #ff7300;
    --hi-vis-yellow: #ffec3d;
    --white: #ffffff;
    --black: #000000;
    --gray-light: #f2f2f2;
    --gray-dark: #333333;
    --error-red: #c62828;
  }

  /* === Global base styles === */
  body {
    font-family: Arial, sans-serif;
    background: var(--white);
    margin: 0;
    padding: 1rem;
    color: var(--gray-dark);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .container {
    max-width: 480px;
    margin: 0 auto;
  }

  /* === Header with hamburger menu === */
  header {
    background: var(--hi-vis-orange);
    color: var(--white);
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 10000;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  header h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  #navToggle {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 22px;
    width: 28px;
    padding: 0;
  }

  #navToggle span {
    display: block;
    height: 4px;
    background: var(--white);
    border-radius: 2px;
  }

  nav#navMenu {
    position: absolute;
    top: 56px;
    right: 1rem;
    background: var(--hi-vis-orange);
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    display: none;
    flex-direction: column;
    min-width: 150px;
    z-index: 10001;
  }

  nav#navMenu.show {
    display: flex;
  }

  nav#navMenu a {
    color: var(--white);
    padding: 0.75rem 1rem;
    text-decoration: none;
    font-weight: bold;
    border-bottom: 1px solid rgba(255,255,255,0.3);
  }

  nav#navMenu a:last-child {
    border-bottom: none;
  }

  nav#navMenu a:hover {
    background: var(--hi-vis-yellow);
    color: var(--black);
  }

  /* === Buttons === */
  .btn {
    display: block;
    width: 100%;
    padding: 20px;
    margin: 1rem 0;
    font-size: 1.1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
  }

  .btn-primary {
    background-color: var(--hi-vis-orange);
    color: var(--white);
    font-weight: bold;
  }

  .btn-secondary {
    background-color: var(--hi-vis-yellow);
    color: var(--black);
    font-weight: bold;
    border: 2px solid var(--hi-vis-orange);
  }

  .btn-primary:hover {
    background-color: #e65f00;
  }

  .btn-secondary:hover {
    background-color: #fff55c;
  }

  /* === Form Inputs and Selects === */
  input[type="text"],
  input[type="date"],
  input[type="time"],
  select,
  textarea {
    width: 100%;
    padding: 20px;
    margin-top: 0.3rem;
    margin-bottom: 1rem;
    border: 2px solid var(--hi-vis-orange);
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
    resize: vertical;
  }

  input[type="text"]:focus,
  input[type="date"]:focus,
  input[type="time"]:focus,
  select:focus,
  textarea:focus {
    border-color: var(--hi-vis-yellow);
    outline: none;
  }

  label {
    font-weight: bold;
    display: block;
    margin-top: 1rem;
  }

  /* === Info Button === */
  #infoBtn {
    background-color: var(--hi-vis-orange);
    color: var(--white);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    margin: 0.5rem 0 1rem 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    transition: background-color 0.3s ease;
  }

  #infoBtn:hover,
  #infoBtn:focus {
    background-color: #e65f00;
    outline: none;
  }

  /* === Modal popup styles === */
  .modal {
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal-content {
    background: var(--white);
    padding: 2rem;
    max-width: 320px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 1rem;
  }

  .hidden {
    display: none !important;
  }

  .warning-text {
    color: var(--error-red);
    font-weight: bold;
  }

  /* === Quick Book Section === */
  #quickBook {
    margin-bottom: 2rem;
  }
  #quickBook h2 {
    margin-bottom: 1rem;
  }
  .quick-service {
    margin-bottom: 0.8rem;
  }
  #quickBookForm label,
  #quickBookForm input {
    width: 100%;
    padding: 15px 20px;
    margin: 0.3rem 0 1rem;
    border-radius: 6px;
    border: 2px solid var(--hi-vis-orange);
    font-size: 1rem;
    box-sizing: border-box;
  }
  #quickBookForm input:focus {
    border-color: var(--hi-vis-yellow);
    outline: none;
  }

  /* === Responsive tweaks === */
  @media (min-width: 600px) {
    body {
      padding: 2rem;
    }
  }
</style>
</head>
<body>

<header>
  <h1>Auto-mec Booking</h1>
  <button id="navToggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navMenu">
    <span></span><span></span><span></span>
  </button>
  <nav id="navMenu" aria-hidden="true">
    <a href="index.html">Home</a>
    <a href="booking-form.html">Book Service</a>
    <a href="admin.html">Admin Dashboard</a>
  </nav>
</header>

<main class="container">

  <!-- Quick Book Services Section -->
  <section id="quickBook">
    <h2>Quick Book Services</h2>
    <button type="button" class="btn btn-primary quick-service" data-service="Emergency Breakdown">
      Emergency Breakdown
    </button>
    <button type="button" class="btn btn-primary quick-service" data-service="Urgent Battery Replacement">
      Urgent Battery Replacement
    </button>
    <button type="button" class="btn btn-primary quick-service" data-service="Tyre Change ASAP">
      Tyre Change ASAP
    </button>

    <!-- Quick book customer details form -->
    <form id="quickBookForm" class="hidden" novalidate>
      <h3>Please confirm your details</h3>

      <label for="quickName">Full Name</label>
      <input type="text" id="quickName" name="quickName" required placeholder="Your full name" />

      <label for="quickPhone">Phone Number</label>
      <input type="text" id="quickPhone" name="quickPhone" required placeholder="Your phone number" />

      <p><strong>Service:</strong> <span id="quickServiceName"></span></p>
      <p><strong>Date:</strong> <span id="quickDate"></span></p>
      <p><strong>Time:</strong> <span id="quickTime"></span></p>
      <p><strong>Location:</strong> <span id="quickLocation">Waiting for GPS...</span></p>

      <button type="submit" class="btn btn-primary">Confirm Quick Booking</button>
    </form>
  </section>

  <!-- Main Booking Form -->
  <form id="bookingForm" novalidate>
    <button type="button" id="gpsBtn" class="btn btn-primary" aria-label="Use my GPS to detect location">Use My GPS</button>

    <label for="serviceType">Service Type</label>
    <select id="serviceType" name="serviceType" required>
      <option value="" disabled selected>Select service</option>
      <option value="Tyre Change">Tyre Change</option>
      <option value="Battery Replacement">Battery Replacement</option>
      <option value="Engine Diagnostics">Engine Diagnostics</option>
      <option value="Breakdown Recovery">Breakdown Recovery</option>
    </select>

    <label for="serviceDate">Date</label>
    <input type="date" id="serviceDate" name="serviceDate" required />

    <label for="serviceTime">Time</label>
    <input type="time" id="serviceTime" name="serviceTime" required />

    <label for="address">Location (auto-detected by GPS)</label>
    <input type="text" id="address" name="address" placeholder="Use GPS to fill this" disabled required />

    <label for="extraDetail">House name/number or additional info</label>
    <input type="text" id="extraDetail" name="extraDetail" placeholder="Optional" disabled />

    <!-- Info button to open GPS info modal -->
    <button type="button" id="infoBtn" class="btn btn-secondary" aria-label="Show why GPS location is required">ℹ️</button>

    <label for="description">Service Description</label>
    <textarea id="description" name="description" rows="4" placeholder="Describe your problem or request..." required></textarea>

    <button type="submit" class="btn btn-primary">Submit Booking</button>
  </form>

</main>

<!-- GPS Info Modal -->
<div id="gpsInfoModal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="gpsInfoTitle" aria-describedby="gpsInfoDesc">
  <div class="modal-content">
    <h2 id="gpsInfoTitle">Why GPS Location is Required</h2>
    <p id="gpsInfoDesc">
      We use your location to send the nearest available mobile mechanic.<br />
      <strong class="warning-text">Bookings without GPS may be declined.</strong>
    </p>
    <button id="closeGpsInfo" class="btn btn-primary">Close</button>
  </div>
</div>

<!-- Confirmation Modal -->
<div id="confirmationModal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="confirmationTitle" aria-describedby="confirmationDesc">
  <div class="modal-content">
    <div id="confirmationText"></div>
    <button id="closeModal" class="btn btn-primary">Close</button>
  </div>
</div>

<script src="booking-form.js" defer></script>

</body>
</html>