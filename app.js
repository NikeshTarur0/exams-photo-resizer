/**
 * Indian Exam Photo Resizer & All-in-One Image Utility Suite
 * Client-Side Engine & Application Logic
 */

// Application State
const state = {
    exams: [],
    selectedExam: null,
    activeCategory: 'all',
    activeCountry: 'all',
    activeTab: 'photo', // 'photo' or 'signature'
    currentMainTool: 'exam-studio',
    previewModes: { photo: 'after', signature: 'after', bg: 'after', comp: 'after', resize: 'after', conv: 'after', crop: 'after', upscale: 'after' },
    images: {
        photo: { original: null, file: null, zoom: 1, rotation: 0, canvas: null, dataUrl: null, sizeKb: 0 },
        signature: { original: null, file: null, zoom: 1, rotation: 0, canvas: null, dataUrl: null, sizeKb: 0 },
        bg: { original: null, file: null, processedUrl: null },
        comp: { original: null, file: null, processedUrl: null, sizeKb: 0 },
        resize: { original: null, file: null, processedUrl: null, width: 800, height: 600 },
        conv: { original: null, file: null, processedUrl: null, format: 'image/jpeg' },
        crop: { original: null, file: null, processedUrl: null, ratio: '1:1' },
        upscale: { original: null, file: null, processedUrl: null }
    }
};

