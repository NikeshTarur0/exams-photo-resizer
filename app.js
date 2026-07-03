/**
 * Indian Exam Photo Resizer & All-in-One Image Utility Suite
 * Client-Side Engine & Application Logic
 */

// Application State
const state = {
    exams: [],
    selectedExam: null,
    activeCategory: 'all',
    activeTab: 'photo', // 'photo' or 'signature'
    currentMainTool: 'exam-studio',
    images: {
        photo: { original: null, file: null, zoom: 1, rotation: 0, canvas: null, dataUrl: null, sizeKb: 0 },
        signature: { original: null, file: null, zoom: 1, rotation: 0, canvas: null, dataUrl: null, sizeKb: 0 },
        bg: { original: null, file: null, processedUrl: null },
        comp: { original: null, file: null, processedUrl: null, sizeKb: 0 },
        resize: { original: null, file: null, processedUrl: null, width: 800, height: 600 },
        conv: { original: null, file: null, processedUrl: null, format: 'image/jpeg' },
        crop: { original: null, file: null, processedUrl: null, ratio: '1:1' }
    }
};

// Built-in JavaScript Exam Standards Fallback
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
    setupUtilityToolDropzones();
});

// Suite Navigation Tool Switching
function switchMainTool(toolId) {
    state.currentMainTool = toolId;
    document.querySelectorAll('.suite-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tool === toolId);
    });
    document.querySelectorAll('.tool-view').forEach(view => {
        view.style.display = view.id === `view-${toolId}` ? 'block' : 'none';
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
    document.getElementById('examSelect').addEventListener('change', (e) => selectExam(e.target.value));

    document.querySelectorAll('#categoryPills .pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('#categoryPills .pill').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            state.activeCategory = e.target.dataset.cat;
            populateDropdown();
        });
    });

    setupDropzone('photoDropzone', 'photoFileInput', 'photo');
    setupDropzone('sigDropzone', 'sigFileInput', 'signature');

    document.getElementById('photoZoomRange').addEventListener('input', (e) => {
        state.images.photo.zoom = parseFloat(e.target.value);
        processCanvas('photo');
    });

    document.getElementById('sigZoomRange').addEventListener('input', (e) => {
        state.images.signature.zoom = parseFloat(e.target.value);
        processCanvas('signature');
    });

    document.getElementById('downloadPhotoBtn').addEventListener('click', () => downloadImage('photo'));
    document.getElementById('downloadSigBtn').addEventListener('click', () => downloadImage('signature'));

    document.getElementById('serverFallbackPhotoBtn').addEventListener('click', () => triggerServerFallback('photo'));
    document.getElementById('serverFallbackSigBtn').addEventListener('click', () => triggerServerFallback('signature'));
}

// Setup Utility Tool Dropzones
function setupUtilityToolDropzones() {
    setupGenericToolDropzone('bgDropzone', 'bgFileInput', 'bg', handleBgUpload);
    setupGenericToolDropzone('compDropzone', 'compFileInput', 'comp', handleCompUpload);
    setupGenericToolDropzone('resizeDropzone', 'resizeFileInput', 'resize', handleResizeUpload);
    setupGenericToolDropzone('convDropzone', 'convFileInput', 'conv', handleConvUpload);
    setupGenericToolDropzone('cropDropzone', 'cropFileInput', 'crop', handleCropUpload);
    setupGenericToolDropzone('pdfDropzone', 'pdfFileInput', 'pdf', handlePdfUpload);

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

    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) callback(e.dataTransfer.files[0]);
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
}

