// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  const icon = hamburger.querySelector("i");
  if (navLinks.classList.contains("active")) {
    icon.classList.replace("fa-bars", "fa-times");
  } else {
    icon.classList.replace("fa-times", "fa-bars");
  }
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamburger.querySelector("i").classList.replace("fa-times", "fa-bars");
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Scroll indicator
window.addEventListener("scroll", () => {
  const scrollIndicator = document.getElementById("scrollIndicator");
  if (scrollIndicator) {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollIndicator.style.width = scrollPercent + "%";
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up");
    }
  });
}, observerOptions);

// Observe sections and cards
document
  .querySelectorAll(
    ".section, .experience-card, .portfolio-item, .about-column"
  )
  .forEach((el) => {
    observer.observe(el);
  });

// ✅ FIXED Contact Form with EmailJS
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  console.log("Form submitted - starting validation and sending process");

  const formData = new FormData(this);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const subject = formData.get("subject").trim();
  const message = formData.get("message").trim();

  // Enhanced validation
  if (!name || !email || !subject || !message) {
    alert("Please fill in all fields.");
    return;
  }

  // ✅ Name validation: No number/space at beginning
  const nameRegex = /^[A-Za-z][A-Za-z\s]*$/;
  if (!nameRegex.test(name)) {
    alert("Name must start with a letter and contain only letters and spaces.");
    return;
  }

  // ✅ Email validation: Only specific domains allowed
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
  ];
  const emailParts = email.split("@");
  if (
    emailParts.length !== 2 ||
    !allowedDomains.includes(emailParts[1].toLowerCase())
  ) {
    alert(
      "Only Gmail, Yahoo, Outlook, or Hotmail email addresses are allowed."
    );
    return;
  }

  // Additional email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Show loading state
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.7";

  // ✅ FIXED: Prepare template parameters with proper structure
  const templateParams = {
    from_name: name,
    from_email: email,
    to_name: "Siba Prasad Nayak", // Your name
    subject: subject,
    message: message,
  };

  console.log("Template parameters prepared:", templateParams);

  // ✅ FIXED: Use consistent service ID and template ID
  emailjs
    .send(
      "service_f02ci0h", // Your EmailJS service ID
      "template_lkecmtb", // Your EmailJS template ID
      templateParams
    )
    .then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);

        // Success feedback
        alert("✅ Message sent successfully! I'll get back to you soon.");

        // Reset form
        document.getElementById("contactForm").reset();

        // Optional: Show success message in a better way
        showNotification("Message sent successfully!", "success");
      },
      function (error) {
        console.error("FAILED...", error);

        // Enhanced error handling
        let errorMessage = "❌ Failed to send message. ";

        if (error.status === 422) {
          errorMessage += "Please check your EmailJS template configuration.";
        } else if (error.status === 400) {
          errorMessage += "Invalid request. Please try again.";
        } else if (error.status === 401) {
          errorMessage +=
            "Authentication failed. Please contact the website owner.";
        } else {
          errorMessage += "Please try again later or contact me directly.";
        }

        alert(errorMessage);

        // Optional: Show error notification
        showNotification("Failed to send message. Please try again.", "error");
      }
    )
    .finally(() => {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    });
});

// ✅ Enhanced notification system (optional)
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"
    };
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
    word-wrap: break-word;
  `;

  // Add slide-in animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Active link on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Parallax hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// Typing effect
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-text h1");
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 100);
  }
});

// Portfolio item animations
const portfolioItems = document.querySelectorAll(".portfolio-item");
portfolioItems.forEach((item, index) => {
  item.style.animationDelay = `${index * 0.1}s`;
});

// Hover effect on experience cards
document.querySelectorAll(".experience-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(-10px) scale(1)";
  });
});

// Auto update footer year
const currentYear = new Date().getFullYear();
const footerText = document.querySelector("footer p");
if (footerText) {
  footerText.innerHTML = footerText.innerHTML.replace("2025", currentYear);
}

// ✅ EmailJS Debug Helper (Remove in production)
function debugEmailJS() {
  console.log("EmailJS Debug Information:");
  console.log("- EmailJS loaded:", typeof emailjs !== "undefined");
  console.log(
    "- Form element exists:",
    document.getElementById("contactForm") !== null
  );
  console.log("- Service ID: service_f02ci0h");
  console.log("- Template ID: template_lkecmtb");
  console.log("- Public Key: VJ_EOMGqPkyXbWrvD");
}