// Built-in JavaScript Exam Standards Fallback
const defaultExamPresets = [
    {
        id: 1, code: 'ssc_cgl', name: 'SSC Combined Graduate Level (CGL)', conducting_body: 'Staff Selection Commission', category: 'Government Job', country: 'India',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 450, min_height_px: 450, max_height_px: 550, target_width: 350, target_height: 450, aspect_ratio: '3.5:4.5', min_kb: 20, max_kb: 50, bg_color: 'Light / White Background', dpi: 200 },
            signature: { min_width_px: 280, max_width_px: 400, min_height_px: 140, max_height_px: 200, target_width: 280, target_height: 140, aspect_ratio: '4.0:2.0', min_kb: 10, max_kb: 20, bg_color: 'Black ink on white paper', dpi: 200 }
        }
    },
    {
        id: 2, code: 'ssc_chsl', name: 'SSC Combined Higher Secondary Level (CHSL)', conducting_body: 'Staff Selection Commission', category: 'Government Job', country: 'India',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 450, min_height_px: 450, max_height_px: 550, target_width: 350, target_height: 450, aspect_ratio: '3.5:4.5', min_kb: 20, max_kb: 50, bg_color: 'Plain light background', dpi: 200 },
            signature: { min_width_px: 280, max_width_px: 400, min_height_px: 140, max_height_px: 200, target_width: 280, target_height: 140, aspect_ratio: '4.0:2.0', min_kb: 10, max_kb: 20, bg_color: 'White paper', dpi: 200 }
        }
    },
    {
        id: 3, code: 'ssc_gd', name: 'SSC GD Constable Exam', conducting_body: 'Staff Selection Commission', category: 'Government Job', country: 'India',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 450, min_height_px: 450, max_height_px: 550, target_width: 350, target_height: 450, aspect_ratio: '3.5:4.5', min_kb: 20, max_kb: 50, bg_color: 'Light background with date', dpi: 200 },
            signature: { min_width_px: 280, max_width_px: 400, min_height_px: 140, max_height_px: 200, target_width: 280, target_height: 140, aspect_ratio: '4.0:2.0', min_kb: 10, max_kb: 20, bg_color: 'Black ink', dpi: 200 }
        }
    },
    {
        id: 4, code: 'upsc_cse', name: 'UPSC Civil Services Examination (IAS/IPS)', conducting_body: 'Union Public Service Commission', category: 'Civil Services', country: 'India',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 1000, min_height_px: 350, max_height_px: 1000, target_width: 500, target_height: 500, aspect_ratio: '1:1', min_kb: 20, max_kb: 300, bg_color: 'White / Plain background', dpi: 300 },
            signature: { min_width_px: 350, max_width_px: 1000, min_height_px: 350, max_height_px: 1000, target_width: 500, target_height: 500, aspect_ratio: '1:1', min_kb: 20, max_kb: 300, bg_color: 'White background', dpi: 300 }
        }
    },
    {
        id: 5, code: 'ibps_po', name: 'IBPS Probationary Officer (PO / Clerk)', conducting_body: 'Institute of Banking Personnel Selection', category: 'Banking', country: 'India',
        requirements: {
            photo: { min_width_px: 200, max_width_px: 250, min_height_px: 230, max_height_px: 270, target_width: 200, target_height: 230, aspect_ratio: '4.5:3.5', min_kb: 20, max_kb: 50, bg_color: 'Light colored', dpi: 200 },
            signature: { min_width_px: 140, max_width_px: 200, min_height_px: 60, max_height_px: 100, target_width: 140, target_height: 60, aspect_ratio: '2.3:1', min_kb: 10, max_kb: 20, bg_color: 'White paper with Black ink', dpi: 200 }
        }
    },
    {
        id: 6, code: 'sbi_po', name: 'SBI PO & Junior Associate Clerk', conducting_body: 'State Bank of India', category: 'Banking', country: 'India',
        requirements: {
            photo: { min_width_px: 200, max_width_px: 250, min_height_px: 230, max_height_px: 270, target_width: 200, target_height: 230, aspect_ratio: '4.5:3.5', min_kb: 20, max_kb: 50, bg_color: 'Light background', dpi: 200 },
            signature: { min_width_px: 140, max_width_px: 200, min_height_px: 60, max_height_px: 100, target_width: 140, target_height: 60, aspect_ratio: '2.3:1', min_kb: 10, max_kb: 20, bg_color: 'Black ink', dpi: 200 }
        }
    },
    {
        id: 7, code: 'rrb_ntpc', name: 'Railway RRB NTPC & Group D Recruitment', conducting_body: 'Railway Recruitment Control Board', category: 'Government Job', country: 'India',
        requirements: {
            photo: { min_width_px: 320, max_width_px: 400, min_height_px: 400, max_height_px: 500, target_width: 320, target_height: 400, aspect_ratio: '3.5:4.5', min_kb: 20, max_kb: 50, bg_color: 'White background', dpi: 200 },
            signature: { min_width_px: 250, max_width_px: 350, min_height_px: 100, max_height_px: 150, target_width: 250, target_height: 100, aspect_ratio: '2.5:1.0', min_kb: 10, max_kb: 20, bg_color: 'Black ink', dpi: 200 }
        }
    },
    {
        id: 8, code: 'nta_neet', name: 'NTA NEET (UG) Medical Entrance', conducting_body: 'National Testing Agency', category: 'Medical Entrance', country: 'India',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 600, min_height_px: 450, max_height_px: 800, target_width: 400, target_height: 520, aspect_ratio: '3.5:4.5', min_kb: 10, max_kb: 200, bg_color: 'White background (80% face)', dpi: 300 },
            signature: { min_width_px: 280, max_width_px: 500, min_height_px: 100, max_height_px: 250, target_width: 350, target_height: 150, aspect_ratio: '3.5:1.5', min_kb: 4, max_kb: 30, bg_color: 'White sheet with Black ink', dpi: 300 }
        }
    },
    {
        id: 9, code: 'nta_jee', name: 'NTA JEE Main Engineering Entrance', conducting_body: 'National Testing Agency', category: 'Engineering Entrance', country: 'India',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 600, min_height_px: 450, max_height_px: 800, target_width: 400, target_height: 520, aspect_ratio: '3.5:4.5', min_kb: 10, max_kb: 200, bg_color: 'White background', dpi: 300 },
            signature: { min_width_px: 280, max_width_px: 500, min_height_px: 100, max_height_px: 250, target_width: 350, target_height: 150, aspect_ratio: '3.5:1.5', min_kb: 4, max_kb: 30, bg_color: 'White sheet with Black ink', dpi: 300 }
        }
    },
    {
        id: 10, code: 'gate_exam', name: 'GATE Engineering Entrance (IITs)', conducting_body: 'Indian Institutes of Technology', category: 'Engineering Entrance', country: 'India',
        requirements: {
            photo: { min_width_px: 240, max_width_px: 520, min_height_px: 320, max_height_px: 680, target_width: 350, target_height: 460, aspect_ratio: '3.5:4.5', min_kb: 5, max_kb: 200, bg_color: 'White background', dpi: 200 },
            signature: { min_width_px: 280, max_width_px: 560, min_height_px: 80, max_height_px: 160, target_width: 280, target_height: 100, aspect_ratio: '2.8:1', min_kb: 5, max_kb: 200, bg_color: 'Dark blue or black ink', dpi: 200 }
        }
    },
    {
        id: 11, code: 'cat_exam', name: 'CAT Management Entrance (IIMs)', conducting_body: 'Indian Institutes of Management', category: 'Management Entrance', country: 'India',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 500, min_height_px: 450, max_height_px: 600, target_width: 350, target_height: 450, aspect_ratio: '3.5:4.5', min_kb: 20, max_kb: 80, bg_color: 'White background', dpi: 200 },
            signature: { min_width_px: 280, max_width_px: 400, min_height_px: 100, max_height_px: 150, target_width: 280, target_height: 100, aspect_ratio: '2.8:1', min_kb: 20, max_kb: 80, bg_color: 'White background', dpi: 200 }
        }
    },
    {
        id: 12, code: 'cuet_ug', name: 'NTA CUET (UG & PG) Entrance Exam', conducting_body: 'National Testing Agency', category: 'University Entrance', country: 'India',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 600, min_height_px: 450, max_height_px: 800, target_width: 400, target_height: 520, aspect_ratio: '3.5:4.5', min_kb: 10, max_kb: 200, bg_color: 'White background', dpi: 300 },
            signature: { min_width_px: 280, max_width_px: 500, min_height_px: 100, max_height_px: 250, target_width: 350, target_height: 150, aspect_ratio: '3.5:1.5', min_kb: 4, max_kb: 30, bg_color: 'Black ink', dpi: 300 }
        }
    },
    {
        id: 13, code: 'afcat', name: 'AFCAT & CDS Defence Exam', conducting_body: 'Indian Air Force / UPSC', category: 'Defence Exam', country: 'India',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 500, min_height_px: 450, max_height_px: 600, target_width: 350, target_height: 450, aspect_ratio: '3.5:4.5', min_kb: 10, max_kb: 50, bg_color: 'Light background', dpi: 200 },
            signature: { min_width_px: 280, max_width_px: 400, min_height_px: 100, max_height_px: 150, target_width: 280, target_height: 100, aspect_ratio: '2.8:1', min_kb: 10, max_kb: 50, bg_color: 'White paper', dpi: 200 }
        }
    },
    {
        id: 14, code: 'nepal_psc', name: 'Nepal Lok Sewa Aayog (Public Service Commission Nepal)', conducting_body: 'Lok Sewa Aayog Nepal 🇳🇵', category: 'Government Job', country: 'Nepal',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 450, min_height_px: 450, max_height_px: 550, target_width: 350, target_height: 450, aspect_ratio: '3.5:4.5', min_kb: 20, max_kb: 200, bg_color: 'Plain white background (PP size)', dpi: 300 },
            signature: { min_width_px: 300, max_width_px: 500, min_height_px: 150, max_height_px: 250, target_width: 300, target_height: 150, aspect_ratio: '2:1', min_kb: 10, max_kb: 100, bg_color: 'Black ink on white paper', dpi: 300 }
        }
    },
    {
        id: 15, code: 'nepal_mecee', name: 'Nepal MECEE Medical Entrance Exam', conducting_body: 'Medical Education Commission Nepal 🇳🇵', category: 'Medical Entrance', country: 'Nepal',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 450, min_height_px: 450, max_height_px: 550, target_width: 350, target_height: 450, aspect_ratio: '3.5:4.5', min_kb: 20, max_kb: 200, bg_color: 'White background (MRP specs)', dpi: 300 },
            signature: { min_width_px: 300, max_width_px: 450, min_height_px: 150, max_height_px: 200, target_width: 300, target_height: 150, aspect_ratio: '2:1', min_kb: 10, max_kb: 50, bg_color: 'Black ink', dpi: 300 }
        }
    },
    {
        id: 16, code: 'nepal_ioe', name: 'Nepal IOE Engineering Entrance (Tribhuvan University)', conducting_body: 'Institute of Engineering Nepal 🇳🇵', category: 'Engineering Entrance', country: 'Nepal',
        requirements: {
            photo: { min_width_px: 300, max_width_px: 400, min_height_px: 360, max_height_px: 480, target_width: 300, target_height: 360, aspect_ratio: '3:3.6', min_kb: 10, max_kb: 50, bg_color: 'Light background', dpi: 200 },
            signature: { min_width_px: 300, max_width_px: 400, min_height_px: 150, max_height_px: 200, target_width: 300, target_height: 150, aspect_ratio: '2:1', min_kb: 5, max_kb: 20, bg_color: 'Black ink on white paper', dpi: 200 }
        }
    },
    {
        id: 17, code: 'nepal_eps_topik', name: 'Nepal EPS-TOPIK (Korea Work Visa Exam)', conducting_body: 'HRD Korea / Ministry of Labour Nepal 🇳🇵', category: 'Government Job', country: 'Nepal',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 600, min_height_px: 450, max_height_px: 600, target_width: 600, target_height: 600, aspect_ratio: '1:1', min_kb: 10, max_kb: 100, bg_color: 'White background', dpi: 300 },
            signature: { min_width_px: 300, max_width_px: 500, min_height_px: 150, max_height_px: 250, target_width: 300, target_height: 150, aspect_ratio: '2:1', min_kb: 5, max_kb: 50, bg_color: 'White paper', dpi: 300 }
        }
    },
    {
        id: 18, code: 'usa_dv_lottery', name: 'US Green Card DV Lottery & US Visa Photo 🇺🇸', conducting_body: 'US Department of State', category: 'Global Visa', country: 'USA',
        requirements: {
            photo: { min_width_px: 600, max_width_px: 1200, min_height_px: 600, max_height_px: 1200, target_width: 600, target_height: 600, aspect_ratio: '1:1', min_kb: 10, max_kb: 240, bg_color: 'Plain white / off-white background', dpi: 300 },
            signature: { min_width_px: 300, max_width_px: 600, min_height_px: 150, max_height_px: 300, target_width: 300, target_height: 150, aspect_ratio: '2:1', min_kb: 10, max_kb: 100, bg_color: 'Black ink', dpi: 300 }
        }
    },
    {
        id: 99, code: 'custom', name: '📐 Custom Image Resizer (Custom Width, Height & KB)', conducting_body: 'Freeform Custom Resizing Utility', category: 'Custom Preset', country: 'all',
        requirements: {
            photo: { min_width_px: 350, max_width_px: 1000, min_height_px: 450, max_height_px: 1000, target_width: 350, target_height: 450, aspect_ratio: 'Custom', min_kb: 20, max_kb: 100, bg_color: 'User preference', dpi: 300 },
            signature: { min_width_px: 280, max_width_px: 1000, min_height_px: 140, max_height_px: 1000, target_width: 280, target_height: 140, aspect_ratio: 'Custom', min_kb: 10, max_kb: 50, bg_color: 'User preference', dpi: 300 }
        }
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    fetchExamsData();
    setupEventListeners();
    setupUtilityToolDropzones();
    checkWorkspacePanels();
    updateHistoryBadge();
});

