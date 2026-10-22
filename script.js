const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      card.classList.toggle("is-hidden", category !== "all" && card.dataset.category !== category);
    });
  });
});

const comparison = document.querySelector(".comparison-range");
const beforeAfter = document.querySelector("[data-slider]");

comparison.addEventListener("input", () => {
  beforeAfter.style.setProperty("--split", `${comparison.value}%`);
  comparison.setAttribute(
    "aria-valuetext",
    `${comparison.value}% before, ${100 - Number(comparison.value)}% after`,
  );
});

const form = document.querySelector("#consultation-form");
const successMessage = document.querySelector("#form-success");
const sendConsultation = document.querySelector("#send-consultation");
const fieldIds = ["name", "phone", "property", "budget"];

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  wrapper.classList.toggle("has-error", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  wrapper.querySelector(".field-error").textContent = message;
}

function validateForm() {
  let isValid = true;
  const name = form.elements.name;
  const phone = form.elements.phone;
  const property = form.elements.property;
  const budget = form.elements.budget;
  const digits = phone.value.replace(/\D/g, "");
  const phoneDigits = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  const errors = {
    name: name.value.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters).",
    phone: /^[6-9]\d{9}$/.test(phoneDigits) ? "" : "Enter a valid 10-digit Indian mobile number.",
    property: property.value ? "" : "Please select your property type.",
    budget: budget.value ? "" : "Please select an investment range.",
  };

  fieldIds.forEach((id) => {
    const field = form.elements[id];
    setFieldError(field, errors[id]);
    if (errors[id]) isValid = false;
  });
  return isValid;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.hidden = true;

  if (!validateForm()) {
    const firstInvalid = fieldIds.map((id) => form.elements[id]).find((field) => field.getAttribute("aria-invalid") === "true");
    firstInvalid.focus();
    return;
  }

  const message = [
    "Hello Hues Architects And Interior Designers, I'd like to ask about architecture or interior design.",
    `Name: ${form.elements.name.value.trim()}`,
    `Phone: ${form.elements.phone.value.trim()}`,
    `Property: ${form.elements.property.value}`,
    `Investment range: ${form.elements.budget.value}`,
  ].join("\n");
  sendConsultation.href = `https://wa.me/919822043160?text=${encodeURIComponent(message)}`;
  form.querySelector(".form-submit").hidden = true;
  successMessage.hidden = false;
  successMessage.focus();
});

fieldIds.forEach((id) => {
  const field = form.elements[id];
  field.addEventListener(field.tagName === "SELECT" ? "change" : "input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateForm();
  });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
