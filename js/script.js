// ===== CONFIGURATION =====
const CONFIG = {
    scrollOffset: 100,
    animationDelay: 100,
    hoverIntensity: 1.2
};

// Determine base URL for GitHub Pages
const getBaseUrl = () => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    if (hostname.endsWith('github.io') && pathname !== '/') {
        // For project pages like username.github.io/repo-name/
        const repoName = pathname.split('/')[1];
        return `/${repoName}`;
    }
    // For custom domains or root deployments (username.github.io/)
    return '';
};

const BASE_URL = getBaseUrl();

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    adjustHrefsForGitHubPages(); // Call this first to adjust all links
    initializeNavigation();
    initializeScrollEffects();
    initializeHoverEffects();
    initializeIntersectionObserver();
    initializeSmoothScrolling();
    initializeSvtLevels();
    initializeTabbedInterfaces();
    initializeExercises();
    initializeSideMenu();
    initializeVisionCarousel();
    initializeContactForm();
    initializeThemeSwitcher();
    loadAndUpdateResourceStats(); // Essayer de charger les stats depuis le fichier JSON, sinon utiliser les données de secours
    initializeSmartNavigation();
});

// ===== SVT LEVELS =====
function initializeSvtLevels() {
    const collegeCard = document.getElementById('college-card');
    const lyceeCard = document.getElementById('lycee-card');
    const collegeGrid = document.getElementById('college-levels-grid');
    const lyceeGrid = document.getElementById('lycee-levels-grid');

    if (collegeCard && lyceeCard && collegeGrid && lyceeGrid) {
        // Charger les niveaux disponibles dynamiquement
        loadAvailableLevels();

        collegeCard.addEventListener('click', () => {
            if (collegeGrid.children.length > 0) {
                collegeGrid.style.display = 'grid';
                lyceeGrid.style.display = 'none';
                collegeCard.classList.add('active');
                lyceeCard.classList.remove('active');
            }
        });

        lyceeCard.addEventListener('click', () => {
            if (lyceeGrid.children.length > 0) {
                lyceeGrid.style.display = 'grid';
                collegeGrid.style.display = 'none';
                lyceeCard.classList.add('active');
                collegeCard.classList.remove('active');
            }
        });
    }
}

