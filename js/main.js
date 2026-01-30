// ===================================
// DOM Elements
// ===================================
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// ===================================
// Navigation - Scroll Effect
// ===================================
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class to navbar
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (scrollTop > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    lastScrollTop = scrollTop;
});

// ===================================
// Mobile Menu Toggle
// ===================================
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===================================
// Smooth Scrolling for Navigation Links
// ===================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Scroll to Top Button
// ===================================
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Active Navigation Link Highlight
// ===================================
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// ===================================
// Contact Form Handling
// ===================================
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        empresa: document.getElementById('empresa').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        servicio: document.getElementById('servicio').value,
        mensaje: document.getElementById('mensaje').value.trim(),
        privacidad: document.getElementById('privacidad').checked,
        fecha: new Date().toISOString()
    };
    
    // Validation
    if (!formData.nombre || !formData.email || !formData.mensaje) {
        showMessage('Por favor, completa todos los campos obligatorios.', 'error');
        return;
    }
    
    if (!validateEmail(formData.email)) {
        showMessage('Por favor, introduce un email válido.', 'error');
        return;
    }
    
    if (!formData.privacidad) {
        showMessage('Debes aceptar la política de privacidad.', 'error');
        return;
    }
    
    // Disable submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        // Prepare email content
        const emailSubject = `Nueva consulta de ${formData.nombre} - SegurExpert Euskadi`;
        const emailBody = `
NUEVA CONSULTA WEB - SegurExpert Euskadi
========================================

DATOS DEL CLIENTE:
------------------
Nombre: ${formData.nombre}
Empresa: ${formData.empresa || 'No especificada'}
Email: ${formData.email}
Teléfono: ${formData.telefono || 'No proporcionado'}
Servicio de interés: ${formData.servicio || 'No especificado'}

MENSAJE:
--------
${formData.mensaje}

INFORMACIÓN ADICIONAL:
---------------------
Fecha: ${new Date(formData.fecha).toLocaleString('es-ES')}
Política de privacidad aceptada: Sí

========================================
Este mensaje fue enviado desde el formulario de contacto de SegurExpert Euskadi.
        `.trim();
        
        // Create mailto link (fallback method for static website)
        const mailtoLink = `mailto:segurexpert.euskadi@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showMessage('¡Gracias por tu consulta! Se abrirá tu cliente de correo para enviar el mensaje. Si no se abre automáticamente, por favor envía un email a segurexpert.euskadi@gmail.com', 'success');
        
        // Reset form after delay
        setTimeout(() => {
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        showMessage('Ha ocurrido un error. Por favor, contacta directamente a segurexpert.euskadi@gmail.com', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// ===================================
// Form Helper Functions
// ===================================
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 10 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 10000);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===================================
// Form Input Enhancements
// ===================================
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');

formInputs.forEach(input => {
    // Add focus animation
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        
        // Validate on blur
        if (input.hasAttribute('required') && input.value.trim() === '') {
            input.style.borderColor = '#e53e3e';
        } else {
            input.style.borderColor = '';
        }
    });
    
    // Real-time validation for email
    if (input.type === 'email') {
        input.addEventListener('input', () => {
            if (input.value && !validateEmail(input.value)) {
                input.style.borderColor = '#e53e3e';
            } else {
                input.style.borderColor = '';
            }
        });
    }
});

// ===================================
// Scroll Animations (Intersection Observer)
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.service-card, .benefit-item, .value-item, .feature-box, .contact-item');

animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ===================================
// Scroll Indicator Animation
// ===================================
const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const quienesSomosSection = document.getElementById('quienes-somos');
        if (quienesSomosSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = quienesSomosSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// ===================================
// Counter Animation for Stats (if needed in future)
// ===================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===================================
// Page Load Animations
// ===================================
window.addEventListener('load', () => {
    // Fade in hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
    
    // Initialize active section highlight
    highlightActiveSection();
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c¡Bienvenido a SegurExpert Euskadi!', 'color: #4a7ba7; font-size: 20px; font-weight: bold;');
console.log('%cConsultoría especializada en gestión de riesgos y emergencias', 'color: #718096; font-size: 14px;');
console.log('%cDesarrollado con ❤️ para proteger lo que más importa', 'color: #2c4a6f; font-size: 12px;');

// ===================================
// Prevent Form Resubmission on Page Refresh
// ===================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ===================================
// Performance Optimization - Debounce Scroll
// ===================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedHighlight = debounce(highlightActiveSection, 100);
window.addEventListener('scroll', debouncedHighlight);

// ===================================
// Accessibility Enhancements
// ===================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu on ESC key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ===================================
// Dynamic Copyright Year (Footer)
// ===================================
const updateCopyrightYear = () => {
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} SegurExpert Euskadi. Todos los derechos reservados.`;
    }
};

updateCopyrightYear();