// Suite Navigation Tool Switching
function switchMainTool(toolId) {
    state.currentMainTool = toolId;
    document.querySelectorAll('.suite-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tool === toolId);
    });
    document.querySelectorAll('.tool-view').forEach(view => {
        const isActive = view.id === `view-${toolId}`;
        view.style.display = isActive ? 'block' : 'none';
        view.classList.toggle('active', isActive);
    });
    showToast(`Switched to ${toolId.replace('-', ' ').toUpperCase()}`, 'info');
}

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
    if (!select) return;

    select.innerHTML = '<option value="" disabled>-- Select Exam / Specification --</option>';

    const filtered = state.exams.filter(e => {
        const matchCountry = (state.activeCountry === 'all' || e.country === 'all' || e.country === state.activeCountry);
        const matchCat = (state.activeCategory === 'all' || e.category === state.activeCategory);
        return matchCountry && matchCat;
    });

    filtered.forEach(exam => {
        const opt = document.createElement('option');
        opt.value = exam.code;
        opt.textContent = `${exam.name} (${exam.conducting_body})`;
        select.appendChild(opt);
    });

    if (filtered.length > 0) {
        select.value = filtered[0].code;
        selectExam(filtered[0].code);
    } else {
        showToast('No exam presets found matching your filter selection', 'info');
    }
}

// Select an Exam preset
function selectExam(code) {
    state.selectedExam = state.exams.find(e => e.code === code);
    if (!state.selectedExam) return;

    const isCustom = code === 'custom';
    const customPanel = document.getElementById('customExamPanel');
    if (customPanel) customPanel.style.display = isCustom ? 'block' : 'none';

    if (isCustom) updateCustomSpecs();

    updateSpecBanner();
    highlightTableRows();

    if (state.images.photo.original) processCanvas('photo');
    if (state.images.signature.original) processCanvas('signature');
}

// Live Custom Dimensions & KB Target Updater
function updateCustomSpecs() {
    if (!state.selectedExam || state.selectedExam.code !== 'custom') return;

    const w = parseInt(document.getElementById('customPhotoW').value) || 350;
    const h = parseInt(document.getElementById('customPhotoH').value) || 450;
    const minKb = parseInt(document.getElementById('customMinKb').value) || 20;
    const maxKb = parseInt(document.getElementById('customMaxKb').value) || 100;

    state.selectedExam.requirements.photo.target_width = w;
    state.selectedExam.requirements.photo.min_width_px = w;
    state.selectedExam.requirements.photo.target_height = h;
    state.selectedExam.requirements.photo.min_height_px = h;
    state.selectedExam.requirements.photo.min_kb = minKb;
    state.selectedExam.requirements.photo.max_kb = maxKb;

    updateSpecBanner();

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

// Setup Event Listeners for Exam Dropzone & Controls
function setupEventListeners() {
    const examSelect = document.getElementById('examSelect');
    if (examSelect) {
        examSelect.addEventListener('change', (e) => selectExam(e.target.value));
    }

    // Country Pills Selector Listener
    document.querySelectorAll('#countryPills .pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('#countryPills .pill').forEach(p => p.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.activeCountry = e.currentTarget.dataset.country;
            populateDropdown();
            showToast(`Showing ${e.currentTarget.textContent.trim()} presets`, 'info');
        });
    });

    // Category Pills Selector Listener
    document.querySelectorAll('#categoryPills .pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('#categoryPills .pill').forEach(p => p.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.activeCategory = e.currentTarget.dataset.cat;
            populateDropdown();
        });
    });

    setupDropzone('photoDropzone', 'photoFileInput', 'photo');
    setupDropzone('sigDropzone', 'sigFileInput', 'signature');

    const photoZoom = document.getElementById('photoZoomRange');
    if (photoZoom) {
        photoZoom.addEventListener('input', (e) => {
            state.images.photo.zoom = parseFloat(e.target.value);
            processCanvas('photo');
        });
    }

    const sigZoom = document.getElementById('sigZoomRange');
    if (sigZoom) {
        sigZoom.addEventListener('input', (e) => {
            state.images.signature.zoom = parseFloat(e.target.value);
            processCanvas('signature');
        });
    }

    const dlPhoto = document.getElementById('downloadPhotoBtn');
    if (dlPhoto) dlPhoto.addEventListener('click', () => downloadImage('photo'));

    const dlSig = document.getElementById('downloadSigBtn');
    if (dlSig) dlSig.addEventListener('click', () => downloadImage('signature'));

    const fbPhoto = document.getElementById('serverFallbackPhotoBtn');
    if (fbPhoto) fbPhoto.addEventListener('click', () => triggerServerFallback('photo'));

    const fbSig = document.getElementById('serverFallbackSigBtn');
    if (fbSig) fbSig.addEventListener('click', () => triggerServerFallback('signature'));
}

// Setup Utility Tool Dropzones
function setupUtilityToolDropzones() {
    setupGenericToolDropzone('bgDropzone', 'bgFileInput', 'bg', handleBgUpload);
    setupGenericToolDropzone('compDropzone', 'compFileInput', 'comp', handleCompUpload);
    setupGenericToolDropzone('resizeDropzone', 'resizeFileInput', 'resize', handleResizeUpload);
    setupGenericToolDropzone('convDropzone', 'convFileInput', 'conv', handleConvUpload);
    setupGenericToolDropzone('cropDropzone', 'cropFileInput', 'crop', handleCropUpload);
    setupGenericToolDropzone('pdfDropzone', 'pdfFileInput', 'pdf', handlePdfUpload);
    setupGenericToolDropzone('upscaleDropzone', 'upscaleFileInput', 'upscale', handleUpscaleUpload);

    const upFactor = document.getElementById('upscaleFactorSelect');
    if (upFactor) {
        upFactor.addEventListener('change', () => {
            if (state.images.upscale.original) processUpscalerTool();
        });
    }

    const upSharpen = document.getElementById('upscaleSharpen');
    if (upSharpen) {
        upSharpen.addEventListener('input', () => {
            if (state.images.upscale.original) processUpscalerTool();
        });
    }

    const bgThresh = document.getElementById('bgThreshold');
    if (bgThresh) {
        bgThresh.addEventListener('input', () => {
            if (state.images.bg.original) processBgRemoval();
        });
    }

    const bgType = document.getElementById('bgTypeSelect');
    if (bgType) {
        bgType.addEventListener('change', () => {
            if (state.images.bg.original) processBgRemoval();
        });
    }

    document.getElementById('compTargetKb').addEventListener('input', (e) => {
        if (state.images.comp.original) processCompressorTool();
    });

    document.getElementById('resizeW').addEventListener('input', (e) => {
        if (state.images.resize.original) processResizeTool();
    });
    document.getElementById('resizeH').addEventListener('input', (e) => {
        if (state.images.resize.original) processResizeTool();
    });
}