// Charger les niveaux qui ont du contenu
async function loadAvailableLevels() {
    console.log('Début du chargement des niveaux disponibles...');

    const collegeGrid = document.getElementById('college-levels-grid');
    const lyceeGrid = document.getElementById('lycee-levels-grid');

    if (!collegeGrid || !lyceeGrid) {
        console.log('Grilles de niveaux non trouvées');
        return;
    }

    // Vider les grilles
    collegeGrid.innerHTML = '';
    lyceeGrid.innerHTML = '';

    // Définir les niveaux à vérifier
    const collegeLevels = [
        { name: '6ème', file: 'SVT/6eme.html' },
        { name: '5ème', file: 'SVT/5eme.html' },
        { name: '4ème', file: 'SVT/4eme.html' },
        { name: '3ème', file: 'SVT/3eme.html' }
    ];

    const lyceeLevels = [
        { name: '2nde', file: 'SVT/2nde.html' },
        { name: '1re', file: 'SVT/1re.html' },
        { name: 'Terminale', file: 'SVT/Terminale.html' }
    ];

    let collegeHasContent = false;
    let lyceeHasContent = false;

    // Vérifier si on est en mode local (file://) ou sur un serveur web
    const isLocalMode = window.location.protocol === 'file:';

    if (isLocalMode) {
        console.log('Mode local détecté - utilisation de la liste statique des niveaux avec contenu');

        // En mode local, on utilise une liste prédéfinie des niveaux qui ont du contenu
        // Basé sur les fichiers que nous savons exister et avoir du contenu
        const staticContentLevels = [
            'SVT/6eme.html',   // Collège - nous savons qu'il a du contenu
            'SVT/2nde.html',   // Lycée - a du contenu (Chapitre 1 avec fiche, cahier, contrôle)
            'SVT/Terminale.html' // Lycée - a du contenu (Chapitre 1 et 2 avec fiches et cahiers)
        ];

        // Vérifier et ajouter les niveaux du collège
        for (const level of collegeLevels) {
            if (staticContentLevels.includes(level.file)) {
                console.log(`${level.name} ajouté (liste statique)`);
                const levelCard = createLevelCard(level.name, level.file);
                collegeGrid.appendChild(levelCard);
                collegeHasContent = true;
            }
        }

        // Vérifier et ajouter les niveaux du lycée
        for (const level of lyceeLevels) {
            if (staticContentLevels.includes(level.file)) {
                console.log(`${level.name} ajouté (liste statique)`);
                const levelCard = createLevelCard(level.name, level.file);
                lyceeGrid.appendChild(levelCard);
                lyceeHasContent = true;
            }
        }
    } else {
        // Mode serveur web - utilisation de la détection dynamique
        console.log('Mode serveur web détecté - utilisation de la détection dynamique');

        try {
            // Vérifier chaque niveau du collège et l'ajouter s'il a du contenu
            console.log('Vérification des niveaux du collège...');
            for (const level of collegeLevels) {
                console.log(`Vérification du niveau: ${level.name} (${level.file})`);
                if (await hasContentWithTimeout(level.file)) {
                    console.log(`${level.name} a du contenu, ajout à la grille`);
                    const levelCard = createLevelCard(level.name, level.file);
                    collegeGrid.appendChild(levelCard);
                    collegeHasContent = true;
                } else {
                    console.log(`${level.name} n'a pas de contenu`);
                }
            }

            // Vérifier chaque niveau du lycée et l'ajouter s'il a du contenu
            console.log('Vérification des niveaux du lycée...');
            for (const level of lyceeLevels) {
                console.log(`Vérification du niveau: ${level.name} (${level.file})`);
                if (await hasContentWithTimeout(level.file)) {
                    console.log(`${level.name} a du contenu, ajout à la grille`);
                    const levelCard = createLevelCard(level.name, level.file);
                    lyceeGrid.appendChild(levelCard);
                    lyceeHasContent = true;
                } else {
                    console.log(`${level.name} n'a pas de contenu`);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la vérification des niveaux:', error);
            // En cas d'erreur, afficher tous les niveaux par sécurité
            console.log('Utilisation du mode de secours : affichage de tous les niveaux');
            collegeHasContent = true;
            lyceeHasContent = true;

            // Ajouter tous les niveaux du collège
            for (const level of collegeLevels) {
                const levelCard = createLevelCard(level.name, level.file);
                collegeGrid.appendChild(levelCard);
            }

            // Ajouter tous les niveaux du lycée
            for (const level of lyceeLevels) {
                const levelCard = createLevelCard(level.name, level.file);
                lyceeGrid.appendChild(levelCard);
            }
        }
    }

    console.log(`Résultat final - Collège: ${collegeHasContent}, Lycée: ${lyceeHasContent}`);

    // Masquer ou afficher les cycles selon s'ils ont du contenu
    const collegeCard = document.getElementById('college-card');
    const lyceeCard = document.getElementById('lycee-card');
    const svtSelectionSection = document.getElementById('svt-selection');

    if (collegeCard) {
        collegeCard.style.display = collegeHasContent ? 'block' : 'none';
        console.log(`Carte Collège display: ${collegeHasContent ? 'block' : 'none'}`);
    }

    if (lyceeCard) {
        lyceeCard.style.display = lyceeHasContent ? 'block' : 'none';
        console.log(`Carte Lycée display: ${lyceeHasContent ? 'block' : 'none'}`);
    }

    // Si aucun cycle n'a de contenu, masquer toute la section SVT
    if (!collegeHasContent && !lyceeHasContent && svtSelectionSection) {
        svtSelectionSection.style.display = 'none';
        console.log('Aucun cycle n\'a de contenu, masquage de la section SVT');
    } else if (svtSelectionSection) {
        svtSelectionSection.style.display = 'block';
        console.log('Au moins un cycle a du contenu, affichage de la section SVT');
    }

    // Afficher le cycle par défaut s'il y a du contenu
    setTimeout(() => {
        if (collegeHasContent && !lyceeHasContent && collegeCard) {
            collegeCard.click();
            console.log('Affichage du collège par défaut');
        } else if (!collegeHasContent && lyceeHasContent && lyceeCard) {
            lyceeCard.click();
            console.log('Affichage du lycée par défaut');
        } else if (collegeHasContent && lyceeHasContent && collegeCard) {
            collegeCard.click();
            console.log('Affichage du collège par défaut (les deux ont du contenu)');
        }
    }, 100);
}

// Version avec timeout pour éviter les blocages
async function hasContentWithTimeout(levelFile, timeout = 3000) {
    // Vérifier si on est en mode local (file://) - éviter les requêtes fetch
    if (window.location.protocol === 'file:') {
        console.log(`Mode local détecté pour ${levelFile} - bypass de la détection dynamique`);
        // En mode local, on laisse la fonction loadAvailableLevels gérer via la liste statique
        // On retourne false pour laisser la liste statique faire son travail
        return false;
    }

    try {
        return await Promise.race([
            hasContent(levelFile),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
    } catch (error) {
        console.log(`Timeout ou erreur pour ${levelFile}:`, error.message);
        // En cas de timeout ou d'erreur CORS, on considère que le fichier a du contenu par sécurité
        return true;
    }
}

// Vérifier si une page de niveau a du contenu
async function hasContent(levelFile) {
    try {
        console.log(`Tentative de vérification du contenu pour: ${levelFile}`);

        // D'abord, vérifier si le fichier existe simplement
        const response = await fetch(levelFile, { method: 'HEAD' });
        if (!response.ok) {
            console.log(`Fichier ${levelFile} non accessible: ${response.status}`);
            return false;
        }

        // Ensuite, charger le contenu pour l'analyser
        const contentResponse = await fetch(levelFile);
        if (!contentResponse.ok) {
            console.log(`Impossible de charger le contenu de ${levelFile}`);
            return false;
        }

        const content = await contentResponse.text();
        console.log(`Contenu chargé pour ${levelFile}, taille: ${content.length} caractères`);

        // Critères de détection plus larges et plus tolérants
        const hasLinks = content.includes('href=');
        const hasChapters = content.toLowerCase().includes('chapitre');
        const hasResources = content.includes('Fiche_') ||
                           content.includes('Cahier_') ||
                           content.includes('Controle_') ||
                           content.includes('Seconde/') ||
                           content.includes('Terminale/') ||
                           content.includes('chapter-links') ||
                           content.includes('list-group-item');
        const hasValidStructure = content.includes('accordion-item') ||
                                 content.includes('card-link') ||
                                 content.includes('list-group') ||
                                 content.includes('chapter-links');

        // Nouveau critère : vérifier s'il y a du contenu significatif
        const hasMeaningfulContent = content.length > 1000 && // La page doit avoir un minimum de contenu
                                   (hasLinks || hasChapters || hasResources);

        console.log(`Vérification de ${levelFile}:`, {
            hasLinks,
            hasChapters,
            hasResources,
            hasValidStructure,
            hasMeaningfulContent,
            contentLength: content.length,
            decision: hasMeaningfulContent
        });

        return hasMeaningfulContent;
    } catch (error) {
        console.error(`Erreur lors de la vérification du contenu pour ${levelFile}:`, error);
        // En cas d'erreur, on considère que le niveau n'a pas de contenu
        return false;
    }
}

// Créer une carte de niveau
function createLevelCard(levelName, levelFile) {
    const card = document.createElement('a');
    card.href = levelFile;
    card.className = 'level-card';
    card.textContent = levelName;
    return card;
}

// ===== TABBED INTERFACES =====
function initializeTabbedInterfaces() {
    const allNavTabs = document.querySelectorAll('.nav-tabs');

    allNavTabs.forEach(navTab => {
        const tabs = navTab.querySelectorAll('.nav-link');
        const tabContent = navTab.nextElementSibling;

        if (!tabContent || !tabContent.classList.contains('tab-content')) {
            return; 
        }
        const panes = tabContent.querySelectorAll('.tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', function(event) {
                event.preventDefault();

                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => {
                    p.classList.remove('active', 'show');
                });

                this.classList.add('active');

                const targetPaneId = this.getAttribute('data-bs-target');
                const targetPane = tabContent.querySelector(targetPaneId);
                if (targetPane) {
                    targetPane.classList.add('active');
                    setTimeout(() => {
                        targetPane.classList.add('show');
                    }, 10);
                }
                
                if (navTab.id === 'myTab') {
                    if (history.pushState) {
                        history.pushState(null, null, targetPaneId);
                    } else {
                        location.hash = targetPaneId;
                    }
                }
            });
        });
    });

    const hash = window.location.hash;
    if (hash) {
        const mainTabToActivate = document.querySelector(`#myTab .nav-link[data-bs-target="${hash}"]`);
        if (mainTabToActivate) {
            mainTabToActivate.click();
        }
    }
}

// ===== EXERCISE INTERACTIVITY =====
function initializeExercises() {
    const qcmContainers = document.querySelectorAll('.qcm-container');

    qcmContainers.forEach(container => {
        const questions = container.querySelectorAll('li');

        questions.forEach(question => {
            const options = question.querySelectorAll('input[type="radio"]');
            const labels = question.querySelectorAll('.form-check-label');

            options.forEach((option, index) => {
                option.addEventListener('click', function() {
                    // Disable all options for this question
                    options.forEach(opt => opt.disabled = true);

                    const isCorrect = this.hasAttribute('data-correct');
                    const label = labels[index];

                    if (isCorrect) {
                        label.classList.add('correct-answer');
                    } else {
                        label.classList.add('incorrect-answer');
                        // Also show the correct answer
                        options.forEach((opt, idx) => {
                            if (opt.hasAttribute('data-correct')) {
                                labels[idx].classList.add('correct-answer');
                            }
                        });
                    }
                });
            });
        });
    });
}

function initializeSideMenu() {
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('close-menu-btn');

    if (sideMenu && closeBtn) {
        closeBtn.addEventListener('click', () => {
            sideMenu.style.transform = 'translateX(-240px)';
        });

        // Auto-show menu on hover
        sideMenu.addEventListener('mouseenter', () => {
            sideMenu.style.transform = 'translateX(0)';
        });

        sideMenu.addEventListener('mouseleave', () => {
            sideMenu.style.transform = 'translateX(-240px)';
        });
    }
}

// ===== VISION CAROUSEL =====
function initializeVisionCarousel() {
    const carousel = document.getElementById('vision-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    const nextBtn = carousel.querySelector('.carousel-control.next');
    
    let currentSlide = 0;
    let autoPlayInterval = null;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        updateDots(index);
        currentSlide = index;
    }

    function updateDots(index) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startAutoPlay() {
        stopAutoPlay(); // Prevent multiple intervals
        autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            showSlide(i);
        });
        dotsContainer.appendChild(dot);
    });

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
    });
    
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Initialize
    showSlide(0);
    startAutoPlay();
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const roleSelect = document.getElementById('contact-role');
    const studentFields = document.getElementById('student-fields');
    const teacherFields = document.getElementById('teacher-fields');
    const donorFields = document.getElementById('donor-fields');

    // Helper to clear and disable fields within a container
    function clearAndDisableFields(container) {
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.value = ''; // Clear value
            input.disabled = true; // Disable
            input.removeAttribute('required'); // Remove required attribute
        });
        container.classList.remove('visible');
    }

    // Helper to enable fields within a container and set required if needed
    function enableAndSetRequiredFields(container) {
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.disabled = false; // Enable
            // Add required attribute back if it was originally present or based on logic
            // For simplicity, let's assume all dynamic fields are required when visible
            input.setAttribute('required', 'true');
        });
        container.classList.add('visible');
    }

    function toggleFormFields() {
        // Clear and disable all dynamic fields first
        clearAndDisableFields(studentFields);
        clearAndDisableFields(teacherFields);
        clearAndDisableFields(donorFields);

        // Show and enable fields based on selected role
        const selectedRole = roleSelect.value;
        if (selectedRole === 'Élève') {
            enableAndSetRequiredFields(studentFields);
        } else if (selectedRole === 'Enseignant') {
            enableAndSetRequiredFields(teacherFields);
        } else if (selectedRole === 'Donateur') {
            enableAndSetRequiredFields(donorFields);
        }
    }

    // Attach event listener to role select
    roleSelect.addEventListener('change', toggleFormFields);

    // Call on initial load to set correct visibility
    toggleFormFields();

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('contact-name').value;
        const role = roleSelect.value;
        const subject = document.getElementById('contact-subject').value;
        const whatsappNum = document.getElementById('contact-whatsapp').value;

        let message = `Bonjour, je suis ${name}.
Je vous contacte en tant que : ${role}.
`;

        // Add dynamic fields to message only if they are visible and have a value
        if (role === 'Élève') {
            const studentClass = document.getElementById('contact-class').value;
            const studentSchool = document.getElementById('contact-school').value;
            if (studentClass) message += `Ma classe est : ${studentClass}.
`;
            if (studentSchool) message += `Mon établissement est : ${studentSchool}.
`;
        } else if (role === 'Enseignant') {
            const teacherSchool = document.getElementById('contact-teacher-school').value;
            const levelsInterested = document.getElementById('contact-levels-interested').value;
            if (teacherSchool) message += `Mon établissement est : ${teacherSchool}.
`;
            if (levelsInterested) message += `Niveaux intéressés : ${levelsInterested}.
`;
        } else if (role === 'Donateur') {
            const donationAmount = document.getElementById('contact-amount').value;
            if (donationAmount) message += `Montant du don souhaité : ${donationAmount} FCFA.
`;
        }

        message += `
Le sujet de ma demande est : ${subject}.
`;
        message += `
Mon numéro WhatsApp est : ${whatsappNum}`;

        const whatsappUrl = `https://wa.me/241077045354?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    });
}


// ===== NAVIGATION =====
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            animateHamburger(navToggle);
        });
    }
    
    // Fermer le menu en cliquant sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                resetHamburger(navToggle);
            }
        });
    });
}

function animateHamburger(toggle) {
    const bars = toggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (toggle.parentElement.querySelector('.nav-menu').classList.contains('active')) {
            // Animation pour le menu ouvert
            if (index === 0) {
                bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            } else if (index === 1) {
                bar.style.opacity = '0';
            } else if (index === 2) {
                bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            }
        } else {
            // Animation pour le menu fermé
            bar.style.transform = '';
            bar.style.opacity = '';
        }
    });
}

function resetHamburger(toggle) {
    const bars = toggle.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.transform = '';
        bar.style.opacity = '';
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.neon-nav');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (navbar) {
            // Effet de disparition/réapparition de la navbar
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }

        lastScrollTop = scrollTop;

        // Effet de parallaxe sur les éléments
        applyParallaxEffects(scrollTop);
    });
}

function applyParallaxEffects(scrollTop) {
    const parallaxElements = document.querySelectorAll('.hero-glow, .vision-glow, .coordonnateur-glow');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translate(-50%, calc(-50% + ${yPos}px))`;
    });
}

