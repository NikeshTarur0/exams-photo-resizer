<?php
/**
 * Database Connection & Configuration File
 * Indian Exam Photo & Signature Resizer
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_host = '127.0.0.1';
$db_user = 'root';
$db_pass = '';
$db_name = 'indian_exam_resizer';
$db_port = 3306;

function getDBConnection() {
    global $db_host, $db_user, $db_pass, $db_name, $db_port;
    try {
        $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
        $pdo = new PDO($dsn, $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // Return null if MySQL server is not running; fallback system will kick in
        return null;
    }
}

/**
 * Fallback In-Memory Exam Requirement Standards
 * Ensures API & UI function perfectly out-of-the-box even without active MySQL database setup.
 */
function getFallbackExamsData() {
    return [
        [
            "id" => 1, "code" => "ssc_cgl", "name" => "SSC Combined Graduate Level (CGL)", "conducting_body" => "Staff Selection Commission", "category" => "Government Job", "country" => "India", "official_url" => "https://ssc.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 450, "min_height_px" => 450, "max_height_px" => 550, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "Light / White Background", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Recent photograph without cap/glasses. Both ears clearly visible."],
                "signature" => ["min_width_px" => 280, "max_width_px" => 400, "min_height_px" => 140, "max_height_px" => 200, "target_width" => 280, "target_height" => 140, "aspect_ratio" => "4.0:2.0", "min_kb" => 10, "max_kb" => 20, "bg_color" => "White paper with Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Running hand in black ink."]
            ]
        ],
        [
            "id" => 2, "code" => "ssc_chsl", "name" => "SSC Combined Higher Secondary Level (CHSL)", "conducting_body" => "Staff Selection Commission", "category" => "Government Job", "country" => "India", "official_url" => "https://ssc.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 450, "min_height_px" => 450, "max_height_px" => 550, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "Plain light background", "allowed_formats" => "JPG, JPEG", "dpi" => 200],
                "signature" => ["min_width_px" => 280, "max_width_px" => 400, "min_height_px" => 140, "max_height_px" => 200, "target_width" => 280, "target_height" => 140, "aspect_ratio" => "4.0:2.0", "min_kb" => 10, "max_kb" => 20, "bg_color" => "White paper", "allowed_formats" => "JPG, JPEG", "dpi" => 200]
            ]
        ],
        [
            "id" => 3, "code" => "ssc_gd", "name" => "SSC GD Constable Exam", "conducting_body" => "Staff Selection Commission", "category" => "Government Job", "country" => "India", "official_url" => "https://ssc.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 450, "min_height_px" => 450, "max_height_px" => 550, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "Light background with date", "allowed_formats" => "JPG, JPEG", "dpi" => 200],
                "signature" => ["min_width_px" => 280, "max_width_px" => 400, "min_height_px" => 140, "max_height_px" => 200, "target_width" => 280, "target_height" => 140, "aspect_ratio" => "4.0:2.0", "min_kb" => 10, "max_kb" => 20, "bg_color" => "Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200]
            ]
        ],
        [
            "id" => 4, "code" => "upsc_cse", "name" => "UPSC Civil Services Examination (IAS/IPS)", "conducting_body" => "Union Public Service Commission", "category" => "Civil Services", "country" => "India", "official_url" => "https://upsc.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 1000, "min_height_px" => 350, "max_height_px" => 1000, "target_width" => 500, "target_height" => 500, "aspect_ratio" => "1:1", "min_kb" => 20, "max_kb" => 300, "bg_color" => "White / Plain background", "allowed_formats" => "JPG, JPEG", "dpi" => 300],
                "signature" => ["min_width_px" => 350, "max_width_px" => 1000, "min_height_px" => 350, "max_height_px" => 1000, "target_width" => 500, "target_height" => 500, "aspect_ratio" => "1:1", "min_kb" => 20, "max_kb" => 300, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 300]
            ]
        ],
        [
            "id" => 5, "code" => "ibps_po", "name" => "IBPS Probationary Officer (PO / Clerk)", "conducting_body" => "Institute of Banking Personnel Selection", "category" => "Banking", "country" => "India", "official_url" => "https://ibps.in",
            "requirements" => [
                "photo" => ["min_width_px" => 200, "max_width_px" => 250, "min_height_px" => 230, "max_height_px" => 270, "target_width" => 200, "target_height" => 230, "aspect_ratio" => "4.5:3.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "Light colored", "allowed_formats" => "JPG, JPEG", "dpi" => 200],
                "signature" => ["min_width_px" => 140, "max_width_px" => 200, "min_height_px" => 60, "max_height_px" => 100, "target_width" => 140, "target_height" => 60, "aspect_ratio" => "2.3:1", "min_kb" => 10, "max_kb" => 20, "bg_color" => "White paper with Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200]
            ]
        ],
        [
            "id" => 6, "code" => "sbi_po", "name" => "SBI PO & Junior Associate Clerk", "conducting_body" => "State Bank of India", "category" => "Banking", "country" => "India", "official_url" => "https://sbi.co.in",
            "requirements" => [
                "photo" => ["min_width_px" => 200, "max_width_px" => 250, "min_height_px" => 230, "max_height_px" => 270, "target_width" => 200, "target_height" => 230, "aspect_ratio" => "4.5:3.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "Light background", "allowed_formats" => "JPG, JPEG", "dpi" => 200],
                "signature" => ["min_width_px" => 140, "max_width_px" => 200, "min_height_px" => 60, "max_height_px" => 100, "target_width" => 140, "target_height" => 60, "aspect_ratio" => "2.3:1", "min_kb" => 10, "max_kb" => 20, "bg_color" => "Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200]
            ]
        ],
        [
            "id" => 7, "code" => "rrb_ntpc", "name" => "Railway RRB NTPC & Group D Recruitment", "conducting_body" => "Railway Recruitment Control Board", "category" => "Government Job", "country" => "India", "official_url" => "https://indianrailways.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 320, "max_width_px" => 400, "min_height_px" => 400, "max_height_px" => 500, "target_width" => 320, "target_height" => 400, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 200],
                "signature" => ["min_width_px" => 250, "max_width_px" => 350, "min_height_px" => 100, "max_height_px" => 150, "target_width" => 250, "target_height" => 100, "aspect_ratio" => "2.5:1.0", "min_kb" => 10, "max_kb" => 20, "bg_color" => "Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200]
            ]
        ],
        [
            "id" => 8, "code" => "nta_neet", "name" => "NTA NEET (UG) Medical Entrance", "conducting_body" => "National Testing Agency", "category" => "Medical Entrance", "country" => "India", "official_url" => "https://neet.nta.nic.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 600, "min_height_px" => 450, "max_height_px" => 800, "target_width" => 400, "target_height" => 520, "aspect_ratio" => "3.5:4.5", "min_kb" => 10, "max_kb" => 200, "bg_color" => "White background (80% face)", "allowed_formats" => "JPG, JPEG", "dpi" => 300],
                "signature" => ["min_width_px" => 280, "max_width_px" => 500, "min_height_px" => 100, "max_height_px" => 250, "target_width" => 350, "target_height" => 150, "aspect_ratio" => "3.5:1.5", "min_kb" => 4, "max_kb" => 30, "bg_color" => "White sheet with Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 300]
            ]
        ],
        [
            "id" => 9, "code" => "nta_jee", "name" => "NTA JEE Main Engineering Entrance", "conducting_body" => "National Testing Agency", "category" => "Engineering Entrance", "country" => "India", "official_url" => "https://jeemain.nta.ac.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 600, "min_height_px" => 450, "max_height_px" => 800, "target_width" => 400, "target_height" => 520, "aspect_ratio" => "3.5:4.5", "min_kb" => 10, "max_kb" => 200, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 300],
                "signature" => ["min_width_px" => 280, "max_width_px" => 500, "min_height_px" => 100, "max_height_px" => 250, "target_width" => 350, "target_height" => 150, "aspect_ratio" => "3.5:1.5", "min_kb" => 4, "max_kb" => 30, "bg_color" => "White sheet with Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 300]
            ]
        ],
        [
            "id" => 10, "code" => "gate_exam", "name" => "GATE Engineering Entrance (IITs)", "conducting_body" => "Indian Institutes of Technology", "category" => "Engineering Entrance", "country" => "India", "official_url" => "https://gate.iitkgp.ac.in",
            "requirements" => [
                "photo" => ["min_width_px" => 240, "max_width_px" => 520, "min_height_px" => 320, "max_height_px" => 680, "target_width" => 350, "target_height" => 460, "aspect_ratio" => "3.5:4.5", "min_kb" => 5, "max_kb" => 200, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 200],
                "signature" => ["min_width_px" => 280, "max_width_px" => 560, "min_height_px" => 80, "max_height_px" => 160, "target_width" => 280, "target_height" => 100, "aspect_ratio" => "2.8:1", "min_kb" => 5, "max_kb" => 200, "bg_color" => "Dark blue or black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200]
            ]
        ],
        [
            "id" => 11, "code" => "cat_exam", "name" => "CAT Management Entrance (IIMs)", "conducting_body" => "Indian Institutes of Management", "category" => "Management Entrance", "country" => "India", "official_url" => "https://iimcat.ac.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 500, "min_height_px" => 450, "max_height_px" => 600, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 80, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 200],
                "signature" => ["min_width_px" => 280, "max_width_px" => 400, "min_height_px" => 100, "max_height_px" => 150, "target_width" => 280, "target_height" => 100, "aspect_ratio" => "2.8:1", "min_kb" => 20, "max_kb" => 80, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 200]
            ]
        ],
        [
            "id" => 12, "code" => "cuet_ug", "name" => "NTA CUET (UG & PG) Entrance Exam", "conducting_body" => "National Testing Agency", "category" => "University Entrance", "country" => "India", "official_url" => "https://cuet.samarth.ac.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 600, "min_height_px" => 450, "max_height_px" => 800, "target_width" => 400, "target_height" => 520, "aspect_ratio" => "3.5:4.5", "min_kb" => 10, "max_kb" => 200, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 300],
                "signature" => ["min_width_px" => 280, "max_width_px" => 500, "min_height_px" => 100, "max_height_px" => 250, "target_width" => 350, "target_height" => 150, "aspect_ratio" => "3.5:1.5", "min_kb" => 4, "max_kb" => 30, "bg_color" => "Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 300]
            ]
        ],
        [
            "id" => 13, "code" => "afcat", "name" => "AFCAT & CDS Defence Exam", "conducting_body" => "Indian Air Force / UPSC", "category" => "Defence Exam", "country" => "India", "official_url" => "https://afcat.cdac.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 500, "min_height_px" => 450, "max_height_px" => 600, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 10, "max_kb" => 50, "bg_color" => "Light background", "allowed_formats" => "JPG, JPEG", "dpi" => 200],
                "signature" => ["min_width_px" => 280, "max_width_px" => 400, "min_height_px" => 100, "max_height_px" => 150, "target_width" => 280, "target_height" => 100, "aspect_ratio" => "2.8:1", "min_kb" => 10, "max_kb" => 50, "bg_color" => "White paper", "allowed_formats" => "JPG, JPEG", "dpi" => 200]
            ]
        ],
        [
            "id" => 20, "code" => "gujarat_police", "name" => "Gujarat Police Recruitment", "conducting_body" => "Lokrakshak Recruitment Board (LRB)", "category" => "Defence Exam", "country" => "India", "official_url" => "https://ojas.gujarat.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 200, "max_width_px" => 200, "min_height_px" => 250, "max_height_px" => 250, "target_width" => 200, "target_height" => 250, "aspect_ratio" => "4:5", "min_kb" => 15, "max_kb" => 50, "bg_color" => "White or light background", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Recent passport size photo. Both ears visible."],
                "signature" => ["min_width_px" => 140, "max_width_px" => 140, "min_height_px" => 80, "max_height_px" => 80, "target_width" => 140, "target_height" => 80, "aspect_ratio" => "7:4", "min_kb" => 5, "max_kb" => 20, "bg_color" => "White paper with black/blue ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Running hand signature."]
            ]
        ],
        [
            "id" => 21, "code" => "gpssb", "name" => "GPSSB Panchayat Recruitment", "conducting_body" => "Gujarat Panchayat Service Selection Board", "category" => "Government Job", "country" => "India", "official_url" => "https://gpssb.gujarat.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 130, "max_width_px" => 150, "min_height_px" => 180, "max_height_px" => 200, "target_width" => 130, "target_height" => 180, "aspect_ratio" => "3.6:5.0", "min_kb" => 5, "max_kb" => 15, "bg_color" => "Light background", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "OJAS standard photo max 15KB."],
                "signature" => ["min_width_px" => 275, "max_width_px" => 300, "min_height_px" => 90, "max_height_px" => 100, "target_width" => 275, "target_height" => 90, "aspect_ratio" => "3:1", "min_kb" => 5, "max_kb" => 15, "bg_color" => "White paper with black/blue ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "OJAS standard signature max 15KB."]
            ]
        ],
        [
            "id" => 22, "code" => "gpsc", "name" => "GPSC Gujarat Civil Services", "conducting_body" => "Gujarat Public Service Commission", "category" => "Civil Services", "country" => "India", "official_url" => "https://gpsc.gujarat.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 130, "max_width_px" => 150, "min_height_px" => 180, "max_height_px" => 200, "target_width" => 130, "target_height" => 180, "aspect_ratio" => "3.6:5.0", "min_kb" => 5, "max_kb" => 15, "bg_color" => "Light background", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "OJAS standard photo max 15KB."],
                "signature" => ["min_width_px" => 275, "max_width_px" => 300, "min_height_px" => 90, "max_height_px" => 100, "target_width" => 275, "target_height" => 90, "aspect_ratio" => "3:1", "min_kb" => 5, "max_kb" => 15, "bg_color" => "White paper with black/blue ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "OJAS standard signature max 15KB."]
            ]
        ],
        [
            "id" => 23, "code" => "indian_army", "name" => "Indian Army Agnipath Recruitment", "conducting_body" => "Indian Army", "category" => "Defence Exam", "country" => "India", "official_url" => "https://joinindianarmy.nic.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 350, "min_height_px" => 450, "max_height_px" => 450, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Recent photo without cap/glasses."],
                "signature" => ["min_width_px" => 350, "max_width_px" => 350, "min_height_px" => 150, "max_height_px" => 150, "target_width" => 350, "target_height" => 150, "aspect_ratio" => "7:3", "min_kb" => 10, "max_kb" => 20, "bg_color" => "White paper with black/blue ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Legible running signature."]
            ]
        ],
        [
            "id" => 24, "code" => "crpf", "name" => "CRPF Head Constable & GD Recruitment", "conducting_body" => "Central Reserve Police Force", "category" => "Defence Exam", "country" => "India", "official_url" => "https://crpf.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 350, "min_height_px" => 450, "max_height_px" => 450, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "Light background", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Color passport photo, both ears visible."],
                "signature" => ["min_width_px" => 400, "max_width_px" => 400, "min_height_px" => 200, "max_height_px" => 200, "target_width" => 400, "target_height" => 200, "aspect_ratio" => "2:1", "min_kb" => 10, "max_kb" => 20, "bg_color" => "White paper with black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Signed in running hand."]
            ]
        ],
        [
            "id" => 25, "code" => "cisf", "name" => "CISF Constable & ASI Recruitment", "conducting_body" => "Central Industrial Security Force", "category" => "Defence Exam", "country" => "India", "official_url" => "https://cisfrectt.cisf.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 350, "min_height_px" => 450, "max_height_px" => 450, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Must have name and date of photo printed at bottom."],
                "signature" => ["min_width_px" => 400, "max_width_px" => 400, "min_height_px" => 200, "max_height_px" => 200, "target_width" => 400, "target_height" => 200, "aspect_ratio" => "2:1", "min_kb" => 10, "max_kb" => 20, "bg_color" => "White paper with black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Running hand signature in black ink."]
            ]
        ],
        [
            "id" => 26, "code" => "bsf", "name" => "BSF Constable GD & Head Constable", "conducting_body" => "Border Security Force", "category" => "Defence Exam", "country" => "India", "official_url" => "https://rectt.bsf.gov.in",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 350, "min_height_px" => 450, "max_height_px" => 450, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Recent colored passport photo."],
                "signature" => ["min_width_px" => 400, "max_width_px" => 400, "min_height_px" => 200, "max_height_px" => 200, "target_width" => 400, "target_height" => 200, "aspect_ratio" => "2:1", "min_kb" => 10, "max_kb" => 20, "bg_color" => "White paper with black/blue ink", "allowed_formats" => "JPG, JPEG", "dpi" => 200, "special_instructions" => "Running hand signature."]
            ]
        ],
        [
            "id" => 14, "code" => "nepal_psc", "name" => "Nepal Lok Sewa Aayog (Public Service Commission Nepal)", "conducting_body" => "Lok Sewa Aayog Nepal 🇳🇵", "category" => "Government Job", "country" => "Nepal", "official_url" => "https://psc.gov.np",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 450, "min_height_px" => 450, "max_height_px" => 550, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 200, "bg_color" => "Plain white background (PP size)", "allowed_formats" => "JPG, JPEG", "dpi" => 300],
                "signature" => ["min_width_px" => 300, "max_width_px" => 500, "min_height_px" => 150, "max_height_px" => 250, "target_width" => 300, "target_height" => 150, "aspect_ratio" => "2:1", "min_kb" => 10, "max_kb" => 100, "bg_color" => "Black ink on white paper", "allowed_formats" => "JPG, JPEG", "dpi" => 300]
            ]
        ],
        [
            "id" => 15, "code" => "nepal_mecee", "name" => "Nepal MECEE Medical Entrance Exam", "conducting_body" => "Medical Education Commission Nepal 🇳🇵", "category" => "Medical Entrance", "country" => "Nepal", "official_url" => "https://mec.gov.np",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 450, "min_height_px" => 450, "max_height_px" => 550, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 200, "bg_color" => "White background (MRP specs)", "allowed_formats" => "JPG, JPEG", "dpi" => 300],
                "signature" => ["min_width_px" => 300, "max_width_px" => 450, "min_height_px" => 150, "max_height_px" => 200, "target_width" => 300, "target_height" => 150, "aspect_ratio" => "2:1", "min_kb" => 10, "max_kb" => 50, "bg_color" => "Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 300]
            ]
        ],
        [
            "id" => 16, "code" => "nepal_ioe", "name" => "Nepal IOE Engineering Entrance (Tribhuvan University)", "conducting_body" => "Institute of Engineering Nepal 🇳🇵", "category" => "Engineering Entrance", "country" => "Nepal", "official_url" => "https://ioe.edu.np",
            "requirements" => [
                "photo" => ["min_width_px" => 300, "max_width_px" => 400, "min_height_px" => 360, "max_height_px" => 480, "target_width" => 300, "target_height" => 360, "aspect_ratio" => "3:3.6", "min_kb" => 10, "max_kb" => 50, "bg_color" => "Light background", "allowed_formats" => "JPG, JPEG", "dpi" => 200],
                "signature" => ["min_width_px" => 300, "max_width_px" => 400, "min_height_px" => 150, "max_height_px" => 200, "target_width" => 300, "target_height" => 150, "aspect_ratio" => "2:1", "min_kb" => 5, "max_kb" => 20, "bg_color" => "Black ink on white paper", "allowed_formats" => "JPG, JPEG", "dpi" => 200]
            ]
        ],
        [
            "id" => 17, "code" => "nepal_eps_topik", "name" => "Nepal EPS-TOPIK (Korea Work Visa Exam)", "conducting_body" => "HRD Korea / Ministry of Labour Nepal 🇳🇵", "category" => "Government Job", "country" => "Nepal", "official_url" => "https://epsnepal.gov.np",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 600, "min_height_px" => 450, "max_height_px" => 600, "target_width" => 600, "target_height" => 600, "aspect_ratio" => "1:1", "min_kb" => 10, "max_kb" => 100, "bg_color" => "White background", "allowed_formats" => "JPG, JPEG", "dpi" => 300],
                "signature" => ["min_width_px" => 300, "max_width_px" => 500, "min_height_px" => 150, "max_height_px" => 250, "target_width" => 300, "target_height" => 150, "aspect_ratio" => "2:1", "min_kb" => 5, "max_kb" => 50, "bg_color" => "White paper", "allowed_formats" => "JPG, JPEG", "dpi" => 300]
            ]
        ],
        [
            "id" => 18, "code" => "usa_dv_lottery", "name" => "US Green Card DV Lottery & US Visa Photo 🇺🇸", "conducting_body" => "US Department of State", "category" => "Global Visa", "country" => "USA", "official_url" => "https://dvprogram.state.gov",
            "requirements" => [
                "photo" => ["min_width_px" => 600, "max_width_px" => 1200, "min_height_px" => 600, "max_height_px" => 1200, "target_width" => 600, "target_height" => 600, "aspect_ratio" => "1:1", "min_kb" => 10, "max_kb" => 240, "bg_color" => "Plain white / off-white background", "allowed_formats" => "JPG, JPEG", "dpi" => 300],
                "signature" => ["min_width_px" => 300, "max_width_px" => 600, "min_height_px" => 150, "max_height_px" => 300, "target_width" => 300, "target_height" => 150, "aspect_ratio" => "2:1", "min_kb" => 10, "max_kb" => 100, "bg_color" => "Black ink", "allowed_formats" => "JPG, JPEG", "dpi" => 300]
            ]
        ],
        [
            "id" => 99, "code" => "custom", "name" => "📐 Custom Image Resizer (Custom Width, Height & KB)", "conducting_body" => "Freeform Custom Resizing Utility", "category" => "Custom Preset", "country" => "all", "official_url" => "",
            "requirements" => [
                "photo" => ["min_width_px" => 350, "max_width_px" => 1000, "min_height_px" => 450, "max_height_px" => 1000, "target_width" => 350, "target_height" => 450, "aspect_ratio" => "Custom", "min_kb" => 20, "max_kb" => 100, "bg_color" => "User preference", "allowed_formats" => "JPG, JPEG, PNG, WEBP", "dpi" => 300],
                "signature" => ["min_width_px" => 280, "max_width_px" => 1000, "min_height_px" => 140, "max_height_px" => 1000, "target_width" => 280, "target_height" => 140, "aspect_ratio" => "Custom", "min_kb" => 10, "max_kb" => 50, "bg_color" => "User preference", "allowed_formats" => "JPG, JPEG, PNG, WEBP", "dpi" => 300]
            ]
        ]
    ];
}