function setupGenericToolDropzone(dropzoneId, fileInputId, toolKey, callback) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);
    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            if (toolKey === 'pdf') {
                if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
                    showToast('Invalid file format: Please drop a valid PDF document file (.pdf)', 'error');
                    return;
                }
            } else {
                if (!file.type.startsWith('image/')) {
                    showToast('Invalid file format: Please drop a valid image file (JPG, PNG, WEBP)', 'error');
                    return;
                }
            }
            callback(file);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) callback(e.target.files[0]);
    });
}

// Tab Switching Logic (Exam Studio)
function switchTab(type) {
    state.activeTab = type;
    document.getElementById('tabPhotoBtn').classList.toggle('active', type === 'photo');
    document.getElementById('tabSigBtn').classList.toggle('active', type === 'signature');
    document.getElementById('panePhoto').classList.toggle('active', type === 'photo');
    document.getElementById('paneSignature').classList.toggle('active', type === 'signature');
    checkWorkspacePanels();
}



// Drag & Drop Handling for Exam Studio
function setupDropzone(dropzoneId, fileInputId, type) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);
    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            if (!files[0].type.startsWith('image/')) {
                showToast(`Invalid file format: Please upload a valid JPG, PNG, or WEBP ${type} image.`, 'error');
                return;
            }
            handleFileSelect(files[0], type);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0], type);
    });
}

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
            
            document.getElementById(type === 'photo' ? 'photoControlPanel' : 'sigControlPanel').style.display = 'block';
            document.getElementById(type === 'photo' ? 'photoComplianceMeter' : 'sigComplianceMeter').style.display = 'block';
            document.getElementById(type === 'photo' ? 'photoActionBar' : 'sigActionBar').style.display = 'flex';
            
            processCanvas(type);
            showToast(`${type.toUpperCase()} uploaded successfully!`, 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Exam Canvas Processing
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

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);

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

    let lowQ = 0.05;
    let highQ = 0.98;
    let bestDataUrl = null;
    let bestSizeKb = 0;

    for (let i = 0; i < 8; i++) {
        const midQ = (lowQ + highQ) / 2;
        const dataUrl = canvas.toDataURL('image/jpeg', midQ);
        const sizeKb = estimateBase64SizeKb(dataUrl);

        bestDataUrl = dataUrl;
        bestSizeKb = sizeKb;

        if (sizeKb > req.max_kb) {
            highQ = midQ - 0.02;
        } else if (sizeKb < req.min_kb) {
            lowQ = midQ + 0.02;
        } else {
            break;
        }
    }

    imgObj.dataUrl = bestDataUrl;
    imgObj.sizeKb = bestSizeKb;

    updateStagePreview(stageId, type, imgObj.original.src, bestDataUrl);
    updateComplianceMeter(type, bestSizeKb, req.min_kb, req.max_kb);
}

// Ensure control panels & compliance meters are hidden when no image is loaded
function checkWorkspacePanels() {
    ['photo', 'signature'].forEach(type => {
        const hasImg = !!(state.images[type] && state.images[type].original);
        const ctrl = document.getElementById(type === 'photo' ? 'photoControlPanel' : 'sigControlPanel');
        const meter = document.getElementById(type === 'photo' ? 'photoComplianceMeter' : 'sigComplianceMeter');
        const act = document.getElementById(type === 'photo' ? 'photoActionBar' : 'sigActionBar');
        if (ctrl) ctrl.style.display = hasImg ? 'block' : 'none';
        if (meter) meter.style.display = hasImg ? 'block' : 'none';
        if (act) act.style.display = hasImg ? 'flex' : 'none';
    });
}

// Estimate Base64 DataURL File Size in KB
function estimateBase64SizeKb(dataUrl) {
    if (!dataUrl) return 0;
    const base64Str = dataUrl.split(',')[1] || '';
    const bytes = Math.round((base64Str.length * 3) / 4);
    return Math.round((bytes / 1024) * 10) / 10;
}

// Update Compliance Meter & Size Status Badge
function updateComplianceMeter(type, sizeKb, minKb, maxKb) {
    const sizeEl = document.getElementById(type === 'photo' ? 'photoCurrentSize' : 'sigCurrentSize');
    const badgeEl = document.getElementById(type === 'photo' ? 'photoStatusBadge' : 'sigStatusBadge');
    const progressEl = document.getElementById(type === 'photo' ? 'photoSizeProgress' : 'sigSizeProgress');
    const meterEl = document.getElementById(type === 'photo' ? 'photoComplianceMeter' : 'sigComplianceMeter');

    if (meterEl) meterEl.style.display = 'block';
    if (sizeEl) sizeEl.textContent = `${sizeKb} KB`;

    const isValid = sizeKb >= minKb && sizeKb <= maxKb;
    if (badgeEl) {
        if (isValid) {
            badgeEl.className = 'status-badge status-valid';
            badgeEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Compliant';
        } else if (sizeKb < minKb) {
            badgeEl.className = 'status-badge status-invalid';
            badgeEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Below Limit (${sizeKb} KB)`;
        } else {
            badgeEl.className = 'status-badge status-invalid';
            badgeEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Exceeds Limit (${sizeKb} KB)`;
        }
    }

    if (progressEl) {
        let pct = 0;
        if (maxKb > 0) {
            pct = Math.min(100, Math.max(5, Math.round((sizeKb / maxKb) * 100)));
        }
        progressEl.style.width = `${pct}%`;
        progressEl.style.background = isValid 
            ? 'linear-gradient(90deg, #10b981, #34d399)' 
            : 'linear-gradient(90deg, #ef4444, #f87171)';
    }
}

// Rotate Image Controls
function rotateImage(type, deg) {
    if (!state.images[type].original) return;
    state.images[type].rotation = (state.images[type].rotation + deg + 360) % 360;
    processCanvas(type);
}

// Reset Image Controls
function resetControls(type) {
    if (!state.images[type].original) return;
    state.images[type].zoom = 1;
    state.images[type].rotation = 0;
    const zoomInput = document.getElementById(type === 'photo' ? 'photoZoomRange' : 'sigZoomRange');
    if (zoomInput) zoomInput.value = 1;
    processCanvas(type);
}

