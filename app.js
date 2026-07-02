/**
 * Indian Exam Photo & Signature Resizer
 * Client-Side Engine & Application Logic
 */

// Application State
const state = {
    exams: [],
    selectedExam: null,
    activeCategory: 'all',
    activeTab: 'photo', // 'photo' or 'signature'
    images: {
        photo: { original: null, file: null, zoom: 1, rotation: 0, canvas: null, dataUrl: null, sizeKb: 0 },
        signature: { original: null, file: null, zoom: 1, rotation: 0, canvas: null, dataUrl: null, sizeKb: 0 }
    }
};

// Built-in JavaScript Exam Standards Fallback (guarantees offline functionality)
const defaultExamPresets = [
    {
        id: 1, code: 'ssc_cgl', name: 'SSC Combined Graduate Level (CGL)', conducting_body: 'Staff Selection Commission', category: 'Government Job',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 450, min_height_px: 450, max_height_px: 550, target_width: 350, target_height: 450, aspect_ratio: '3.5:4.5', min_kb: 20, max_kb: 50, bg_color: 'Light / White Background', dpi: 200 },
            signature: { min_width_px: 280, max_width_px: 400, min_height_px: 140, max_height_px: 200, target_width: 280, target_height: 140, aspect_ratio: '4.0:2.0', min_kb: 10, max_kb: 20, bg_color: 'Black ink on white paper', dpi: 200 }
        }
    },
    {
        id: 2, code: 'ssc_chsl', name: 'SSC Combined Higher Secondary Level (CHSL)', conducting_body: 'Staff Selection Commission', category: 'Government Job',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 450, min_height_px: 450, max_height_px: 550, target_width: 350, target_height: 450, aspect_ratio: '3.5:4.5', min_kb: 20, max_kb: 50, bg_color: 'Plain light background', dpi: 200 },
            signature: { min_width_px: 280, max_width_px: 400, min_height_px: 140, max_height_px: 200, target_width: 280, target_height: 140, aspect_ratio: '4.0:2.0', min_kb: 10, max_kb: 20, bg_color: 'White paper', dpi: 200 }
        }
    },
    {
        id: 3, code: 'upsc_cse', name: 'UPSC Civil Services Examination (IAS/IPS)', conducting_body: 'Union Public Service Commission', category: 'Civil Services',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 1000, min_height_px: 350, max_height_px: 1000, target_width: 500, target_height: 500, aspect_ratio: '1:1', min_kb: 20, max_kb: 300, bg_color: 'White / Plain background', dpi: 300 },
            signature: { min_width_px: 350, max_width_px: 1000, min_height_px: 350, max_height_px: 1000, target_width: 500, target_height: 500, aspect_ratio: '1:1', min_kb: 20, max_kb: 300, bg_color: 'White background', dpi: 300 }
        }
    },
    {
        id: 4, code: 'ibps_po', name: 'IBPS Probationary Officer (PO / MT)', conducting_body: 'Institute of Banking Personnel Selection', category: 'Banking',
        requirements: {
            photo: { min_width_px: 200, max_width_px: 250, min_height_px: 230, max_height_px: 270, target_width: 200, target_height: 230, aspect_ratio: '4.5:3.5', min_kb: 20, max_kb: 50, bg_color: 'Light colored', dpi: 200 },
            signature: { min_width_px: 140, max_width_px: 200, min_height_px: 60, max_height_px: 100, target_width: 140, target_height: 60, aspect_ratio: '2.3:1', min_kb: 10, max_kb: 20, bg_color: 'White paper with Black ink', dpi: 200 }
        }
    },
    {
        id: 5, code: 'nta_neet', name: 'NTA NEET (UG) Medical Entrance', conducting_body: 'National Testing Agency', category: 'Medical Entrance',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 600, min_height_px: 450, max_height_px: 800, target_width: 400, target_height: 520, aspect_ratio: '3.5:4.5', min_kb: 10, max_kb: 200, bg_color: 'White background (80% face)', dpi: 300 },
            signature: { min_width_px: 280, max_width_px: 500, min_height_px: 100, max_height_px: 250, target_width: 350, target_height: 150, aspect_ratio: '3.5:1.5', min_kb: 4, max_kb: 30, bg_color: 'White sheet with Black ink', dpi: 300 }
        }
    },
    {
        id: 6, code: 'nta_jee', name: 'NTA JEE Main Engineering Entrance', conducting_body: 'National Testing Agency', category: 'Engineering Entrance',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 600, min_height_px: 450, max_height_px: 800, target_width: 400, target_height: 520, aspect_ratio: '3.5:4.5', min_kb: 10, max_kb: 200, bg_color: 'White background', dpi: 300 },
            signature: { min_width_px: 280, max_width_px: 500, min_height_px: 100, max_height_px: 250, target_width: 350, target_height: 150, aspect_ratio: '3.5:1.5', min_kb: 4, max_kb: 30, bg_color: 'White sheet with Black ink', dpi: 300 }
        }
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    fetchExamsData();
    setupEventListeners();
});

