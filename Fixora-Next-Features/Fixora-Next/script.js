/* =====================================================
   FIXORA — MAIN SCRIPT
   Login • Signup • Booking • Payment • Tracking
===================================================== */

"use strict";


/* =====================================================
   HELPERS
===================================================== */

const $ = (id) => document.getElementById(id);

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("fixoraUser")) || null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem("fixoraUser", JSON.stringify(user));
}

function getBookings() {
  try {
    return JSON.parse(
      localStorage.getItem("fixoraBookings")
    ) || [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(
    "fixoraBookings",
    JSON.stringify(bookings)
  );
}

function showToast(message) {

  const toast = $("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function isLoggedIn() {
  return localStorage.getItem("fixoraLoggedIn") === "true";
}

function requireLogin() {

  if (!getUser() || !isLoggedIn()) {

    showToast("Please login to continue.");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 700);

    return false;
  }

  return true;
}


/* =====================================================
   SIGN UP
===================================================== */

const signupForm = $("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
      $("signupName")?.value.trim();

    const email =
      $("signupEmail")?.value.trim().toLowerCase();

    const phone =
      $("signupPhone")?.value.trim();

    const password =
      $("signupPassword")?.value;

    const confirmPassword =
      $("signupConfirm")?.value;


    if (!name || !email || !phone || !password) {

      alert("Please fill all required fields.");

      return;
    }


    if (phone.length < 10) {

      alert("Please enter a valid phone number.");

      return;
    }


    if (password.length < 6) {

      alert(
        "Password must contain at least 6 characters."
      );

      return;
    }


    if (password !== confirmPassword) {

      alert("Passwords do not match.");

      return;
    }


    const existingUser = getUser();

    if (
      existingUser &&
      existingUser.email === email
    ) {

      alert(
        "An account with this email already exists."
      );

      window.location.href = "login.html";

      return;
    }


    const user = {

      name,
      email,
      phone,
      password,

      createdAt:
        new Date().toISOString()

    };


    saveUser(user);

    localStorage.setItem(
      "fixoraLoggedIn",
      "false"
    );


    alert(
      "🎉 Account created successfully!"
    );


    window.location.href =
      "login.html";

  });
}


/* =====================================================
   LOGIN
===================================================== */

const loginForm = $("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const email =
      $("loginEmail")?.value
        .trim()
        .toLowerCase();

    const password =
      $("loginPassword")?.value;


    if (!email || !password) {

      alert(
        "Please enter your email and password."
      );

      return;
    }


    const user = getUser();


    if (!user) {

      alert(
        "No account found. Please create an account first."
      );

      setTimeout(() => {

        window.location.href =
          "signup.html";

      }, 500);

      return;
    }


    if (
      email !== user.email ||
      password !== user.password
    ) {

      alert(
        "❌ Incorrect email or password."
      );

      return;
    }


    localStorage.setItem(
      "fixoraLoggedIn",
      "true"
    );


    const remember =
      $("rememberMe")?.checked;

    localStorage.setItem(
      "fixoraRemember",
      remember ? "true" : "false"
    );


    alert(
      `Welcome back, ${user.name}! 👋`
    );


    window.location.href =
      "index.html";

  });
}


/* =====================================================
   NAVBAR
===================================================== */

function updateNavbar() {

  const user = getUser();

  const welcome =
    $("userWelcome");

  const loginBtn =
    $("loginBtn");

  const logoutBtn =
    $("logoutBtn");


  if (!welcome) return;


  if (
    user &&
    isLoggedIn()
  ) {

    welcome.textContent =
      `Hi, ${user.name}`;

    if (loginBtn) {

      loginBtn.classList.add(
        "hidden"
      );

    }

    if (logoutBtn) {

      logoutBtn.classList.remove(
        "hidden"
      );

    }

  } else {

    welcome.textContent = "";

    if (loginBtn) {

      loginBtn.classList.remove(
        "hidden"
      );

    }

    if (logoutBtn) {

      logoutBtn.classList.add(
        "hidden"
      );

    }

  }
}

updateNavbar();


/* =====================================================
   LOGOUT
===================================================== */

if ($("logoutBtn")) {

  $("logoutBtn").addEventListener(
    "click",
    function () {

      localStorage.setItem(
        "fixoraLoggedIn",
        "false"
      );

      showToast(
        "Logged out successfully."
      );

      setTimeout(() => {

        window.location.reload();

      }, 700);

    }
  );
}


/* =====================================================
   BOOK SERVICE
===================================================== */

document
  .querySelectorAll(".bookBtn")
  .forEach((button) => {

    button.addEventListener(
      "click",
      function () {

        if (!requireLogin()) {
          return;
        }


        const card =
          button.closest(
            ".service-card"
          );


        if (!card) return;


        const service =
          card.dataset.service;


        if ($("serviceInput")) {

          $("serviceInput").value =
            service;

        }


        if ($("bookingModal")) {

          $("bookingModal")
            .classList
            .remove("hidden");

        }

      }
    );

  });