// 1. TOOL: BACKGROUND REMOVER LOGIC
function handleBgUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.images.bg.original = img;
            document.getElementById('bgControlPanel').style.display = 'block';
            document.getElementById('bgActionBar').style.display = 'flex';
            processBgRemoval();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function processBgRemoval() {
    const img = state.images.bg.original;
    if (!img) return;

    const w = img.width;
    const h = img.height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const thresholdInput = document.getElementById('bgThreshold');
    const threshold = thresholdInput ? parseInt(thresholdInput.value) || 25 : 25;
    const bgType = document.getElementById('bgTypeSelect') ? document.getElementById('bgTypeSelect').value : 'white';

    // 1. Calculate Average Background Color from Outer Image Borders
    let totalR = 0, totalG = 0, totalB = 0, count = 0;

    for (let x = 0; x < w; x++) {
        let idx = (0 * w + x) * 4;
        totalR += data[idx]; totalG += data[idx + 1]; totalB += data[idx + 2]; count++;
        idx = ((h - 1) * w + x) * 4;
        totalR += data[idx]; totalG += data[idx + 1]; totalB += data[idx + 2]; count++;
    }
    for (let y = 0; y < h; y++) {
        let idx = (y * w + 0) * 4;
        totalR += data[idx]; totalG += data[idx + 1]; totalB += data[idx + 2]; count++;
        idx = (y * w + (w - 1)) * 4;
        totalR += data[idx]; totalG += data[idx + 1]; totalB += data[idx + 2]; count++;
    }

    const bgR = Math.round(totalR / count);
    const bgG = Math.round(totalG / count);
    const bgB = Math.round(totalB / count);

    // 2. Perform BFS / Flood-Fill starting ONLY from Outer Border Pixels
    const visited = new Uint8Array(w * h);
    const queue = [];

    const isBgPixel = (idx) => {
        const diff = Math.abs(data[idx] - bgR) + Math.abs(data[idx + 1] - bgG) + Math.abs(data[idx + 2] - bgB);
        return diff < threshold * 2.5;
    };

    for (let x = 0; x < w; x++) {
        let iTop = 0 * w + x;
        if (isBgPixel(iTop * 4)) { visited[iTop] = 1; queue.push(iTop); }
        let iBtm = (h - 1) * w + x;
        if (isBgPixel(iBtm * 4)) { visited[iBtm] = 1; queue.push(iBtm); }
    }
    for (let y = 0; y < h; y++) {
        let iLft = y * w + 0;
        if (!visited[iLft] && isBgPixel(iLft * 4)) { visited[iLft] = 1; queue.push(iLft); }
        let iRgt = y * w + (w - 1);
        if (!visited[iRgt] && isBgPixel(iRgt * 4)) { visited[iRgt] = 1; queue.push(iRgt); }
    }

    // Process Flood Fill Queue (4-directional spreading)
    let head = 0;
    while (head < queue.length) {
        const p = queue[head++];
        const px = p % w;
        const py = Math.floor(p / w);

        const neighbors = [
            py > 0 ? (py - 1) * w + px : -1,
            py < h - 1 ? (py + 1) * w + px : -1,
            px > 0 ? py * w + (px - 1) : -1,
            px < w - 1 ? py * w + (px + 1) : -1
        ];

        for (let n of neighbors) {
            if (n >= 0 && !visited[n]) {
                if (isBgPixel(n * 4)) {
                    visited[n] = 1;
                    queue.push(n);
                }
            }
        }
    }

    // 3. Replace background pixels ONLY (leaving candidate foreground untouched)
    for (let i = 0; i < w * h; i++) {
        if (visited[i]) {
            const idx = i * 4;
            if (bgType === 'white') {
                data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255; data[idx + 3] = 255;
            } else {
                data[idx + 3] = 0; // Transparent
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
    const format = bgType === 'transparent' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(format, 0.95);
    state.images.bg.processedUrl = dataUrl;

    updateStagePreview('bgPreviewStage', 'bg', img.src, dataUrl);
}

// 2. TOOL: IMAGE COMPRESSOR LOGIC
function handleCompUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.images.comp.original = img;
            document.getElementById('compControlPanel').style.display = 'block';
            document.getElementById('compMeter').style.display = 'block';
            document.getElementById('compActionBar').style.display = 'flex';
            processCompressorTool();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function setQuickKb(kb) {
    document.getElementById('compTargetKb').value = kb;
    if (state.images.comp.original) processCompressorTool();
}

function processCompressorTool() {
    const img = state.images.comp.original;
    if (!img) return;

    const targetKb = parseFloat(document.getElementById('compTargetKb').value) || 50;

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    let lowQ = 0.02, highQ = 0.98, bestUrl = null, bestKb = 0;

    for (let i = 0; i < 9; i++) {
        const midQ = (lowQ + highQ) / 2;
        const url = canvas.toDataURL('image/jpeg', midQ);
        const kb = estimateBase64SizeKb(url);
        bestUrl = url;
        bestKb = kb;

        if (kb > targetKb) {
            highQ = midQ - 0.02;
        } else {
            lowQ = midQ + 0.02;
        }
    }

    state.images.comp.processedUrl = bestUrl;
    state.images.comp.sizeKb = bestKb;

    updateStagePreview('compPreviewStage', 'comp', img.src, bestUrl);
    document.getElementById('compSizeVal').textContent = `${bestKb} KB`;
}

// 3. TOOL: FREEFORM RESIZER LOGIC
function handleResizeUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.images.resize.original = img;
            document.getElementById('resizeW').value = img.width;
            document.getElementById('resizeH').value = img.height;
            document.getElementById('resizeControlPanel').style.display = 'block';
            document.getElementById('resizeActionBar').style.display = 'flex';
            processResizeTool();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function processResizeTool() {
    const img = state.images.resize.original;
    if (!img) return;

    const targetW = parseInt(document.getElementById('resizeW').value) || 800;
    const targetH = parseInt(document.getElementById('resizeH').value) || 600;

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    state.images.resize.processedUrl = dataUrl;

    updateStagePreview('resizePreviewStage', 'resize', img.src, dataUrl);
}

// 4. TOOL: FORMAT CONVERTER LOGIC (PNG ↔ JPG)
function handleConvUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.images.conv.original = img;
            document.getElementById('convControlPanel').style.display = 'block';
            document.getElementById('convActionBar').style.display = 'flex';
            processFormatConversion();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function processFormatConversion() {
    const img = state.images.conv.original;
    if (!img) return;

    const format = document.getElementById('convFormatSelect').value;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL(format, 0.92);
    state.images.conv.processedUrl = dataUrl;
    state.images.conv.format = format;

    updateStagePreview('convPreviewStage', 'conv', img.src, dataUrl);
    showToast(`Converted format to ${format.replace('image/', '').toUpperCase()}`, 'success');
}

// 5. TOOL: IMAGE CROPPER LOGIC
function handleCropUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.images.crop.original = img;
            document.getElementById('cropControlPanel').style.display = 'block';
            document.getElementById('cropActionBar').style.display = 'flex';
            processCropImage();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function setCropRatio(ratio) {
    state.images.crop.ratio = ratio;
    if (state.images.crop.original) processCropImage();
}

function processCropImage() {
    const img = state.images.crop.original;
    if (!img) return;

    let targetW = img.width;
    let targetH = img.height;
    const ratio = state.images.crop.ratio;

    if (ratio === '1:1') {
        targetW = Math.min(img.width, img.height);
        targetH = targetW;
    } else if (ratio === '3.5:4.5') {
        targetW = Math.min(img.width, Math.round(img.height * (3.5 / 4.5)));
        targetH = Math.round(targetW * (4.5 / 3.5));
    } else if (ratio === '2:1') {
        targetW = Math.min(img.width, Math.round(img.height * 2));
        targetH = Math.round(targetW / 2);
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, (img.width - targetW) / 2, (img.height - targetH) / 2, targetW, targetH, 0, 0, targetW, targetH);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    state.images.crop.processedUrl = dataUrl;

    updateStagePreview('cropPreviewStage', 'crop', img.src, dataUrl);
}

// 6. TOOL: PDF TO IMAGE CONVERTER LOGIC
function handlePdfUpload(file) {
    const container = document.getElementById('pdfPagesContainer');
    container.innerHTML = '<span class="placeholder-text"><i class="fa-solid fa-spinner fa-spin"></i> Rendering PDF pages...</span>';

    const reader = new FileReader();
    reader.onload = function(e) {
        const typedArray = new Uint8Array(e.target.result);

        if (typeof pdfjsLib === 'undefined') {
            showToast('PDF.js library loading... Please try again in a moment.', 'error');
            return;
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
            container.innerHTML = '';
            showToast(`PDF Loaded: ${pdf.numPages} Page(s)`, 'success');

            for (let i = 1; i <= pdf.numPages; i++) {
                pdf.getPage(i).then(page => {
                    const viewport = page.getViewport({ scale: 1.5 });
                    const card = document.createElement('div');
                    card.className = 'pdf-page-card';

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = { canvasContext: ctx, viewport: viewport };
                    page.render(renderContext).promise.then(() => {
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
                        card.innerHTML = `
                            <span class="page-num">Page ${page.pageNumber}</span>
                            <button class="btn btn-primary btn-sm" onclick="downloadPdfPage('${dataUrl}', ${page.pageNumber})">
                                <i class="fa-solid fa-download"></i> Save JPG
                            </button>
                        `;
                        card.insertBefore(canvas, card.firstChild);
                    });

                    container.appendChild(card);
                });
            }
        }).catch(err => {
            showToast('Failed to load PDF document', 'error');
            container.innerHTML = '<span class="placeholder-text"><i class="fa-solid fa-triangle-exclamation"></i> Error parsing PDF file</span>';
        });
    };
    reader.readAsArrayBuffer(file);
}

// 7. TOOL: AI 4K ULTRA UPSCALER LOGIC
function handleUpscaleUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.images.upscale.original = img;
            state.images.upscale.file = file;
            const ctrl = document.getElementById('upscaleControlPanel');
            const act = document.getElementById('upscaleActionBar');
            const meter = document.getElementById('upscaleInfoMeter');
            if (ctrl) ctrl.style.display = 'block';
            if (act) act.style.display = 'flex';
            if (meter) meter.style.display = 'block';
            processUpscalerTool();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function processUpscalerTool() {
    const img = state.images.upscale.original;
    if (!img) return;

    const factor = parseFloat(document.getElementById('upscaleFactorSelect').value) || 4;
    const sharpenAmount = parseInt(document.getElementById('upscaleSharpen').value) || 40;

    let targetW = Math.round(img.width * factor);
    let targetH = Math.round(img.height * factor);

    // Limit maximum 4K dimension to 3840 x 2160 max aspect
    const MAX_DIM = 3840;
    if (targetW > MAX_DIM || targetH > MAX_DIM) {
        if (targetW >= targetH) {
            targetH = Math.round((targetH * MAX_DIM) / targetW);
            targetW = MAX_DIM;
        } else {
            targetW = Math.round((targetW * MAX_DIM) / targetH);
            targetH = MAX_DIM;
        }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    // High Quality Interpolation rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Unsharp Mask Sharpening Filter Pass if sharpenAmount > 0
    if (sharpenAmount > 0) {
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;
        const copyData = new Uint8ClampedArray(data);
        const mix = (sharpenAmount / 100) * 0.45;

        for (let y = 1; y < targetH - 1; y++) {
            for (let x = 1; x < targetW - 1; x++) {
                const idx = (y * targetW + x) * 4;
                const topIdx = ((y - 1) * targetW + x) * 4;
                const btmIdx = ((y + 1) * targetW + x) * 4;
                const lftIdx = (y * targetW + (x - 1)) * 4;
                const rgtIdx = (y * targetW + (x + 1)) * 4;

                for (let c = 0; c < 3; c++) {
                    const center = copyData[idx + c];
                    const surround = (copyData[topIdx + c] + copyData[btmIdx + c] + copyData[lftIdx + c] + copyData[rgtIdx + c]) / 4;
                    const sharpened = center + (center - surround) * mix;
                    data[idx + c] = Math.min(255, Math.max(0, sharpened));
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    state.images.upscale.processedUrl = dataUrl;

    const mp = ((targetW * targetH) / 1000000).toFixed(1);
    const resText = document.getElementById('upscaleResText');
    if (resText) resText.textContent = `${targetW} × ${targetH} (${mp} MP 4K UHD)`;

    updateStagePreview('upscalePreviewStage', 'upscale', img.src, dataUrl);
}

// Robust iOS & Mobile Compatible Image Download Handler
async function triggerDownload(dataUrl, filename, mimeType = 'image/jpeg') {
    if (!dataUrl) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        if (isIOS && navigator.share) {
            const file = new File([blob], filename, { type: mimeType });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({ files: [file], title: filename });
                    showToast('Saved to iOS Photos / Share', 'success');
                    return;
                } catch (shareErr) {
                    if (shareErr.name !== 'AbortError') {
                        console.warn('Share API failed, falling back:', shareErr);
                    }
                }
            }
        }

        if (isIOS) {
            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write(`<title>${filename}</title><img src="${dataUrl}" style="width:100%; height:auto;"/><p style="text-align:center; font-family:sans-serif; color:#666; margin-top:20px;">Touch & Hold image above to select "Save to Photos"</p>`);
                showToast('Long press image to "Save to Photos"', 'info');
                return;
            }
        }

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        saveDownloadHistoryItem(filename, dataUrl);
        showToast(`Downloaded ${filename}`, 'success');
    } catch (err) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        saveDownloadHistoryItem(filename, dataUrl);
        showToast(`Downloaded ${filename}`, 'success');
    }
}

function downloadPdfPage(dataUrl, pageNum) {
    triggerDownload(dataUrl, `PDF_Page_${pageNum}.jpg`, 'image/jpeg');
}

// Download Helper for Utility Tools
function downloadToolOutput(toolKey) {
    const url = state.images[toolKey] ? state.images[toolKey].processedUrl : null;
    if (!url) {
        showToast('No processed file ready for download', 'error');
        return;
    }

    const isPng = (toolKey === 'conv' && state.images.conv.format === 'image/png');
    const ext = isPng ? 'png' : 'jpg';
    const mime = isPng ? 'image/png' : 'image/jpeg';

    triggerDownload(url, `Processed_${toolKey.toUpperCase()}_Image.${ext}`, mime);
}

function downloadImage(type) {
    const imgObj = state.images[type];
    if (!imgObj.dataUrl) {
        showToast('No image available to download', 'error');
        return;
    }

    const examCode = state.selectedExam ? state.selectedExam.code : 'exam';
    const filename = `${examCode.toUpperCase()}_${type.toUpperCase()}_Resized.jpg`;

    triggerDownload(imgObj.dataUrl, filename, 'image/jpeg');
}

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
        const response = await fetch('api/process.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image_base64: imgObj.dataUrl,
                width: targetW,
                height: targetH,
                min_kb: req.min_kb,
                max_kb: req.max_kb
            })
        });

        const json = await response.json();
        if (json.status === 'success' && json.data.data_url) {
            imgObj.dataUrl = json.data.data_url;
            imgObj.sizeKb = json.data.file_size_kb;

            document.getElementById(type === 'photo' ? 'photoPreviewStage' : 'sigPreviewStage').innerHTML = `<img src="${json.data.data_url}" alt="Python Resized ${type}">`;
            updateComplianceMeter(type, json.data.file_size_kb, req.min_kb, req.max_kb);
            showToast(`Python Pillow compression succeeded! Output: ${json.data.file_size_kb} KB`, 'success');
        } else {
            showToast(`Server Fallback Error: ${json.message || 'Processing failed'}`, 'error');
        }
    } catch (e) {
        showToast('Server connection failed. Ensure PHP backend server is running.', 'error');
    }
}

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

