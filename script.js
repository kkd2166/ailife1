// Navigation functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('/').pop();
        
        // Check if current page matches link
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else if ((currentPage === '' || currentPage === 'index.html' || currentPage.endsWith('/')) && linkPage === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Initialize active nav link
setActiveNavLink();

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links (only if they are anchors on the same page)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default if it's an anchor link on the same page
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for project card animations
const projectObserverOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const card = entry.target;
            
            // Animate card entrance
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            
            // Add animated class to trigger content animations
            card.classList.add('animated');
            
            // Unobserve after animation starts
            projectObserver.unobserve(card);
        }
    });
}, projectObserverOptions);

// Initialize project cards with animations
function initProjectCardsAnimation() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.95)';
        card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        projectObserver.observe(card);
    });
}

// Load projects/interests from JSON and render
function loadProjectsFromJSON() {
    const projectsGrid = document.getElementById('projectsGrid');

    // 다른 페이지에는 이 요소가 없을 수 있으므로, 없으면 바로 리턴
    if (!projectsGrid) {
        initProjectCardsAnimation();
        return;
    }

    fetch('projects.json')
        .then(response => response.json())
        .then(projects => {
            projectsGrid.innerHTML = '';

            projects.forEach((project) => {
                const card = document.createElement('div');
                card.className = 'project-card interest-card';

                let visualHtml = '';
                if (project.visual === 'soccer') {
                    visualHtml = `
                        <div class="interest-visual soccer-visual">
                            <div class="soccer-field">
                                <div class="field-lines">
                                    <div class="center-circle"></div>
                                    <div class="penalty-box left"></div>
                                    <div class="penalty-box right"></div>
                                    <div class="center-line"></div>
                                </div>
                                <div class="soccer-ball"></div>
                            </div>
                        </div>
                    `;
                } else if (project.visual === 'game') {
                    visualHtml = `
                        <div class="interest-visual game-visual">
                            <div class="game-screen lol-style">
                                <div class="lol-minimap"></div>
                                <div class="lol-skills">
                                    <div class="lol-skill"></div>
                                    <div class="lol-skill"></div>
                                    <div class="lol-skill"></div>
                                    <div class="lol-skill"></div>
                                </div>
                                <div class="lol-champion"></div>
                                <div class="lol-healthbar"></div>
                            </div>
                        </div>
                    `;
                }

                const descriptionHtml = Array.isArray(project.description)
                    ? project.description.join('<br>')
                    : project.description;

                const tagsHtml = Array.isArray(project.tags)
                    ? project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')
                    : '';

                card.innerHTML = `
                    <div class="project-image">
                        ${visualHtml}
                        <div class="project-overlay">
                            <span class="project-category">${project.category}</span>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">
                            ${descriptionHtml}
                        </p>
                        <div class="project-tech">
                            ${tagsHtml}
                        </div>
                    </div>
                `;

                projectsGrid.appendChild(card);
            });

            // JSON으로부터 생성된 카드들에 애니메이션 적용
            initProjectCardsAnimation();
        })
        .catch(() => {
            // JSON 로드에 실패하면 기존 카드(있다면)에만 애니메이션 적용
            initProjectCardsAnimation();
        });
}

// 페이지 로드 시 JSON 기반 프로젝트 로딩 시도
document.addEventListener('DOMContentLoaded', loadProjectsFromJSON);

// Load index (home) hero content from JSON
function loadIndexFromJSON() {
    const heroBadge = document.getElementById('heroBadge');
    const heroTitleLine = document.getElementById('heroTitleLine');
    const heroDescription = document.getElementById('heroDescription');
    const heroCta = document.getElementById('heroCta');

    // index 페이지가 아닐 수 있으니 요소가 없으면 리턴
    if (!heroBadge || !heroTitleLine || !heroDescription || !heroCta) {
        return;
    }

    fetch('index.json')
        .then(response => response.json())
        .then(data => {
            if (!data.hero) return;
            const hero = data.hero;

            if (hero.badge) {
                heroBadge.textContent = hero.badge;
            }
            if (hero.titleLine) {
                // titleLine에는 강조 span 등이 포함될 수 있어 HTML로 삽입
                heroTitleLine.innerHTML = hero.titleLine;
            }
            if (Array.isArray(hero.description)) {
                heroDescription.innerHTML = hero.description.join('<br>');
            }
            if (hero.ctaText) {
                heroCta.textContent = hero.ctaText;
            }
            if (hero.ctaHref) {
                heroCta.setAttribute('href', hero.ctaHref);
            }
        })
        .catch(() => {
            // JSON 로드 실패 시, 기존 정적 콘텐츠 유지
        });
}

// 페이지 로드 시 index 콘텐츠도 JSON에서 로딩
document.addEventListener('DOMContentLoaded', loadIndexFromJSON);