// Drag & Drop Handling for Exam Studio
function setupDropzone(dropzoneId, fileInputId, type) {
    const dropzone = document.getElementById(dropzoneId);
    const fileInput = document.getElementById(fileInputId);

    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0], type);
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

    const stageId = type === 'photo' ? 'photoPreviewStage' : 'sigPreviewStage';
    document.getElementById(stageId).innerHTML = `<img src="${bestDataUrl}" alt="Resized ${type} Preview">`;
    updateComplianceMeter(type, bestSizeKb, req.min_kb, req.max_kb);
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

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const threshold = parseInt(document.getElementById('bgThreshold').value) || 45;
    const bgType = document.getElementById('bgTypeSelect').value;

    // Sample corner pixel for background color
    const cornerR = data[0], cornerG = data[1], cornerB = data[2];

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const diff = Math.abs(r - cornerR) + Math.abs(g - cornerG) + Math.abs(b - cornerB);

        if (diff < threshold * 3 || (r > 200 && g > 200 && b > 200)) {
            if (bgType === 'white') {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; data[i + 3] = 255;
            } else {
                data[i + 3] = 0; // Transparent
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
    const format = bgType === 'transparent' ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(format, 0.95);
    state.images.bg.processedUrl = dataUrl;

    document.getElementById('bgPreviewStage').innerHTML = `<img src="${dataUrl}" alt="BG Removed">`;
    showToast('Background processed successfully!', 'success');
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

    document.getElementById('compPreviewStage').innerHTML = `<img src="${bestUrl}" alt="Compressed">`;
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

    document.getElementById('resizePreviewStage').innerHTML = `<img src="${dataUrl}" alt="Resized">`;
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

    document.getElementById('convPreviewStage').innerHTML = `<img src="${dataUrl}" alt="Converted">`;
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

    document.getElementById('cropPreviewStage').innerHTML = `<img src="${dataUrl}" alt="Cropped">`;
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

function downloadPdfPage(dataUrl, pageNum) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `PDF_Page_${pageNum}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded Page ${pageNum} as JPG`, 'success');
}

// Download Helper for Utility Tools
function downloadToolOutput(toolKey) {
    const url = state.images[toolKey] ? state.images[toolKey].processedUrl : null;
    if (!url) {
        showToast('No processed file ready for download', 'error');
        return;
    }

    const ext = (toolKey === 'conv' && state.images.conv.format === 'image/png') ? 'png' : 'jpg';
    const a = document.createElement('a');
    a.href = url;
    a.download = `Processed_${toolKey.toUpperCase()}_Image.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded Processed_${toolKey.toUpperCase()}_Image.${ext}`, 'success');
}

// Estimate Base64 KB
function estimateBase64SizeKb(base64String) {
    const stringLength = base64String.length - 'data:image/jpeg;base64,'.length;
    return Math.round(((stringLength * 0.75) / 1024) * 100) / 100;
}

// Update Compliance Meter UI (Exam Studio)
function updateComplianceMeter(type, currentKb, minKb, maxKb) {
    document.getElementById(type === 'photo' ? 'photoCurrentSize' : 'sigCurrentSize').textContent = `${currentKb} KB`;
    document.getElementById(type === 'photo' ? 'photoTargetRangeText' : 'sigTargetRangeText').textContent = `${minKb} KB - ${maxKb} KB`;

    const isCompliant = currentKb >= minKb && currentKb <= maxKb;
    const badge = document.getElementById(type === 'photo' ? 'photoStatusBadge' : 'sigStatusBadge');

    if (isCompliant) {
        badge.className = 'status-badge status-valid';
        badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Compliant';
    } else {
        badge.className = 'status-badge status-invalid';
        badge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Out of Bounds';
    }

    const pct = Math.min(100, Math.max(10, (currentKb / maxKb) * 100));
    const fill = document.getElementById(type === 'photo' ? 'photoSizeProgress' : 'sigSizeProgress');
    fill.style.width = `${pct}%`;
    fill.style.background = isCompliant ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #ef4444, #f59e0b)';
}

function rotateImage(type, deg) {
    state.images[type].rotation = (state.images[type].rotation + deg) % 360;
    processCanvas(type);
}

function resetControls(type) {
    state.images[type].zoom = 1;
    state.images[type].rotation = 0;
    document.getElementById(type === 'photo' ? 'photoZoomRange' : 'sigZoomRange').value = 1;
    processCanvas(type);
}

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