// ===== HOVER EFFECTS =====
function initializeHoverEffects() {
    // Effets sur les cartes de disciplines
    const disciplineCards = document.querySelectorAll('.discipline-card');
    disciplineCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            enhanceCardGlow(this);
        });
        
        card.addEventListener('mouseleave', function() {
            resetCardGlow(this);
        });
    });
    
    // Effets sur les boutons néon
    const neonButtons = document.querySelectorAll('.neon-btn-green');
    neonButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            enhanceButtonGlow(this);
        });
        
        button.addEventListener('mouseleave', function() {
            resetButtonGlow(this);
        });
    });
    
    // Effets sur les liens de navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            pulseElement(this);
        });
    });
}

function enhanceCardGlow(card) {
    const glow = card.querySelector('.card-glow');
    if (glow) {
        glow.style.opacity = '0.4';
        glow.style.filter = 'blur(60px)';
        glow.style.width = '120px';
        glow.style.height = '120px';
    }
}

function resetCardGlow(card) {
    const glow = card.querySelector('.card-glow');
    if (glow) {
        glow.style.opacity = '0.2';
        glow.style.filter = 'blur(40px)';
        glow.style.width = '100px';
        glow.style.height = '100px';
    }
}

function enhanceButtonGlow(button) {
    button.style.boxShadow = '0 0 20px var(--neon-green), 0 0 40px var(--neon-green)';
}

function resetButtonGlow(button) {
    button.style.boxShadow = '';
}

function pulseElement(element) {
    element.style.transform = 'scale(1.05)';
    setTimeout(() => {
        element.style.transform = '';
    }, 300);
}

// ===== INTERSECTION OBSERVER =====
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateOnScroll(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer les sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observer les cartes de disciplines
    const cards = document.querySelectorAll('.discipline-card');
    cards.forEach((card, index) => {
        observer.observe(card);
    });
}

function animateOnScroll(element) {
    if (element.classList.contains('discipline-card')) {
        // Animation spécifique pour les cartes
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition = 'all 0.6s ease-out';
    } else if (element.tagName === 'SECTION') {
        // Animation pour les sections
        const content = element.querySelector('.container');
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }
    }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    // Gestion du scroll fluide pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== UTILITAIRES =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ANIMATIONS PERSONNALISÉES =====