/* =====================================================
   CLOSE MODALS
===================================================== */

if ($("closeBooking")) {

  $("closeBooking").addEventListener(
    "click",
    () => {

      $("bookingModal")
        ?.classList
        .add("hidden");

    }
  );

}


if ($("closePayment")) {

  $("closePayment").addEventListener(
    "click",
    () => {

      $("paymentModal")
        ?.classList
        .add("hidden");

    }
  );

}


if ($("closeTracking")) {

  $("closeTracking").addEventListener(
    "click",
    () => {

      $("trackingModal")
        ?.classList
        .add("hidden");

    }
  );

}


/* =====================================================
   BOOKING FORM
===================================================== */

let pendingBooking = null;

const bookingForm =
  $("bookingForm");


if (bookingForm) {

  bookingForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      if (!requireLogin()) {
        return;
      }


      const service =
        $("serviceInput")?.value;

      const professional =
        $("professionalInput")?.value;

      const date =
        $("dateInput")?.value;

      const time =
        $("timeInput")?.value;

      const address =
        $("addressInput")?.value.trim();

      const problem =
        $("problemInput")?.value.trim();

      const payment =
        $("paymentInput")?.value;


      if (
        !service ||
        !professional ||
        !date ||
        !time ||
        !address
      ) {

        alert(
          "Please complete all booking details."
        );

        return;
      }


      const selectedDate =
        new Date(`${date}T${time}`);

      if (
        selectedDate <
        new Date()
      ) {

        alert(
          "Please select a future date and time."
        );

        return;
      }


      pendingBooking = {

        service,

        professional,

        date,

        time,

        address,

        problem,

        payment,

        amount: 499

      };


      $("bookingModal")
        ?.classList
        .add("hidden");


      if ($("paymentSummary")) {

        $("paymentSummary").innerHTML = `

          <h3>${service}</h3>

          <p>
            👨‍🔧 Professional:
            <strong>${professional}</strong>
          </p>

          <p>
            📅 Date:
            <strong>${date}</strong>
          </p>

          <p>
            ⏰ Time:
            <strong>${time}</strong>
          </p>

          <p>
            📍 Address:
            <strong>${address}</strong>
          </p>

          <hr>

          <h2>
            Total: ₹${pendingBooking.amount}
          </h2>

        `;

      }


      if ($("paymentModal")) {

        $("paymentModal")
          .classList
          .remove("hidden");

      }

    }
  );

}


/* =====================================================
   PAYMENT METHOD
===================================================== */

document
  .querySelectorAll(
    ".payment-methods button"
  )
  .forEach((button) => {

    button.addEventListener(
      "click",
      function () {

        document
          .querySelectorAll(
            ".payment-methods button"
          )
          .forEach((item) => {

            item.classList.remove(
              "selected"
            );

          });


        button.classList.add(
          "selected"
        );


        if (pendingBooking) {

          pendingBooking.payment =
            button.dataset.method;

        }

      }
    );

  });


/* =====================================================
   PAYMENT + BOOKING CONFIRMATION
===================================================== */

if ($("payButton")) {

  $("payButton").addEventListener(
    "click",
    function () {

      if (!pendingBooking) {

        alert(
          "Please create a booking first."
        );

        return;
      }


      const bookingId =
        "FX" +
        Date.now()
          .toString()
          .slice(-8);


      const transactionId =
        "TX" +
        Date.now()
          .toString()
          .slice(-8);


      const booking = {

        ...pendingBooking,

        id: bookingId,

        transactionId,

        status: "Confirmed",

        trackingStep: 2,

        createdAt:
          new Date().toISOString()

      };


      const bookings =
        getBookings();


      bookings.unshift(
        booking
      );


      saveBookings(
        bookings
      );


      $("paymentModal")
        ?.classList
        .add("hidden");


      pendingBooking = null;


      alert(
        `✅ Booking Confirmed!\n\nBooking ID: ${bookingId}\nTransaction ID: ${transactionId}`
      );


      renderBookings();


      const bookingSection =
        $("bookings");


      if (bookingSection) {

        bookingSection.scrollIntoView({
          behavior: "smooth"
        });

      }

    }
  );

}


/* =====================================================
   RENDER BOOKINGS
===================================================== */