function highlightTableRows() {
    document.querySelectorAll('.data-table tbody tr').forEach(r => r.style.background = 'transparent');
    if (state.selectedExam) {
        const activeRow = document.getElementById(`row-${state.selectedExam.code}`);
        if (activeRow) activeRow.style.background = 'rgba(16, 185, 129, 0.15)';
    }
}

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

function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    themeBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') !== 'light';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
}

// ==========================================
// UX ENHANCEMENTS: History, Workspace Reset, Preview Modes
// ==========================================

function getDownloadHistory() {
    try {
        return JSON.parse(localStorage.getItem('exams_download_history') || '[]');
    } catch (e) {
        return [];
    }
}

function saveDownloadHistoryItem(filename, dataUrl) {
    if (!dataUrl) return;
    try {
        const history = getDownloadHistory();
        const newItem = {
            id: Date.now(),
            filename: filename,
            dataUrl: dataUrl,
            timestamp: new Date().toLocaleString()
        };
        history.unshift(newItem);
        if (history.length > 20) history.pop();
        localStorage.setItem('exams_download_history', JSON.stringify(history));
        updateHistoryBadge();
    } catch (e) {
        console.warn('LocalStorage limit reached for history:', e);
    }
}

function updateHistoryBadge() {
    const badge = document.getElementById('historyBadge');
    if (!badge) return;
    const history = getDownloadHistory();
    if (history.length > 0) {
        badge.textContent = history.length;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function toggleHistoryModal() {
    const modal = document.getElementById('historyModal');
    if (!modal) return;
    const isHidden = modal.style.display === 'none';
    modal.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) renderDownloadHistory();
}

function closeHistoryModalOnBackdrop(e) {
    if (e.target.id === 'historyModal') toggleHistoryModal();
}

function clearDownloadHistory() {
    localStorage.removeItem('exams_download_history');
    updateHistoryBadge();
    renderDownloadHistory();
    showToast('Download history cleared', 'info');
}

function renderDownloadHistory() {
    const body = document.getElementById('historyModalBody');
    if (!body) return;
    const history = getDownloadHistory();
    if (history.length === 0) {
        body.innerHTML = '<p class="placeholder-text" style="text-align:center; padding: 20px;"><i class="fa-solid fa-clock-rotate-left"></i> No download history recorded yet.</p>';
        return;
    }
    body.innerHTML = history.map(item => `
        <div class="history-item-card">
            <div class="history-item-info">
                <img src="${item.dataUrl}" alt="${item.filename}" class="history-thumb" />
                <div class="history-details">
                    <strong>${item.filename}</strong>
                    <span><i class="fa-solid fa-clock"></i> ${item.timestamp}</span>
                </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="triggerDownload('${item.dataUrl}', '${item.filename}')">
                <i class="fa-solid fa-download"></i> Save Again
            </button>
        </div>
    `).join('');
}

function resetEntireWorkspace() {
    document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
    
    Object.keys(state.images).forEach(key => {
        state.images[key] = { original: null, file: null, zoom: 1, rotation: 0, canvas: null, dataUrl: null, sizeKb: 0, processedUrl: null };
    });

    checkWorkspacePanels();

    ['compControlPanel', 'compMeter', 'compActionBar', 'resizeControlPanel', 'resizeActionBar', 
     'convControlPanel', 'convActionBar', 'cropControlPanel', 'cropActionBar', 
     'upscaleControlPanel', 'upscaleActionBar', 'upscaleInfoMeter', 'bgControlPanel', 'bgActionBar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const stages = {
        bgPreviewStage: '<span class="placeholder-text"><i class="fa-solid fa-wand-magic-sparkles"></i> Processed image preview will appear here</span>',
        compPreviewStage: '<span class="placeholder-text"><i class="fa-solid fa-file-zipper"></i> Compressed image preview will appear here</span>',
        resizePreviewStage: '<span class="placeholder-text"><i class="fa-solid fa-expand"></i> Resized preview will appear here</span>',
        convPreviewStage: '<span class="placeholder-text"><i class="fa-solid fa-file-image"></i> Converted image preview will appear here</span>',
        cropPreviewStage: '<span class="placeholder-text"><i class="fa-solid fa-crop"></i> Cropped preview will appear here</span>',
        upscalePreviewStage: '<span class="placeholder-text"><i class="fa-solid fa-expand"></i> 4K Upscaled image preview will appear here</span>'
    };
    Object.entries(stages).forEach(([id, html]) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    });

    showToast('Workspace reset successfully! All images cleared.', 'success');
}