// Fetch Exam Standards from PHP API or Fallback
async function fetchExamsData() {
    try {
        const response = await fetch('api/exams.php');
        if (response.ok) {
            const json = await response.json();
            if (json.status === 'success' && json.data && json.data.length > 0) {
                state.exams = json.data;
            } else {
                state.exams = defaultExamPresets;
            }
        } else {
            state.exams = defaultExamPresets;
        }
    } catch (e) {
        state.exams = defaultExamPresets;
    }
    
    populateDropdown();
    renderReferenceTable();
}

// Populate Exam Selection Dropdown
function populateDropdown() {
    const select = document.getElementById('examSelect');
    select.innerHTML = '<option value="" disabled>-- Select Exam (e.g. SSC CGL, UPSC, IBPS) --</option>';

    const filtered = state.activeCategory === 'all' 
        ? state.exams 
        : state.exams.filter(e => e.category === state.activeCategory);

    filtered.forEach(exam => {
        const opt = document.createElement('option');
        opt.value = exam.code;
        opt.textContent = `${exam.name} (${exam.conducting_body})`;
        select.appendChild(opt);
    });

    // Default select first exam (SSC CGL)
    if (filtered.length > 0) {
        select.value = filtered[0].code;
        selectExam(filtered[0].code);
    }
}

// Select an Exam preset
function selectExam(code) {
    state.selectedExam = state.exams.find(e => e.code === code);
    if (!state.selectedExam) return;

    updateSpecBanner();
    highlightTableRows();

    // Re-process images if already uploaded
    if (state.images.photo.original) processCanvas('photo');
    if (state.images.signature.original) processCanvas('signature');
}

// Update Specs Summary Cards
function updateSpecBanner() {
    const req = state.selectedExam.requirements;
    if (!req) return;

    if (req.photo) {
        document.getElementById('specPhotoDim').textContent = `${req.photo.target_width || req.photo.min_width_px} x ${req.photo.target_height || req.photo.min_height_px} px`;
        document.getElementById('specPhotoSize').textContent = `${req.photo.min_kb} KB - ${req.photo.max_kb} KB`;
        document.getElementById('specPhotoBg').textContent = req.photo.bg_color || 'White background';
    }

    if (req.signature) {
        document.getElementById('specSigDim').textContent = `${req.signature.target_width || req.signature.min_width_px} x ${req.signature.target_height || req.signature.min_height_px} px`;
        document.getElementById('specSigSize').textContent = `${req.signature.min_kb} KB - ${req.signature.max_kb} KB`;
        document.getElementById('specSigInk').textContent = req.signature.bg_color || 'Black ink on white paper';
    }
}

// Setup Event Listeners for Dropzones, Sliders, and Buttons
function setupEventListeners() {
    // Dropdown change
    document.getElementById('examSelect').addEventListener('change', (e) => {
        selectExam(e.target.value);
    });

    // Category Filter Pills
    document.querySelectorAll('#categoryPills .pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('#categoryPills .pill').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            state.activeCategory = e.target.dataset.cat;
            populateDropdown();
        });
    });

    // File Dropzones & Inputs
    setupDropzone('photoDropzone', 'photoFileInput', 'photo');
    setupDropzone('sigDropzone', 'sigFileInput', 'signature');

    // Zoom Sliders
    document.getElementById('photoZoomRange').addEventListener('input', (e) => {
        state.images.photo.zoom = parseFloat(e.target.value);
        processCanvas('photo');
    });

    document.getElementById('sigZoomRange').addEventListener('input', (e) => {
        state.images.signature.zoom = parseFloat(e.target.value);
        processCanvas('signature');
    });

    // Action Downloads
    document.getElementById('downloadPhotoBtn').addEventListener('click', () => downloadImage('photo'));
    document.getElementById('downloadSigBtn').addEventListener('click', () => downloadImage('signature'));

    // Server Fallbacks
    document.getElementById('serverFallbackPhotoBtn').addEventListener('click', () => triggerServerFallback('photo'));
    document.getElementById('serverFallbackSigBtn').addEventListener('click', () => triggerServerFallback('signature'));
}

// Tab Switching Logic
function switchTab(type) {
    state.activeTab = type;
    document.getElementById('tabPhotoBtn').classList.toggle('active', type === 'photo');
    document.getElementById('tabSigBtn').classList.toggle('active', type === 'signature');
    document.getElementById('panePhoto').classList.toggle('active', type === 'photo');
    document.getElementById('paneSignature').classList.toggle('active', type === 'signature');
}

