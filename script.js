/* ==========================================================================
   PT TOP - Personal Trainer Portfolio JavaScript Logic
   ========================================================================== */

// Certificate Data Store
const certData = {
    'cert-1': {
        title: 'Fitness Instructor Certification (FIC)',
        institution: 'PESA – สถาบันวิทยาศาสตร์และเทคโนโลยีการกีฬา (2026)',
        badge: 'FIC - PESA 2026',
        imgSrc: 'assets/cert_pesa_fic.jpg',
        fallbackIcon: 'fa-award'
    },
    'cert-2': {
        title: 'Weight Loss by Diet and Various Approaches',
        institution: 'CHULA MOOC – จุฬาลงกรณ์มหาวิทยาลัย (2025)',
        badge: 'CHULA MOOC 2025',
        imgSrc: 'assets/cert_chula_mooc.jpg',
        fallbackIcon: 'fa-graduation-cap'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initSoundToggles();
    setupCertificateFallbacks();
    initModalEvents();
});

/* --- 1. Video Sound Toggle --- */
function initSoundToggles() {
    // Event delegation to support dynamically active tabs
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.sound-toggle-btn');
        if (!btn) return;

        e.stopPropagation();
        const videoWrapper = btn.closest('.video-wrapper') || btn.closest('.spotlight-video-wrapper') || btn.closest('.duo-video-wrapper') || btn.closest('.journey-video-wrapper');
        const video = videoWrapper.querySelector('video');

        if (video) {
            if (video.muted) {
                video.muted = false;
                btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Unmuted';
                btn.style.background = 'var(--red-primary)';
            } else {
                video.muted = true;
                btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Muted';
                btn.style.background = 'rgba(9, 9, 12, 0.85)';
            }
        }
    });
}

/* --- 2. Client Case Tab Switcher --- */
function switchClientTab(clientKey) {
    // 1. Update button states
    const tabs = document.querySelectorAll('.client-tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('onclick').includes(clientKey)) {
            tab.classList.add('active');
        }
    });

    // 2. Hide all cards and pause their videos
    const cards = document.querySelectorAll('.client-case-card');
    cards.forEach(card => {
        card.classList.remove('active');
        const video = card.querySelector('video');
        if (video) {
            video.pause();
        }
    });

    // 3. Show target card and play its video
    const targetCard = document.getElementById(`case-${clientKey}`);
    if (targetCard) {
        targetCard.classList.add('active');
        const video = targetCard.querySelector('video');
        if (video) {
            video.play().catch(() => {});
        }
    }
}

/* --- 3. Premium Scrolling Action --- */
function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    // Soft scroll down to the targeted element with a offset
    const offset = 40;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/* --- 4. Copy Booking Message to Clipboard --- */
function copyBookingMessage() {
    const copyText = document.getElementById("booking-message-input");
    if (!copyText) return;

    // Copy to clipboard
    navigator.clipboard.writeText(copyText.value)
        .then(() => {
            showToastNotification();
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
            showToastNotification();
        });
}

function showToastNotification() {
    const toast = document.getElementById("toastNotif");
    if (!toast) return;

    // Reset inline styling to allow CSS transition rules to take charge cleanly
    toast.style.display = ""; 
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* --- 5. Certificate Lightbox Modal --- */
function openCertModal(certKey) {
    const data = certData[certKey];
    if (!data) return;

    const modal = document.getElementById('certModal');
    const modalBadge = document.getElementById('modalBadge');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalImg = document.getElementById('modalImg');

    const certImgElement = document.getElementById(`cert-img-${certKey === 'cert-1' ? '1' : '2'}`);
    
    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.institution;

    if (certImgElement && certImgElement.src) {
        modalImg.src = certImgElement.src;
    } else {
        modalImg.src = data.imgSrc;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/* --- 6. Personal Comparison Photo Lightbox --- */
function openComparisonLightbox() {
    const modal = document.getElementById('certModal');
    const modalBadge = document.getElementById('modalBadge');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalImg = document.getElementById('modalImg');

    modalBadge.textContent = 'PT TOP TRANSFORM';
    modalTitle.textContent = 'รูปเปรียบเทียบหุ่นช่วง bulk peak (85.0 kg) vs หุ่นลีนปัจจุบัน (77.8 kg)';
    modalSubtitle.textContent = 'พิสูจน์ผลลัพธ์การเปลี่ยนรูปร่างด้วยวินัยและวิทยาศาสตร์การโค้ช';
    modalImg.src = 'assets/top_comparison.jpg';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function initModalEvents() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCertModal();
        }
    });
}

/* --- 7. Graceful Fallback Handler for Missing Images --- */
function setupCertificateFallbacks() {
    setupImgFallback('cert-img-1', () => {
        return generateCanvasCert('PESA - FIC', 'Fitness Instructor Certification', 'Fitness Education & Sports Association', '2026');
    });

    setupImgFallback('cert-img-2', () => {
        return generateCanvasCert('CHULA MOOC', 'Weight Loss by Diet & Various Approaches', 'Chulalongkorn University Online Course', '2025');
    });

    setupImgFallback('trainer-photo', () => {
        return generateCanvasTrainerPhoto();
    });
}

function setupImgFallback(imgId, fallbackGenerator) {
    const imgElem = document.getElementById(imgId);
    if (!imgElem) return;

    imgElem.addEventListener('error', function() {
        console.log(`Image ${imgId} failed to load. Using generated fallback.`);
        imgElem.src = fallbackGenerator();
    });

    if (imgElem.complete && (imgElem.naturalWidth === 0 || imgElem.naturalHeight === 0)) {
        imgElem.src = fallbackGenerator();
    }
}

function generateCanvasCert(org, certTitle, subTitle, year) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#0f1016');
    bgGradient.addColorStop(0.5, '#171822');
    bgGradient.addColorStop(1, '#0b0c10');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 14;
    ctx.strokeStyle = '#e50914';
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#d32f2f';
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    ctx.fillStyle = '#e50914';
    ctx.font = 'bold 36px "Kanit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★ OFFICIAL CERTIFICATE OF COMPLETION ★`, canvas.width / 2, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Kanit", sans-serif';
    ctx.fillText(org, canvas.width / 2, 210);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '28px "Kanit", sans-serif';
    ctx.fillText(`This is to certify that`, canvas.width / 2, 290);

    ctx.fillStyle = '#ff3b30';
    ctx.font = 'bold 64px "Bebas Neue", "Kanit", sans-serif';
    ctx.fillText(`SIWAKORN SOMRAK (PT TOP)`, canvas.width / 2, 380);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Kanit", sans-serif';
    ctx.fillText(certTitle, canvas.width / 2, 470);

    ctx.fillStyle = '#d4d4d8';
    ctx.font = '26px "Kanit", sans-serif';
    ctx.fillText(subTitle, canvas.width / 2, 530);

    ctx.beginPath();
    ctx.arc(canvas.width / 2, 660, 65, 0, Math.PI * 2);
    ctx.fillStyle = '#8b0000';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#e50914';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Kanit", sans-serif';
    ctx.fillText(year, canvas.width / 2, 670);

    return canvas.toDataURL('image/png');
}

function generateCanvasTrainerPhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#1c1c24');
    grad.addColorStop(1, '#09090c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(229, 9, 20, 0.15)';
    ctx.beginPath();
    ctx.arc(300, 300, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px "Bebas Neue", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PT TOP', 300, 420);

    ctx.fillStyle = '#e50914';
    ctx.font = 'bold 28px "Kanit", sans-serif';
    ctx.fillText('SIWAKORN SOMRAK', 300, 470);

    return canvas.toDataURL('image/png');
}