function createParticleEffect(x, y, color) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    document.body.appendChild(particle);
    
    // Animation
    const animation = particle.animate([
        { 
            transform: 'translate(0, 0) scale(1)',
            opacity: 1
        },
        { 
            transform: 'translate(var(--tx), var(--ty)) scale(0)',
            opacity: 0
        }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    // Direction aléatoire
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    
    animation.onfinish = () => {
        particle.remove();
    };
}

// ===== NAVIGATION INTELLIGENTE =====
function initializeSmartNavigation() {
    // Injecter les boutons de navigation s'ils n'existent pas
    let floatingNav = document.querySelector('.floating-nav');

    if (!floatingNav) {
        floatingNav = document.createElement('div');
        floatingNav.className = 'floating-nav';
        document.body.appendChild(floatingNav);
    }

    // Vider les boutons existants
    floatingNav.innerHTML = '';

    // Navigation contextuelle basée sur la page actuelle
    const currentPage = window.location.pathname.split('/').pop();
    const isIndexPage = currentPage === 'index.html' || currentPage === '';

    let showPrevBtn = true;
    let showNextBtn = true;
    let prevHref = '#';
    let nextHref = '#';
    let prevTitle = 'Navigation précédente';
    let nextTitle = 'Navigation suivante';

    // Déterminer la navigation intelligente
    if (currentPage.includes('Cahier_')) {
        // Sur un cahier type, navigation vers fiche de leçon
        prevHref = BASE_URL + '/' + currentPage.replace('Cahier_', 'Fiche_Lecon_');
        prevTitle = 'Retour à la fiche de leçon';
        nextHref = BASE_URL + '/SVT/2nde.html';
        nextTitle = 'Retour aux chapitres';
    } else if (currentPage.includes('Fiche_Lecon_')) {
        // Sur une fiche de leçon, navigation vers cahier type
        prevHref = BASE_URL + '/SVT/2nde.html';
        prevTitle = 'Retour aux chapitres';
        nextHref = BASE_URL + '/' + currentPage.replace('Fiche_Lecon_', 'Cahier_');
        nextTitle = 'Voir le cahier type';
    } else if (currentPage === '2nde.html') {
        // Sur la page principale de seconde
        prevHref = BASE_URL + '/index.html';
        prevTitle = 'Retour à l\'accueil';
        nextHref = BASE_URL + '/SVT/Seconde/Fiche_Lecon_2nde_Chapitre1.html';
        nextTitle = 'Commencer le chapitre 1';
    } else if (isIndexPage) {
        // Sur la page d'accueil - PAS DE PRÉCÉDENT
        showPrevBtn = false;
        nextHref = BASE_URL + '/SVT/6eme.html';
        nextTitle = 'Commencer par la 6ème';
    } else {
        // Pour les autres pages de niveau (6ème, 5ème, etc.)
        const niveau = currentPage.replace('.html', '');
        const niveaux = ['6eme', '5eme', '4eme', '3eme', '2nde', '1re', 'Terminale'];
        const currentIndex = niveaux.indexOf(niveau);

        if (currentIndex > 0) {
            prevHref = BASE_URL + '/SVT/' + niveaux[currentIndex - 1] + '.html';
            prevTitle = 'Vers ' + niveaux[currentIndex - 1];
        } else {
            prevHref = BASE_URL + '/index.html';
            prevTitle = 'Retour à l\'accueil';
        }

        if (currentIndex < niveaux.length - 1) {
            nextHref = BASE_URL + '/SVT/' + niveaux[currentIndex + 1] + '.html';
            nextTitle = 'Vers ' + niveaux[currentIndex + 1];
        } else {
            // Dernière page - PAS DE SUIVANT
            showNextBtn = false;
        }
    }

    // Créer le bouton précédent si nécessaire
    if (showPrevBtn) {
        const prevBtn = document.createElement('a');
        prevBtn.className = 'floating-nav-btn floating-nav-prev';
        prevBtn.href = prevHref;
        prevBtn.title = prevTitle;
        prevBtn.innerHTML = '←';
        prevBtn.style.display = 'none'; // Désactivé au démarrage
        floatingNav.appendChild(prevBtn);
    }

    // Créer le bouton suivant si nécessaire
    if (showNextBtn) {
        const nextBtn = document.createElement('a');
        nextBtn.className = 'floating-nav-btn floating-nav-next';
        nextBtn.href = nextHref;
        nextBtn.title = nextTitle;
        nextBtn.innerHTML = '→';
        nextBtn.style.display = 'none'; // Désactivé au démarrage
        floatingNav.appendChild(nextBtn);
    }

    // S'assurer que la navigation est toujours visible
    floatingNav.style.position = 'fixed';
    floatingNav.style.bottom = '30px';
    floatingNav.style.right = '30px';
    floatingNav.style.zIndex = '10000';
    floatingNav.style.display = 'flex';
    floatingNav.style.gap = '10px';

    // Ajouter la logique de gestion de l'affichage selon le scroll
    handleFloatingNavVisibility();
    window.addEventListener('scroll', handleFloatingNavVisibility);
    window.addEventListener('resize', handleFloatingNavVisibility);
}

// Gestion de la visibilité des boutons de navigation selon la position
function handleFloatingNavVisibility() {
    const floatingNav = document.querySelector('.floating-nav');
    if (!floatingNav) return;

    const prevBtn = floatingNav.querySelector('.floating-nav-prev');
    const nextBtn = floatingNav.querySelector('.floating-nav-next');
    
    if (!prevBtn && !nextBtn) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    // État 1 : Au démarrage - les deux boutons désactivés
    if (scrollTop === 0) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // État 2 : Lorsque l'utilisateur veut revenir à la page précédente - seul le bouton de gauche apparaît
    if (scrollTop > 0 && scrollPercent < 0.1) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // État 3 : Lorsque l'utilisateur est au milieu - les deux boutons apparaissent
    if (scrollPercent >= 0.1 && scrollPercent <= 0.9) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        return;
    }

    // État 4 : Lorsque l'utilisateur est proche du bas (de retour à la page d'accueil) - seul le bouton de droite apparaît
    if (scrollPercent > 0.9) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'flex';
        return;
    }
}

// ===== GESTION DES ERREURS =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// ===== EXPORT POUR UTILISATION EXTERNE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeScrollEffects,
        initializeHoverEffects,
        createParticleEffect,
        initializeSmartNavigation
    };
}

function adjustHrefsForGitHubPages() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        let href = link.getAttribute('href');
        // Only adjust if it's a relative path to an HTML file or a directory
        // and not an internal anchor link (#...) or an external link (http://...) or javascript
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('javascript')) {
            // Check if it's already correctly prefixed (e.g., if BASE_URL is empty)
            if (!href.startsWith(BASE_URL) && !href.startsWith('/')) {
                // Handle paths like "index.html" or "SVT/6eme.html"
                link.setAttribute('href', BASE_URL + '/' + href);
            } else if (href.startsWith('/') && !href.startsWith(BASE_URL)) {
                // Handle paths like "/SVT/6eme.html" if BASE_URL is not empty
                // This case might not be strictly needed if all paths are relative to root
                // but good for robustness.
                link.setAttribute('href', BASE_URL + href);
            }
        }
    });
}