function updateStagePreview(stageId, toolKey, originalSrc, processedSrc) {
    const stage = document.getElementById(stageId);
    if (!stage) return;
    const mode = (state.previewModes && state.previewModes[toolKey]) || 'after';

    if (mode === 'before' && originalSrc) {
        stage.innerHTML = `<img src="${originalSrc}" alt="Before Original" style="max-height: 240px; object-fit: contain;">`;
    } else if (mode === 'compare' && originalSrc && processedSrc) {
        stage.innerHTML = `
            <div class="compare-grid">
                <div class="compare-box"><span>Before</span><img src="${originalSrc}" alt="Original"></div>
                <div class="compare-box"><span>After</span><img src="${processedSrc}" alt="Processed"></div>
            </div>
        `;
    } else if (processedSrc) {
        stage.innerHTML = `<img src="${processedSrc}" alt="Processed Result" style="max-height: 240px; object-fit: contain;">`;
    } else if (originalSrc) {
        stage.innerHTML = `<img src="${originalSrc}" alt="Original" style="max-height: 240px; object-fit: contain;">`;
    }
}

function setPreviewView(toolKey, mode) {
    if (!state.previewModes) state.previewModes = {};
    state.previewModes[toolKey] = mode;
    
    const modeNav = document.getElementById(`${toolKey}PreviewMode`);
    if (modeNav) {
        modeNav.querySelectorAll('.pill-sm').forEach(pill => {
            pill.classList.toggle('active', pill.dataset.mode === mode);
        });
    }

    if (toolKey === 'photo') processCanvas('photo');
    else if (toolKey === 'signature') processCanvas('signature');
    else if (toolKey === 'bg') processBgRemoval();
    else if (toolKey === 'comp') processCompressorTool();
    else if (toolKey === 'resize') processResizeTool();
    else if (toolKey === 'conv') processFormatConversion();
    else if (toolKey === 'crop') processCropImage();
    else if (toolKey === 'upscale') processUpscalerTool();
}