function renderBookings() {

  const list =
    $("bookingList");


  if (!list) return;


  const bookings =
    getBookings();


  if (!bookings.length) {

    list.innerHTML = `

      <div class="empty-state">

        <div>📅</div>

        <h3>No bookings yet</h3>

        <p>
          Book your first Fixora service.
        </p>

      </div>

    `;

    return;
  }


  list.innerHTML =
    bookings
      .map((booking) => {

        const statusClass =
          booking.status ===
          "Cancelled"
            ? "cancelled"
            : "";


        return `

          <div
            class="booking-card ${statusClass}"
          >

            <div class="booking-top">

              <div>

                <span class="status">

                  ${
                    booking.status ===
                    "Cancelled"
                      ? "✕ Cancelled"
                      : "✓ " +
                        booking.status
                  }

                </span>

                <h3>
                  ${booking.service}
                </h3>

                <p>
                  Booking ID:
                  <strong>
                    ${booking.id}
                  </strong>
                </p>

              </div>


              <div class="booking-price">
                ₹${booking.amount}
              </div>

            </div>


            <div class="booking-details">

              <div>

                📅

                <strong>
                  Date
                </strong>

                <span>
                  ${booking.date}
                </span>

              </div>


              <div>

                ⏰

                <strong>
                  Time
                </strong>

                <span>
                  ${booking.time}
                </span>

              </div>


              <div>

                👨‍🔧

                <strong>
                  Professional
                </strong>

                <span>
                  ${booking.professional}
                </span>

              </div>


              <div>

                📍

                <strong>
                  Address
                </strong>

                <span>
                  ${booking.address}
                </span>

              </div>

            </div>


            <div class="booking-actions">

              ${
                booking.status !==
                "Cancelled"

                ? `

                  <button
                    class="btn"
                    onclick="
                      trackBooking('${booking.id}')
                    "
                  >
                    🚗 Track
                  </button>

                  <button
                    class="btn outline"
                    onclick="
                      viewInvoice('${booking.id}')
                    "
                  >
                    🧾 Invoice
                  </button>

                  <button
                    class="btn danger"
                    onclick="
                      cancelBooking('${booking.id}')
                    "
                  >
                    Cancel
                  </button>

                `

                : `

                  <button
                    class="btn outline"
                    onclick="
                      viewInvoice('${booking.id}')
                    "
                  >
                    🧾 View Invoice
                  </button>

                `
              }

            </div>

          </div>

        `;

      })
      .join("");

}


/* =====================================================
   TRACK BOOKING
===================================================== */

function trackBooking(id) {

  const booking =
    getBookings().find(
      (item) =>
        item.id === id
    );


  if (!booking) return;


  if ($("trackingDetails")) {

    $("trackingDetails").innerHTML = `

      <div class="track-summary">

        <h3>
          ${booking.service}
        </h3>

        <p>
          🆔 Booking ID:
          ${booking.id}
        </p>

        <p>
          👨‍🔧
          ${booking.professional}
        </p>

        <p>
          📅
          ${booking.date}
          &nbsp;
          ⏰
          ${booking.time}
        </p>

        <p>
          📍
          ${booking.address}
        </p>

      </div>

    `;

  }


  if ($("trackingModal")) {

    $("trackingModal")
      .classList
      .remove("hidden");

  }

}


/* =====================================================
   CANCEL BOOKING
===================================================== */

function cancelBooking(id) {

  const booking =
    getBookings().find(
      (item) =>
        item.id === id
    );


  if (!booking) return;


  const confirmed =
    confirm(
      `Cancel your ${booking.service} booking?`
    );


  if (!confirmed) {
    return;
  }


  const bookings =
    getBookings();


  const updated =
    bookings.map(
      (item) => {

        if (item.id === id) {

          return {

            ...item,

            status:
              "Cancelled",

            cancelledAt:
              new Date().toISOString()

          };

        }


        return item;

      }
    );


  saveBookings(
    updated
  );


  renderBookings();


  showToast(
    "Booking cancelled successfully."
  );

}


/* =====================================================
   INVOICE
===================================================== */

function viewInvoice(id) {

  const booking =
    getBookings().find(
      (item) =>
        item.id === id
    );


  if (!booking) return;


  alert(

`━━━━━━━━━━━━━━━━━━━━
       FIXORA
      INVOICE
━━━━━━━━━━━━━━━━━━━━

Booking ID:
${booking.id}

Service:
${booking.service}

Professional:
${booking.professional}

Date:
${booking.date}

Time:
${booking.time}

Payment:
${booking.payment}

Transaction ID:
${booking.transactionId}

Amount:
₹${booking.amount}

Status:
${booking.status}

━━━━━━━━━━━━━━━━━━━━
Thank you for choosing Fixora!
━━━━━━━━━━━━━━━━━━━━`

  );

}


/* =====================================================
   AUTO-FILL REMEMBERED EMAIL
===================================================== */

if ($("loginEmail")) {

  const rememberedEmail =
    localStorage.getItem(
      "fixoraRememberedEmail"
    );


  if (rememberedEmail) {

    $("loginEmail").value =
      rememberedEmail;

  }

}


/* =====================================================
   REMEMBER ME
===================================================== */

if ($("loginForm")) {

  $("loginForm")
    .addEventListener(
      "submit",
      function () {

        const remember =
          $("rememberMe")?.checked;


        if (
          remember &&
          $("loginEmail")
        ) {

          localStorage.setItem(
            "fixoraRememberedEmail",
            $("loginEmail").value
          );

        } else {

          localStorage.removeItem(
            "fixoraRememberedEmail"
          );

        }

      }
    );

}


/* =====================================================
   SET MINIMUM BOOKING DATE
===================================================== */

if ($("dateInput")) {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  $("dateInput").min =
    today;

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    updateNavbar();

    renderBookings();

  }
);