// Gestion de la visibilité des boutons de navigation selon la position
function handleFloatingNavVisibility() {
    const floatingNav = document.querySelector('.floating-nav');
    if (!floatingNav) return;

    const prevBtn = floatingNav.querySelector('.floating-nav-prev');
    const nextBtn = floatingNav.querySelector('.floating-nav-next');
    
    if (!prevBtn && !nextBtn) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    // État 1 : Au démarrage - les deux boutons désactivés
    if (scrollTop === 0) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // État 2 : Lorsque l'utilisateur veut revenir à la page précédente - seul le bouton de gauche apparaît
    if (scrollTop > 0 && scrollPercent < 0.1) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // État 3 : Lorsque l'utilisateur est au milieu - les deux boutons apparaissent
    if (scrollPercent >= 0.1 && scrollPercent <= 0.9) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        return;
    }

    // État 4 : Lorsque l'utilisateur est proche du bas (de retour à la page d'accueil) - seul le bouton de droite apparaît
    if (scrollPercent > 0.9) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'flex';
        return;
    }
}

// ===== GESTION DES ERREURS =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// ===== EXPORT POUR UTILISATION EXTERNE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeScrollEffects,
        initializeHoverEffects,
        createParticleEffect,
        initializeSmartNavigation
    };
}

// ===== THÈME SWITCHER =====
function initializeThemeSwitcher() {
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeButtons = themeSwitcher ? themeSwitcher.querySelectorAll('.theme-btn') : [];
    
    if (!themeSwitcher || themeButtons.length === 0) return;

    // Charger le thème sauvegardé ou utiliser le thème par défaut (light)
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Ajouter les écouteurs d'événements pour chaque bouton de thème
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            localStorage.setItem('theme', theme);
        });
    });

    // Fonction pour appliquer le thème
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Mettre à jour l'état actif des boutons
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// ===== STATISTICS COUNTERS =====
function initializeStatisticsCounters() {
    // Données des ressources basées sur l'analyse automatique des fichiers
    const resourceData = {
        fiches: 4,    // Fiches de cours : 1 en Seconde + 3 en Terminale
        sujets: 1,    // Sujets d'évaluation : 1 en Terminale
        cahiers: 4,   // Cahiers types : 2 en Seconde + 2 en Terminale
        niveaux: 7    // Niveaux scolaires : 6eme, 5eme, 4eme, 3eme, Seconde, 1re, Terminale
    };

    // Mettre à jour les compteurs
    updateCounter('fiches-count', resourceData.fiches);
    updateCounter('sujets-count', resourceData.sujets);
    updateCounter('cahiers-count', resourceData.cahiers);
    updateCounter('niveaux-count', resourceData.niveaux);

    // Ajouter une animation au défilement
    animateCountersOnScroll();
}

function updateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = targetValue;
    }
}

function animateCountersOnScroll() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const finalValue = parseInt(entry.target.textContent);
                animateCounter(entry.target, 0, finalValue, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Fonction pour charger les données depuis le fichier JSON et mettre à jour les compteurs
async function loadAndUpdateResourceStats() {
    try {
        // Essayer de charger les données depuis le fichier JSON
        const response = await fetch('SVT/statistiques_svt.json');

        if (response.ok) {
            const data = await response.json();

            // Utiliser les données réelles du fichier JSON
            const resourceData = {
                fiches: data.ressourcesParType.fiches,
                sujets: data.ressourcesParType.sujets,
                cahiers: data.ressourcesParType.cahiers,
                niveaux: data.niveauxScolaires.filter(niveau => niveau.hasContenu).length
            };

            // Mettre à jour les compteurs avec les données réelles
            updateCounter('fiches-count', resourceData.fiches);
            updateCounter('sujets-count', resourceData.sujets);
            updateCounter('cahiers-count', resourceData.cahiers);
            updateCounter('niveaux-count', resourceData.niveaux);

            console.log('Statistiques chargées depuis le fichier JSON:', resourceData);

            // Ajouter une animation au défilement
            animateCountersOnScroll();

        } else {
            // Si le fichier n'est pas accessible, utiliser les données de secours
            console.log('Fichier JSON non accessible, utilisation des données de secours');
            initializeStatisticsCounters();
        }
    } catch (error) {
        console.log('Erreur lors du chargement des statistiques:', error);
        // Utiliser les données de secours en cas d'erreur
        initializeStatisticsCounters();
    }
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = endValue;
        }
    }

    requestAnimationFrame(updateCounter);
}

// ===== NAVIGATION INTELLIGENTE =====
function initializeSmartNavigation() {
    detectCurrentPage();
    loadChapterStructure();
    updateSideMenuHighlight();
    addSmartNavigationButtons();
}

// Structure des chapitres pour chaque niveau
const chapterStructure = {
    'SVT': {
        '2nde': {
            displayName: 'Seconde',
            levelFile: 'SVT/Terminale.html',  // Inversé: clique sur Seconde -> va à Terminale.html
            chapters: [
                {
                    name: 'Chapitre 1 : Exploitation des gaz naturels / hydrocarbures et environnement',
                    files: [
                        { name: 'Fiche de leçon', path: 'SVT/Seconde/Fiche_Lecon_2nde_Chapitre1.html' },
                        { name: 'Cahier type', path: 'SVT/Seconde/Cahier_2nde_Chapitre1.html' }
                    ]
                }
            ]
        },
        'Terminale': {
            displayName: 'Terminale',
            levelFile: 'SVT/2nde.html',  // Inversé: clique sur Terminale -> va à 2nde.html
            chapters: [
                {
                    name: 'Chapitre 1 : Formation de la planète Terre et premières étapes de la vie',
                    files: [
                        { name: 'Fiches de cours', path: 'SVT/Terminale/Fiche_Lecon_Terminale_D_Chapitre1.html' },
                        { name: 'Cahier type', path: 'SVT/Terminale/Cahier_Type_Terminale_D_Chapitre1.html' }
                    ]
                },
                {
                    name: 'Chapitre 2 : Les mécanismes de l\'évolution',
                    files: [
                        { name: 'Fiches de cours', path: 'SVT/Terminale/Fiche_Lecon_Terminale_D_Chapitre2.html' },
                        { name: 'Cahier type', path: 'SVT/Terminale/Cahier_Type_Terminale_D_Chapitre2.html' }
                    ]
                }
            ]
        }
        // Les autres niveaux (6ème, 5ème, 4ème, 3ème, 1re) n'ont pas de contenu et seront masqués
    }
};

function loadChapterStructure() {
    // Cette fonction pourrait être étendue pour charger la structure depuis un fichier JSON externe
    // Pour l'instant, on utilise la structure codée en dur
    window.chapterStructure = chapterStructure;
}

