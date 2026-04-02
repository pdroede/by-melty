document.getElementById("year").textContent = String(new Date().getFullYear());

/**
 * Stripe Payment Link: set window.BYMELTY_STRIPE_PAYMENT_LINK in stripe-config.js
 */
function isStripeCheckoutUrl(url) {
  return (
    typeof url === "string" &&
    url.indexOf("https://") === 0 &&
    /stripe\.com/i.test(url)
  );
}

function applyStripePaymentLink() {
  var url = window.BYMELTY_STRIPE_PAYMENT_LINK;
  var isValid = isStripeCheckoutUrl(url);

  document.querySelectorAll("[data-stripe-payment-link]").forEach(function (el) {
    if (isValid) {
      el.href = url;
      el.removeAttribute("aria-disabled");
      el.classList.remove("btn--disabled");
    } else {
      el.href = "#buy";
      el.setAttribute("aria-disabled", "true");
      el.classList.add("btn--disabled");
      el.addEventListener("click", function (e) {
        e.preventDefault();
      });
    }
  });

  var hint = document.getElementById("stripe-hint");
  if (hint) {
    hint.hidden = isValid;
  }
}

applyStripePaymentLink();

/** Trigger .is-visible on sections with entrance animations */
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".diced-hero").forEach(function (el) {
    observer.observe(el);
  });
})();

/** Plausible: goal "CTA Click" with props.location */
function trackClick(location) {
  if (typeof window.plausible === "function") {
    window.plausible("CTA Click", { props: { location: String(location) } });
  }
}

document.querySelectorAll("[data-track]").forEach(function (el) {
  el.addEventListener("click", function () {
    trackClick(el.getAttribute("data-track") || "unknown");
  });
});