// ==========================================
// INTERNATIONALIZATION (i18n) MULTI-LANGUAGE ENGINE
// Supports: English, Hindi, Nepali, Bengali, Tamil, Telugu, Spanish, French, Arabic
// ==========================================

const i18nDict = {
    en: {
        reset: "Reset",
        reviews: "Reviews (4.9⭐)",
        specsGuide: "Specs Guide",
        tabExamStudio: "Exam Resizer Studio",
        tabBgRemover: "BG Remover",
        tabCompressor: "Image Compressor",
        tabResizer: "Resize Images",
        tabConverter: "PNG ↔ JPG",
        tabCropper: "Crop Images",
        tabPdfToImage: "PDF to Image",
        tabUpscaler: "4K Upscaler",
        step1Label: "Step 1: Select Target Competitive Exam"
    },
    hi: {
        reset: "रीसेट",
        reviews: "समीक्षाएं (4.9⭐)",
        specsGuide: "गाइड",
        tabExamStudio: "परीक्षा रिसाइज़र स्टूडियो",
        tabBgRemover: "बैकग्राउंड रिमूवर",
        tabCompressor: "इमेज कंप्रेसर",
        tabResizer: "इमेज रीसाइज़ करें",
        tabConverter: "PNG ↔ JPG",
        tabCropper: "इमेज क्रॉप करें",
        tabPdfToImage: "पीडीएफ से इमेज",
        tabUpscaler: "4K अपस्केलर",
        step1Label: "चरण 1: लक्ष्य परीक्षा चुनें"
    },
    ne: {
        reset: "रिसेट",
        reviews: "समीक्षाहरू (4.9⭐)",
        specsGuide: "गाइड",
        tabExamStudio: "परीक्षा स्टुडियो",
        tabBgRemover: "ब्याकग्राउन्ड रिमूभर",
        tabCompressor: "इमेज कम्प्रेसर",
        tabResizer: "साइज बढाउनुहोस्/घटाउनुहोस्",
        tabConverter: "PNG ↔ JPG",
        tabCropper: "इमेज क्रप गर्नुहोस्",
        tabPdfToImage: "पीडीएफ बाट फोटो",
        tabUpscaler: "4K अपस्केलर",
        step1Label: "चरण १: लक्ष्य परीक्षा छान्नुहोस्"
    },
    bn: {
        reset: "রিসেট",
        reviews: "রিভিউ (4.9⭐)",
        specsGuide: "গাইড",
        tabExamStudio: "পরীক্ষা স্টুডিও",
        tabBgRemover: "ব্যাকগ্রাউন্ড রিমুভার",
        tabCompressor: "ইমেজ কমপ্রেসর",
        tabResizer: "রিসাইজ করুন",
        tabConverter: "PNG ↔ JPG",
        tabCropper: "ক্রপ করুন",
        tabPdfToImage: "পিডিএফ থেকে ছবি",
        tabUpscaler: "4K আপস্কেলার",
        step1Label: "ধাপ ১: পরীক্ষা নির্বাচন করুন"
    },
    ta: {
        reset: "மீட்டமை",
        reviews: "மதிப்புரைகள் (4.9⭐)",
        specsGuide: "வழிகாட்டி",
        tabExamStudio: "தேர்வு ஸ்டுடியோ",
        tabBgRemover: "பின்புலம் நீக்கி",
        tabCompressor: "அளவு குறைப்பி",
        tabResizer: "அளவு மாற்றி",
        tabConverter: "PNG ↔ JPG",
        tabCropper: "பயிர் செய்",
        tabPdfToImage: "PDF to Image",
        tabUpscaler: "4K அப்ஸ்கேலர்",
        step1Label: "படி 1: தேர்வை தேர்ந்தெடுக்கவும்"
    },
    te: {
        reset: "రీసెట్",
        reviews: "సమీక్షలు (4.9⭐)",
        specsGuide: "గైడ్",
        tabExamStudio: "పరీక్ష స్టూడియో",
        tabBgRemover: "BG రిమూవర్",
        tabCompressor: "ఇమేజ్ కంప్రెసర్",
        tabResizer: "రీసైజ్ చేయండి",
        tabConverter: "PNG ↔ JPG",
        tabCropper: "క్రాప్ చేయండి",
        tabPdfToImage: "PDF నుండి ఇమేజ్",
        tabUpscaler: "4K అప్‌స్కేలర్",
        step1Label: "దశ 1: పరీక్షను ఎంచుకోండి"
    },
    es: {
        reset: "Restablecer",
        reviews: "Reseñas (4.9⭐)",
        specsGuide: "Guía de Especificaciones",
        tabExamStudio: "Estudio de Examen",
        tabBgRemover: "Quitar Fondo",
        tabCompressor: "Compresor de Imagen",
        tabResizer: "Redimensionar",
        tabConverter: "PNG ↔ JPG",
        tabCropper: "Recortar Imagen",
        tabPdfToImage: "PDF a Imagen",
        tabUpscaler: "Escalador 4K",
        step1Label: "Paso 1: Seleccionar Examen Objetivo"
    },
    fr: {
        reset: "Réinitialiser",
        reviews: "Avis (4.9⭐)",
        specsGuide: "Guide des Spécifications",
        tabExamStudio: "Studio Examen",
        tabBgRemover: "Effacer Fond",
        tabCompressor: "Compresseur d'Image",
        tabResizer: "Redimensionner",
        tabConverter: "PNG ↔ JPG",
        tabCropper: "Rogner L'Image",
        tabPdfToImage: "PDF en Image",
        tabUpscaler: "Agrandir en 4K",
        step1Label: "Étape 1: Sélectionner L'Examen Cible"
    },
    ar: {
        reset: "إعادة ضبط",
        reviews: "التقييمات (4.9⭐)",
        specsGuide: "دليل المواصفات",
        tabExamStudio: "استوديو الامتحانات",
        tabBgRemover: "إزالة الخلفية",
        tabCompressor: "ضغط الصور",
        tabResizer: "تغيير الحجم",
        tabConverter: "PNG ↔ JPG",
        tabCropper: "قص الصور",
        tabPdfToImage: "تحويل PDF لصور",
        tabUpscaler: "مكبر 4K",
        step1Label: "الخطوة 1: اختر الامتحان المستهدف"
    }
};

function changeLanguage(langCode) {
    state.currentLanguage = langCode;
    localStorage.setItem('user_preferred_lang', langCode);

    if (langCode === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl-mode');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl-mode');
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18nDict[langCode] && i18nDict[langCode][key]) {
            el.textContent = i18nDict[langCode][key];
        } else if (i18nDict.en[key]) {
            el.textContent = i18nDict.en[key];
        }
    });

    const select = document.getElementById('languageSelect');
    if (select) select.value = langCode;

    showToast(`Language updated to ${select ? select.options[select.selectedIndex].text : langCode}`, 'success');
}

function initLanguage() {
    const savedLang = localStorage.getItem('user_preferred_lang') || 'en';
    changeLanguage(savedLang);
}