function getRelativePath(targetPath) {
    // Obtenir le chemin actuel et normaliser
    let currentPath = window.location.pathname;

    // Si on est en mode développement local avec C:\
    if (currentPath.includes('C:\\')) {
        // Extraire le chemin relatif depuis Educalim-main
        const fullPath = currentPath.split('\\').join('/');
        const mainIndex = fullPath.indexOf('Educalim-main/');
        if (mainIndex !== -1) {
            currentPath = fullPath.substring(mainIndex + 13); // +13 pour enlever "Educalim-main/"
        } else {
            currentPath = '';
        }
    } else {
        // Enlever le slash initial et final s'ils existent
        currentPath = currentPath.replace(/^\/|\/$/g, '');
    }

    // Si on est à la racine (vide ou index.html)
    if (currentPath === '' || currentPath === 'index.html') {
        return targetPath;
    }

    // Diviser le chemin en parties
    const currentParts = currentPath.split('/');

    // La profondeur est le nombre de dossiers (enlever le nom du fichier)
    const depth = currentParts.length - 1;

    // Si la profondeur est 0, on est déjà à la racine
    if (depth === 0) {
        return targetPath;
    }

    // Construire le chemin relatif avec le bon nombre de "../"
    let relativePath = '';
    for (let i = 0; i < depth; i++) {
        relativePath += '../';
    }

    const result = relativePath + targetPath;

    // Débogage détaillé
    console.log('=== getRelativePath debug ===');
    console.log('Window location:', window.location.pathname);
    console.log('Current path (nettoyé):', currentPath);
    console.log('Current parts:', currentParts);
    console.log('Depth (nombre de dossiers):', depth);
    console.log('Target path:', targetPath);
    console.log('Relative path calculé:', relativePath);
    console.log('Result final:', result);
    console.log('=========================');

    return result;
}

function detectCurrentPage() {
    let path = window.location.pathname;

    // Si on est en mode développement local avec C:\
    if (path.includes('C:\\')) {
        // Extraire le chemin relatif depuis Educalim-main
        const fullPath = path.split('\\').join('/');
        const mainIndex = fullPath.indexOf('Educalim-main/');
        if (mainIndex !== -1) {
            path = fullPath.substring(mainIndex + 13); // +13 pour enlever "Educalim-main/"
        } else {
            path = '';
        }
    } else {
        // Enlever le slash initial et final s'ils existent
        path = path.replace(/^\/|\/$/g, '');
    }

    const filename = path.split('/').pop() || 'index.html';

    // Détecter la discipline et le niveau actuels
    let currentDiscipline = null;
    let currentLevel = null;
    let currentFile = null;

    if (filename !== 'index.html') {
        // Vérifier si le chemin contient SVT
        if (path.includes('SVT/')) {
            currentDiscipline = 'SVT';

            // Parcourir les niveaux disponibles dans la structure des chapitres
            if (window.chapterStructure && window.chapterStructure.SVT) {
                const availableLevels = Object.keys(window.chapterStructure.SVT).filter(key => key !== 'displayName');

                for (let level of availableLevels) {
                    // Vérifier si le filename correspond exactement au fichier de niveau
                    if (filename === level + '.html') {
                        currentLevel = level;
                        currentFile = null; // On est sur la page de niveau elle-même
                        break;
                    }
                    // Vérifier si le filename contient le niveau (pour les fichiers de chapitre)
                    else if (filename.includes(level)) {
                        currentLevel = level;
                        currentFile = filename;
                        break;
                    }
                }
            }
        }
    }

    // Sauvegarder le contexte actuel
    window.currentPageContext = {
        discipline: currentDiscipline,
        level: currentLevel,
        file: currentFile,
        filename: filename
    };

    // Débogage détaillé
    console.log('=== detectCurrentPage debug ===');
    console.log('Path:', path);
    console.log('Filename:', filename);
    console.log('Detected - Discipline:', currentDiscipline);
    console.log('Detected - Level:', currentLevel);
    console.log('Detected - File:', currentFile);
    console.log('Final context:', window.currentPageContext);
    console.log('============================');
}

function updateSideMenuHighlight() {
    const sideMenu = document.getElementById('side-menu');
    if (!sideMenu) return;

    const context = window.currentPageContext;

    // Mettre en avant la discipline active sans développer les niveaux
    const levelGroups = sideMenu.querySelectorAll('.side-menu-level-group');
    levelGroups.forEach(group => {
        const disciplineName = group.querySelector('p').textContent;
        if (context.discipline && disciplineName === context.discipline) {
            group.classList.add('active-discipline');
        }
    });
}

// Fonction rebuildSideMenuWithLevels supprimée - plus de développement de disciplines avec sous-menus

// Fonction de sous-menus supprimée - plus de sous-menus dans le menu latéral

function addSmartNavigationButtons() {
    const context = window.currentPageContext;
    if (!context.discipline || !context.level) return;

    // Créer les boutons de navigation
    const navButtons = document.createElement('div');
    navButtons.className = 'smart-navigation';

    const levels = Object.keys(window.chapterStructure[context.discipline]).filter(key => key !== 'displayName');
    const currentIndex = levels.indexOf(context.level);

    let prevButton = '';
    let nextButton = '';
    let chapterNav = '';

    // Navigation entre niveaux
    if (currentIndex > 0) {
        const prevLevel = levels[currentIndex - 1];
        prevButton = `<a href="${getRelativePath(window.chapterStructure[context.discipline][prevLevel].levelFile)}" class="nav-btn prev-btn">← ${window.chapterStructure[context.discipline][prevLevel].displayName}</a>`;
    }

    if (currentIndex < levels.length - 1) {
        const nextLevel = levels[currentIndex + 1];
        nextButton = `<a href="${getRelativePath(window.chapterStructure[context.discipline][nextLevel].levelFile)}" class="nav-btn next-btn">${window.chapterStructure[context.discipline][nextLevel].displayName} →</a>`;
    }

    // Navigation entre chapitres (si on est sur un fichier de chapitre)
    if (context.file && window.chapterStructure[context.discipline][context.level]) {
        const currentLevelData = window.chapterStructure[context.discipline][context.level];
        const currentChapterIndex = getCurrentChapterIndex(currentLevelData.chapters, context.file);

        if (currentChapterIndex !== -1) {
            let prevChapterButton = '';
            let nextChapterButton = '';

            if (currentChapterIndex > 0) {
                const prevChapter = currentLevelData.chapters[currentChapterIndex - 1];
                prevChapterButton = `<a href="${getRelativePath(prevChapter.files[0].path)}" class="nav-btn chapter-prev-btn">← Chapitre précédent</a>`;
            }

            if (currentChapterIndex < currentLevelData.chapters.length - 1) {
                const nextChapter = currentLevelData.chapters[currentChapterIndex + 1];
                nextChapterButton = `<a href="${getRelativePath(nextChapter.files[0].path)}" class="nav-btn chapter-next-btn">Chapitre suivant →</a>`;
            }

            chapterNav = `
                <div class="chapter-navigation">
                    ${prevChapterButton}
                    ${nextChapterButton}
                </div>
            `;
        }
    }

    navButtons.innerHTML = `
        <div class="nav-buttons-container">
            ${prevButton}
            <div class="nav-center">
                <a href="${getRelativePath(window.chapterStructure[context.discipline][context.level].levelFile)}" class="nav-btn home-btn">Liste des chapitres</a>
                ${chapterNav}
            </div>
            ${nextButton}
        </div>
    `;

    // Ajouter au body
    document.body.appendChild(navButtons);
}