// Load contact info from JSON and render
function loadContactFromJSON() {
    const contactTitle = document.getElementById('contactTitle');
    const contactSubtitle = document.getElementById('contactSubtitle');
    const contactInfo = document.getElementById('contactInfo');

    // Contact 페이지가 아닐 수도 있으니 요소가 없으면 리턴
    if (!contactInfo || !contactTitle || !contactSubtitle) {
        return;
    }

    fetch('contact.json')
        .then(response => response.json())
        .then(data => {
            // 제목/부제 갱신
            if (data.title) {
                contactTitle.textContent = data.title;
            }
            if (data.subtitle) {
                contactSubtitle.textContent = data.subtitle;
            }

            // 정보 아이템 렌더링
            contactInfo.innerHTML = '';

            if (Array.isArray(data.items)) {
                data.items.forEach(item => {
                    const infoItem = document.createElement('div');
                    infoItem.className = 'info-item';

                    infoItem.innerHTML = `
                        <div class="info-icon">${item.icon || ''}</div>
                        <div class="info-content">
                            <h4>${item.heading || ''}</h4>
                            <p>${item.text || ''}</p>
                        </div>
                    `;

                    contactInfo.appendChild(infoItem);
                });
            }
        })
        .catch(() => {
            // JSON 로드 실패 시, 기존 정적인 HTML이 이미 없으므로 별도 처리 생략
        });
}

// 페이지 로드 시 Contact 정보도 JSON에서 로딩
document.addEventListener('DOMContentLoaded', loadContactFromJSON);

// Load career page content from JSON and render
function loadCareerFromJSON() {
    const careerTitle = document.getElementById('careerTitle');
    const careerSubtitle = document.getElementById('careerSubtitle');
    const careerCardTitle = document.getElementById('careerCardTitle');
    const careerDescription = document.getElementById('careerDescription');

    // Career 페이지가 아닐 수 있으니 요소가 없으면 리턴
    if (!careerTitle || !careerSubtitle || !careerCardTitle || !careerDescription) {
        return;
    }

    fetch('career.json')
        .then(response => response.json())
        .then(data => {
            if (data.title) {
                careerTitle.textContent = data.title;
            }
            if (data.subtitle) {
                careerSubtitle.textContent = data.subtitle;
            }
            if (data.cardTitle) {
                careerCardTitle.textContent = data.cardTitle;
            }
            if (data.description) {
                // description은 \n 을 포함한 하나의 문자열이므로 그대로 넣으면
                // white-space: pre-line; 스타일에 의해 줄바꿈이 유지됨
                careerDescription.textContent = data.description;
            }
        })
        .catch(() => {
            // JSON 로드 실패 시 기존 정적 텍스트 유지
        });
}

// 페이지 로드 시 Career 콘텐츠도 JSON에서 로딩
document.addEventListener('DOMContentLoaded', loadCareerFromJSON);

// Form validation and submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Validation functions
function validateName(name) {
    if (name.trim().length < 2) {
        return '이름은 최소 2자 이상이어야 합니다.';
    }
    return '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return '올바른 이메일 형식을 입력해주세요.';
    }
    return '';
}

function validateSubject(subject) {
    if (subject.trim().length < 3) {
        return '제목은 최소 3자 이상이어야 합니다.';
    }
    return '';
}

function validateMessage(message) {
    if (message.trim().length < 10) {
        return '메시지는 최소 10자 이상이어야 합니다.';
    }
    return '';
}

// Real-time validation
const formInputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message')
};

Object.keys(formInputs).forEach(key => {
    const input = formInputs[key];
    const errorElement = input.parentElement.querySelector('.error-message');
    
    input.addEventListener('blur', () => {
        let error = '';
        
        switch(key) {
            case 'name':
                error = validateName(input.value);
                break;
            case 'email':
                error = validateEmail(input.value);
                break;
            case 'subject':
                error = validateSubject(input.value);
                break;
            case 'message':
                error = validateMessage(input.value);
                break;
        }
        
        errorElement.textContent = error;
        if (error) {
            input.style.borderColor = '#ef4444';
        } else {
            input.style.borderColor = '#10b981';
        }
    });
    
    input.addEventListener('input', () => {
        if (errorElement.textContent) {
            errorElement.textContent = '';
            input.style.borderColor = '#e5e7eb';
        }
    });
});

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous messages
    formMessage.className = 'form-message';
    formMessage.textContent = '';
    
    // Get form values
    const formData = {
        name: formInputs.name.value.trim(),
        email: formInputs.email.value.trim(),
        subject: formInputs.subject.value.trim(),
        message: formInputs.message.value.trim()
    };
    
    // Validate all fields
    const errors = {
        name: validateName(formData.name),
        email: validateEmail(formData.email),
        subject: validateSubject(formData.subject),
        message: validateMessage(formData.message)
    };
    
    // Display errors
    let hasErrors = false;
    Object.keys(errors).forEach(key => {
        const error = errors[key];
        const input = formInputs[key];
        const errorElement = input.parentElement.querySelector('.error-message');
        
        if (error) {
            errorElement.textContent = error;
            input.style.borderColor = '#ef4444';
            hasErrors = true;
        } else {
            errorElement.textContent = '';
            input.style.borderColor = '#e5e7eb';
        }
    });
    
    if (hasErrors) {
        formMessage.className = 'form-message error';
        formMessage.textContent = '모든 필드를 올바르게 입력해주세요.';
        formMessage.style.display = 'block';
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('.submit-button');
    submitButton.textContent = '전송 중...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        formMessage.className = 'form-message success';
        formMessage.textContent = '메시지가 성공적으로 전송되었습니다! 곧 연락드리겠습니다.';
        formMessage.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        Object.values(formInputs).forEach(input => {
            input.style.borderColor = '#e5e7eb';
            input.parentElement.querySelector('.error-message').textContent = '';
        });
        
        submitButton.textContent = '메시지 보내기';
        submitButton.disabled = false;
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }, 1500);
});

// Add parallax effect to hero shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.floating-shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Add active state to navigation based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