// Drag & Drop Handling
function setupDropzone(dropzoneId, fileInputId, type) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0], type);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0], type);
        }
    });
}

// Load Selected File into Image Object
function handleFileSelect(file, type) {
    if (!file.type.match('image.*')) {
        showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
        return;
    }

    state.images[type].file = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.images[type].original = img;
            state.images[type].zoom = 1;
            state.images[type].rotation = 0;
            
            // Show Control Panel & Preview ActionBar
            const controlPanelId = type === 'photo' ? 'photoControlPanel' : 'sigControlPanel';
            const meterId = type === 'photo' ? 'photoComplianceMeter' : 'sigComplianceMeter';
            const actionBarId = type === 'photo' ? 'photoActionBar' : 'sigActionBar';
            
            document.getElementById(controlPanelId).style.display = 'block';
            document.getElementById(meterId).style.display = 'block';
            document.getElementById(actionBarId).style.display = 'flex';
            
            processCanvas(type);
            showToast(`${type.toUpperCase()} uploaded successfully!`, 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * Core HTML5 Canvas Resizer & Iterative Quality Binary Search Compression Engine
 */
function processCanvas(type) {
    const imgObj = state.images[type];
    if (!imgObj.original || !state.selectedExam) return;

    const req = state.selectedExam.requirements[type];
    if (!req) return;

    const targetW = req.target_width || req.min_width_px;
    const targetH = req.target_height || req.min_height_px;

    const canvas = type === 'photo' ? document.getElementById('photoCanvas') : document.getElementById('sigCanvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    // Fill white background for JPG standard compliance
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);

    // Apply rotation & scale transformations
    ctx.save();
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((imgObj.rotation * Math.PI) / 180);

    const aspectOriginal = imgObj.original.width / imgObj.original.height;
    const aspectTarget = targetW / targetH;

    let drawW, drawH;
    if (aspectOriginal > aspectTarget) {
        drawH = targetH * imgObj.zoom;
        drawW = drawH * aspectOriginal;
    } else {
        drawW = targetW * imgObj.zoom;
        drawH = drawW / aspectOriginal;
    }

    ctx.drawImage(imgObj.original, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Compression Binary Search (Target: min_kb <= size <= max_kb)
    let lowQ = 0.05;
    let highQ = 0.98;
    let bestDataUrl = null;
    let bestSizeKb = 0;
    let finalQuality = 0.85;

    // Iterative binary search for ideal quality factor
    for (let i = 0; i < 8; i++) {
        const midQ = (lowQ + highQ) / 2;
        const dataUrl = canvas.toDataURL('image/jpeg', midQ);
        const sizeKb = estimateBase64SizeKb(dataUrl);

        bestDataUrl = dataUrl;
        bestSizeKb = sizeKb;
        finalQuality = midQ;

        if (sizeKb > req.max_kb) {
            highQ = midQ - 0.02;
        } else if (sizeKb < req.min_kb) {
            lowQ = midQ + 0.02;
        } else {
            break; // Ideal size hit!
        }
    }

    imgObj.dataUrl = bestDataUrl;
    imgObj.sizeKb = bestSizeKb;

    // Render Live Preview Image
    const stageId = type === 'photo' ? 'photoPreviewStage' : 'sigPreviewStage';
    const stage = document.getElementById(stageId);
    stage.innerHTML = `<img src="${bestDataUrl}" alt="Resized ${type} Preview">`;

    // Update Compliance Meter UI
    updateComplianceMeter(type, bestSizeKb, req.min_kb, req.max_kb);
}

// Calculate base64 string size in KB
function estimateBase64SizeKb(base64String) {
    const stringLength = base64String.length - 'data:image/jpeg;base64,'.length;
    const sizeInBytes = stringLength * (3 / 4);
    return Math.round((sizeInBytes / 1024) * 100) / 100;
}

// Update Compliance Meter Progress Bar and Status Badges
function updateComplianceMeter(type, currentKb, minKb, maxKb) {
    const currentSizeId = type === 'photo' ? 'photoCurrentSize' : 'sigCurrentSize';
    const statusBadgeId = type === 'photo' ? 'photoStatusBadge' : 'sigStatusBadge';
    const progressId = type === 'photo' ? 'photoSizeProgress' : 'sigSizeProgress';
    const targetTextId = type === 'photo' ? 'photoTargetRangeText' : 'sigTargetRangeText';

    document.getElementById(currentSizeId).textContent = `${currentKb} KB`;
    document.getElementById(targetTextId).textContent = `${minKb} KB - ${maxKb} KB`;

    const isCompliant = currentKb >= minKb && currentKb <= maxKb;
    const badge = document.getElementById(statusBadgeId);

    if (isCompliant) {
        badge.className = 'status-badge status-valid';
        badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Compliant';
    } else if (currentKb > maxKb) {
        badge.className = 'status-badge status-invalid';
        badge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> File Too Large';
    } else {
        badge.className = 'status-badge status-invalid';
        badge.innerHTML = '<i class="fa-solid fa-circle-info"></i> File Too Small';
    }

    // Progress bar percentage relative to max_kb
    const pct = Math.min(100, Math.max(10, (currentKb / maxKb) * 100));
    const fill = document.getElementById(progressId);
    fill.style.width = `${pct}%`;
    fill.style.background = isCompliant ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #ef4444, #f59e0b)';
}

// Rotation Control
function rotateImage(type, deg) {
    state.images[type].rotation = (state.images[type].rotation + deg) % 360;
    processCanvas(type);
}

// Reset Controls
function resetControls(type) {
    state.images[type].zoom = 1;
    state.images[type].rotation = 0;
    const rangeId = type === 'photo' ? 'photoZoomRange' : 'sigZoomRange';
    document.getElementById(rangeId).value = 1;
    processCanvas(type);
}

// Trigger Server-side Python Compression Fallback API
async function triggerServerFallback(type) {
    const imgObj = state.images[type];
    if (!imgObj.file && !imgObj.dataUrl) {
        showToast(`Please select a ${type} image first`, 'error');
        return;
    }

    const req = state.selectedExam.requirements[type];
    const targetW = req.target_width || req.min_width_px;
    const targetH = req.target_height || req.min_height_px;

    showToast('Invoking Python server compression fallback...', 'info');

    try {
        const payload = {
            image_base64: imgObj.dataUrl,
            width: targetW,
            height: targetH,
            min_kb: req.min_kb,
            max_kb: req.max_kb
        };

        const response = await fetch('api/process.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const json = await response.json();
        if (json.status === 'success' && json.data.data_url) {
            imgObj.dataUrl = json.data.data_url;
            imgObj.sizeKb = json.data.file_size_kb;

            const stageId = type === 'photo' ? 'photoPreviewStage' : 'sigPreviewStage';
            document.getElementById(stageId).innerHTML = `<img src="${json.data.data_url}" alt="Python Resized ${type}">`;
            updateComplianceMeter(type, json.data.file_size_kb, req.min_kb, req.max_kb);
            showToast(`Python Pillow compression succeeded! Output: ${json.data.file_size_kb} KB`, 'success');
        } else {
            showToast(`Server Fallback Error: ${json.message || 'Processing failed'}`, 'error');
        }
    } catch (e) {
        showToast('Server connection failed. Ensure PHP backend server is running.', 'error');
    }
}

// Download Image as JPG File
function downloadImage(type) {
    const imgObj = state.images[type];
    if (!imgObj.dataUrl) {
        showToast('No image available to download', 'error');
        return;
    }

    const examCode = state.selectedExam ? state.selectedExam.code : 'exam';
    const filename = `${examCode.toUpperCase()}_${type.toUpperCase()}_Resized.jpg`;

    const a = document.createElement('a');
    a.href = imgObj.dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast(`Downloaded ${filename}`, 'success');
}

// Render Reference Table
function renderReferenceTable() {
    const tbody = document.getElementById('referenceTableBody');
    tbody.innerHTML = '';

    state.exams.forEach(exam => {
        const req = exam.requirements;
        const p = req.photo || {};
        const s = req.signature || {};

        const tr = document.createElement('tr');
        tr.id = `row-${exam.code}`;
        tr.innerHTML = `
            <td><strong>${exam.code.toUpperCase()}</strong></td>
            <td>${exam.name}</td>
            <td>${p.target_width || p.min_width_px} x ${p.target_height || p.min_height_px} px</td>
            <td><span class="highlight-badge">${p.min_kb} - ${p.max_kb} KB</span></td>
            <td>${s.target_width || s.min_width_px} x ${s.target_height || s.min_height_px} px</td>
            <td><span class="highlight-badge">${s.min_kb} - ${s.max_kb} KB</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Highlight Active Selected Row in Table
function highlightTableRows() {
    document.querySelectorAll('.data-table tbody tr').forEach(r => r.style.background = 'transparent');
    if (state.selectedExam) {
        const activeRow = document.getElementById(`row-${state.selectedExam.code}`);
        if (activeRow) {
            activeRow.style.background = 'rgba(16, 185, 129, 0.15)';
        }
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Theme Toggle
function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') !== 'light';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
}