function getCurrentChapterIndex(chapters, currentFile) {
    for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        for (let file of chapter.files) {
            if (currentFile && file.path.includes(currentFile)) {
                return i;
            }
        }
    }
    return -1;
}

// ===== ENHANCED READING EXPERIENCE =====
function initializeEnhancedReading() {
    initializeReadingProgress();
    initializeContentHighlighter();
    initializeFontSizeControls();
    initializeFocusMode();
    initializeAutoSave();
    initializeSmoothScroll();
}

// Dark Mode Toggle
function initializeDarkModeToggle() {
    const darkModeBtn = document.createElement('button');
    darkModeBtn.className = 'dark-mode-toggle';
    darkModeBtn.innerHTML = '🌓';
    darkModeBtn.title = 'Mode sombre';
    darkModeBtn.onclick = toggleDarkMode;
    document.body.appendChild(darkModeBtn);

    // Load saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Print Optimization
function initializePrintOptimization() {
    const printBtn = document.createElement('button');
    printBtn.className = 'print-btn';
    printBtn.innerHTML = '🖨️';
    printBtn.title = 'Imprimer';
    printBtn.onclick = optimizeAndPrint;
    document.body.appendChild(printBtn);
}

function optimizeAndPrint() {
    // Remove unnecessary elements for printing
    const elementsToRemove = document.querySelectorAll('.font-size-controls, .focus-mode-btn, .dark-mode-toggle, .print-btn, .highlight-toolbar, .reading-progress-bar');
    elementsToRemove.forEach(el => el.style.display = 'none');

    // Optimize content for printing
    document.body.classList.add('print-mode');

    // Print
    window.print();

    // Restore elements after printing
    setTimeout(() => {
        elementsToRemove.forEach(el => el.style.display = '');
        document.body.classList.remove('print-mode');
    }, 1000);
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F for focus mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            toggleFocusMode();
        }

        // Ctrl/Cmd + D for dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleDarkMode();
        }

        // Ctrl/Cmd + Plus/Minus for font size
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-')) {
            e.preventDefault();
            adjustFontSize(e.key === '+' ? 1 : -1);
        }

        // Ctrl/Cmd + 0 to reset font size
        if ((e.ctrlKey || e.metaKey) && e.key === '0') {
            e.preventDefault();
            resetFontSize();
        }

        // Escape to exit focus mode or remove toolbar
        if (e.key === 'Escape') {
            if (focusMode) {
                toggleFocusMode();
            }
            removeHighlightToolbar();
        }
    });
}

// Reading Progress Bar
function initializeReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);

    const progressFill = progressBar.querySelector('.progress-fill');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressFill.style.width = scrolled + '%';
    });
}

// Content Highlighter
function initializeContentHighlighter() {
    let isHighlighting = false;
    let selectedText = '';

    document.addEventListener('mouseup', (e) => {
        const selection = window.getSelection();
        selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
            showHighlightToolbar(e.pageX, e.pageY, selectedText);
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.highlight-toolbar')) {
            removeHighlightToolbar();
        }
    });
}

function showHighlightToolbar(x, y, text) {
    removeHighlightToolbar();

    const toolbar = document.createElement('div');
    toolbar.className = 'highlight-toolbar';
    toolbar.style.left = x + 'px';
    toolbar.style.top = y + 'px';

    toolbar.innerHTML = `
        <button onclick="highlightText('${text.replace(/'/g, "\\'")}', 'yellow')" title="Surligner en jaune">🟡</button>
        <button onclick="highlightText('${text.replace(/'/g, "\\'")}', 'green')" title="Surligner en vert">🟢</button>
        <button onclick="highlightText('${text.replace(/'/g, "\\'")}', 'blue')" title="Surligner en bleu">🔵</button>
        <button onclick="copyText('${text.replace(/'/g, "\\'")}')" title="Copier">📋</button>
        <button onclick="removeHighlightToolbar()" title="Fermer">✖</button>
    `;

    document.body.appendChild(toolbar);
}

function removeHighlightToolbar() {
    const toolbar = document.querySelector('.highlight-toolbar');
    if (toolbar) {
        toolbar.remove();
    }
}

function highlightText(text, color) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const span = document.createElement('span');
    span.className = `highlight highlight-${color}`;
    span.style.backgroundColor = getColorHex(color);
    span.style.padding = '2px 4px';
    span.style.borderRadius = '3px';

    try {
        range.surroundContents(span);
        saveHighlights();
    } catch (e) {
        console.warn('Cannot highlight this text:', e);
    }

    selection.removeAllRanges();
    removeHighlightToolbar();
}

function getColorHex(color) {
    const colors = {
        yellow: '#fff3cd',
        green: '#d4edda',
        blue: '#cce7ff'
    };
    return colors[color] || '#fff3cd';
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Texte copié !');
    });
}

// Font Size Controls
function initializeFontSizeControls() {
    const controls = document.createElement('div');
    controls.className = 'font-size-controls';
    controls.innerHTML = `
        <button onclick="adjustFontSize(-1)" title="Réduire la taille">A-</button>
        <button onclick="resetFontSize()" title="Taille normale">A</button>
        <button onclick="adjustFontSize(1)" title="Augmenter la taille">A+</button>
    `;
    document.body.appendChild(controls);
}

let currentFontSize = 100;

function adjustFontSize(change) {
    currentFontSize += change * 5;
    currentFontSize = Math.max(70, Math.min(150, currentFontSize));
    document.documentElement.style.fontSize = currentFontSize + '%';
    localStorage.setItem('fontSize', currentFontSize);
}

function resetFontSize() {
    currentFontSize = 100;
    document.documentElement.style.fontSize = '100%';
    localStorage.setItem('fontSize', 100);
}

// Focus Mode
function initializeFocusMode() {
    const focusBtn = document.createElement('button');
    focusBtn.className = 'focus-mode-btn';
    focusBtn.innerHTML = '🎯';
    focusBtn.title = 'Mode concentration';
    focusBtn.onclick = toggleFocusMode;
    document.body.appendChild(focusBtn);
}

let focusMode = false;

function toggleFocusMode() {
    focusMode = !focusMode;
    document.body.classList.toggle('focus-mode', focusMode);

    if (focusMode) {
        // Dim all content except the main reading area
        const mainContent = document.querySelector('.fiche-lecon-container, .controle-container, .cahier-type-container');
        if (mainContent) {
            document.body.style.background = 'rgba(0, 0, 0, 0.8)';
            mainContent.style.transform = 'scale(1.02)';
            mainContent.style.zIndex = '1000';
        }
    } else {
        document.body.style.background = '';
        const mainContent = document.querySelector('.fiche-lecon-container, .controle-container, .cahier-type-container');
        if (mainContent) {
            mainContent.style.transform = '';
            mainContent.style.zIndex = '';
        }
    }
}

// Auto-save functionality
function initializeAutoSave() {
    setInterval(() => {
        saveHighlights();
        saveReadingPosition();
    }, 30000); // Save every 30 seconds
}

function saveHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    const highlightData = Array.from(highlights).map(h => ({
        text: h.textContent,
        color: h.className.match(/highlight-(\w+)/)?.[1] || 'yellow'
    }));
    localStorage.setItem('highlights', JSON.stringify(highlightData));
}

function saveReadingPosition() {
    const scrollPosition = window.scrollY;
    localStorage.setItem('readingPosition', scrollPosition);
}

// Toast notifications
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Smooth scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Load saved settings
window.addEventListener('load', () => {
    // Load font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        currentFontSize = parseInt(savedFontSize);
        document.documentElement.style.fontSize = currentFontSize + '%';
    }

    // Load reading position
    const savedPosition = localStorage.getItem('readingPosition');
    if (savedPosition) {
        setTimeout(() => {
            window.scrollTo(0, parseInt(savedPosition));
        }, 500);
    }
});

// Initialize enhanced reading features
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancedReading();
    initializeSubjectBrowsing();
});

// ===== ENHANCED SUBJECT BROWSING =====
function initializeSubjectBrowsing() {
    console.log('Initializing enhanced subject browsing features...');

    // Enhanced animations for cards
    initializeCardAnimations();

    // Interactive chapter navigation
    initializeChapterNavigation();

    // Smooth transitions between sections
    initializeSectionTransitions();

    // Reading progress indicators
    initializeReadingProgress();

    // Quick access shortcuts
    initializeKeyboardShortcuts();

    // Dynamic content loading animation
    initializeContentAnimations();
}

// Enhanced card animations
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.level-card, .discipline-card, .list-group-item, .chapter-links a');

    cards.forEach((card, index) => {
        // Add entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;

        // Trigger animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(card);
    });
}

// Interactive chapter navigation
function initializeChapterNavigation() {
    const chapterLinks = document.querySelectorAll('.chapter-links a, .niveau-list-group a');

    chapterLinks.forEach(link => {
        // Add hover effect with icon change
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px) scale(1.02)';
            this.style.boxShadow = '0 4px 15px rgba(0, 154, 68, 0.3)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.boxShadow = 'none';
        });

        // Add ripple effect on click
        link.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Smooth transitions between sections
function initializeSectionTransitions() {
    const sections = document.querySelectorAll('.accordion-item, .niveau-section');

    sections.forEach(section => {
        const button = section.querySelector('.accordion-button');
        if (button) {
            button.addEventListener('click', function() {
                const content = section.querySelector('.accordion-collapse');
                if (content) {
                    // Add smooth height transition
                    content.style.transition = 'max-height 0.5s ease, opacity 0.5s ease';

                    if (!content.classList.contains('show')) {
                        content.style.maxHeight = '0px';
                        content.style.opacity = '0';

                        setTimeout(() => {
                            content.classList.add('show');
                            content.style.maxHeight = content.scrollHeight + 'px';
                            content.style.opacity = '1';
                        }, 10);
                    } else {
                        content.style.maxHeight = '0px';
                        content.style.opacity = '0';

                        setTimeout(() => {
                            content.classList.remove('show');
                        }, 500);
                    }
                }
            });
        }
    });
}

// Reading progress indicators
function initializeReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #009A44, #FCD116);
        z-index: 10001;
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(0, 154, 68, 0.5);
    `;
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        progressBar.style.width = progress + '%';

        // Add glow effect at certain milestones
        if (progress > 25 && progress < 30) {
            progressBar.style.boxShadow = '0 0 20px rgba(252, 209, 22, 0.8)';
        } else if (progress > 75 && progress < 80) {
            progressBar.style.boxShadow = '0 0 20px rgba(0, 62, 146, 0.8)';
        } else {
            progressBar.style.boxShadow = '0 0 10px rgba(0, 154, 68, 0.5)';
        }
    });
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Skip if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Ctrl/Cmd + K: Quick search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showQuickSearch();
        }

        // Left/Right arrows: Navigate between chapters
        if (e.key === 'ArrowLeft') {
            navigateToPreviousChapter();
        } else if (e.key === 'ArrowRight') {
            navigateToNextChapter();
        }

        // Escape: Close side menu
        if (e.key === 'Escape') {
            const sideMenu = document.getElementById('side-menu');
            if (sideMenu && sideMenu.classList.contains('active')) {
                sideMenu.classList.remove('active');
            }
        }
    });
}

// Quick search functionality
function showQuickSearch() {
    // Remove existing search modal
    const existingModal = document.querySelector('.quick-search-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create search modal
    const modal = document.createElement('div');
    modal.className = 'quick-search-modal';
    modal.innerHTML = `
        <div class="quick-search-content">
            <input type="text" placeholder="Rechercher un chapitre, un niveau..." class="quick-search-input">
            <div class="quick-search-results"></div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .quick-search-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 10vh;
            z-index: 10002;
            backdrop-filter: blur(5px);
        }

        .quick-search-content {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .quick-search-input {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1.1rem;
            outline: none;
            transition: border-color 0.3s ease;
        }

        .quick-search-input:focus {
            border-color: #009A44;
        }

        .quick-search-results {
            margin-top: 1rem;
            max-height: 400px;
            overflow-y: auto;
        }

        .search-result-item {
            padding: 1rem;
            border-bottom: 1px solid #e0e0e0;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .search-result-item:hover {
            background-color: rgba(0, 154, 68, 0.1);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Focus input
    const input = modal.querySelector('.quick-search-input');
    input.focus();

    // Close on escape
    const closeModal = () => modal.remove();
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Navigation functions
function navigateToPreviousChapter() {
    const currentPage = getCurrentPageInfo();
    if (currentPage && currentPage.previousChapter) {
        window.location.href = currentPage.previousChapter;
    }
}

function navigateToNextChapter() {
    const currentPage = getCurrentPageInfo();
    if (currentPage && currentPage.nextChapter) {
        window.location.href = currentPage.nextChapter;
    }
}

// Get current page navigation info
function getCurrentPageInfo() {
    // This would be implemented based on your site structure
    // For now, return null to disable navigation
    return null;
}

// Dynamic content animations
function initializeContentAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Add fade-in animation to content sections
    const contentSections = document.querySelectorAll('.controle-section, .niveau-section, .accordion-body');
    contentSections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
}

// Add CSS for new animations
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .chapter-links a {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .chapter-links a:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 15px rgba(0, 154, 68, 0.3);
    }

    .niveau-list-group .list-group-item {
        transition: all 0.3s ease;
    }

    .niveau-list-group .list-group-item:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 15px rgba(252, 209, 22, 0.3);
    }

    .controle-nav-tabs .nav-link {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .controle-nav-tabs .nav-link:hover {
        transform: translateY(-2px) scale(1.05);
    }

    .controle-nav-tabs .nav-link.active {
        animation: tabPulse 2s ease-in-out infinite;
    }

    @keyframes tabPulse {
        0%, 100% { box-shadow: 0 -4px 25px rgba(0, 62, 146, 0.3), 0 0 30px rgba(0, 62, 146, 0.4); }
        50% { box-shadow: 0 -4px 25px rgba(0, 62, 146, 0.5), 0 0 50px rgba(0, 62, 146, 0.6); }
    }

    .reading-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #009A44, #FCD116);
        z-index: 10001;
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(0, 154, 68, 0.5);
    }
`;
document.head.appendChild(enhancedStyles);




