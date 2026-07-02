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
            "id" => 1,
            "code" => "ssc_cgl",
            "name" => "SSC Combined Graduate Level (CGL)",
            "conducting_body" => "Staff Selection Commission",
            "category" => "Government Job",
            "official_url" => "https://ssc.gov.in",
            "requirements" => [
                "photo" => [
                    "min_width_px" => 350, "max_width_px" => 450,
                    "min_height_px" => 450, "max_height_px" => 550,
                    "target_width" => 350, "target_height" => 450,
                    "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50,
                    "bg_color" => "Light / White Background",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 200,
                    "special_instructions" => "Recent photograph without cap/glasses. Both ears clearly visible."
                ],
                "signature" => [
                    "min_width_px" => 280, "max_width_px" => 400,
                    "min_height_px" => 140, "max_height_px" => 200,
                    "target_width" => 280, "target_height" => 140,
                    "aspect_ratio" => "4.0:2.0", "min_kb" => 10, "max_kb" => 20,
                    "bg_color" => "White paper with Black ink",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 200,
                    "special_instructions" => "Running hand in black ink. Capital block letters strictly invalid."
                ]
            ]
        ],
        [
            "id" => 2,
            "code" => "ssc_chsl",
            "name" => "SSC Combined Higher Secondary Level (CHSL)",
            "conducting_body" => "Staff Selection Commission",
            "category" => "Government Job",
            "official_url" => "https://ssc.gov.in",
            "requirements" => [
                "photo" => [
                    "min_width_px" => 350, "max_width_px" => 450,
                    "min_height_px" => 450, "max_height_px" => 550,
                    "target_width" => 350, "target_height" => 450,
                    "aspect_ratio" => "3.5:4.5", "min_kb" => 20, "max_kb" => 50,
                    "bg_color" => "Plain light background",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 200,
                    "special_instructions" => "Color passport photo taken within last 3 months."
                ],
                "signature" => [
                    "min_width_px" => 280, "max_width_px" => 400,
                    "min_height_px" => 140, "max_height_px" => 200,
                    "target_width" => 280, "target_height" => 140,
                    "aspect_ratio" => "4.0:2.0", "min_kb" => 10, "max_kb" => 20,
                    "bg_color" => "White paper",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 200,
                    "special_instructions" => "Black ink running signature."
                ]
            ]
        ],
        [
            "id" => 3,
            "code" => "upsc_cse",
            "name" => "UPSC Civil Services Examination (IAS/IPS)",
            "conducting_body" => "Union Public Service Commission",
            "category" => "Civil Services",
            "official_url" => "https://upsc.gov.in",
            "requirements" => [
                "photo" => [
                    "min_width_px" => 350, "max_width_px" => 1000,
                    "min_height_px" => 350, "max_height_px" => 1000,
                    "target_width" => 500, "target_height" => 500,
                    "aspect_ratio" => "1:1", "min_kb" => 20, "max_kb" => 300,
                    "bg_color" => "White / Plain background",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 300,
                    "special_instructions" => "Square aspect ratio (1:1). Candidate name & date of photo printed at bottom."
                ],
                "signature" => [
                    "min_width_px" => 350, "max_width_px" => 1000,
                    "min_height_px" => 350, "max_height_px" => 1000,
                    "target_width" => 500, "target_height" => 500,
                    "aspect_ratio" => "1:1", "min_kb" => 20, "max_kb" => 300,
                    "bg_color" => "White background with Black ink",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 300,
                    "special_instructions" => "Square aspect ratio (1:1). High resolution scan."
                ]
            ]
        ],
        [
            "id" => 4,
            "code" => "ibps_po",
            "name" => "IBPS Probationary Officer (PO / MT)",
            "conducting_body" => "Institute of Banking Personnel Selection",
            "category" => "Banking",
            "official_url" => "https://ibps.in",
            "requirements" => [
                "photo" => [
                    "min_width_px" => 200, "max_width_px" => 250,
                    "min_height_px" => 230, "max_height_px" => 270,
                    "target_width" => 200, "target_height" => 230,
                    "aspect_ratio" => "4.5:3.5", "min_kb" => 20, "max_kb" => 50,
                    "bg_color" => "Light colored / White",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 200,
                    "special_instructions" => "Recent color photograph looking straight."
                ],
                "signature" => [
                    "min_width_px" => 140, "max_width_px" => 200,
                    "min_height_px" => 60, "max_height_px" => 100,
                    "target_width" => 140, "target_height" => 60,
                    "aspect_ratio" => "2.3:1", "min_kb" => 10, "max_kb" => 20,
                    "bg_color" => "White paper with Black ink pen",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 200,
                    "special_instructions" => "Must be candidate's own signature."
                ]
            ]
        ],
        [
            "id" => 5,
            "code" => "nta_neet",
            "name" => "NTA NEET (UG) Medical Entrance",
            "conducting_body" => "National Testing Agency",
            "category" => "Medical Entrance",
            "official_url" => "https://neet.nta.nic.in",
            "requirements" => [
                "photo" => [
                    "min_width_px" => 350, "max_width_px" => 600,
                    "min_height_px" => 450, "max_height_px" => 800,
                    "target_width" => 400, "target_height" => 520,
                    "aspect_ratio" => "3.5:4.5", "min_kb" => 10, "max_kb" => 200,
                    "bg_color" => "White background",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 300,
                    "special_instructions" => "80% face coverage visible without mask, with ears visible."
                ],
                "signature" => [
                    "min_width_px" => 280, "max_width_px" => 500,
                    "min_height_px" => 100, "max_height_px" => 250,
                    "target_width" => 350, "target_height" => 150,
                    "aspect_ratio" => "3.5:1.5", "min_kb" => 4, "max_kb" => 30,
                    "bg_color" => "White sheet with Black ink",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 300,
                    "special_instructions" => "Running handwriting signature."
                ]
            ]
        ],
        [
            "id" => 6,
            "code" => "nta_jee",
            "name" => "NTA JEE Main Engineering Entrance",
            "conducting_body" => "National Testing Agency",
            "category" => "Engineering Entrance",
            "official_url" => "https://jeemain.nta.ac.in",
            "requirements" => [
                "photo" => [
                    "min_width_px" => 350, "max_width_px" => 600,
                    "min_height_px" => 450, "max_height_px" => 800,
                    "target_width" => 400, "target_height" => 520,
                    "aspect_ratio" => "3.5:4.5", "min_kb" => 10, "max_kb" => 200,
                    "bg_color" => "White background",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 300,
                    "special_instructions" => "80% face visible against plain white background."
                ],
                "signature" => [
                    "min_width_px" => 280, "max_width_px" => 500,
                    "min_height_px" => 100, "max_height_px" => 250,
                    "target_width" => 350, "target_height" => 150,
                    "aspect_ratio" => "3.5:1.5", "min_kb" => 4, "max_kb" => 30,
                    "bg_color" => "White sheet with Black ink",
                    "allowed_formats" => "JPG, JPEG",
                    "dpi" => 300,
                    "special_instructions" => "Signature in black ball point pen."
                ]
            ]
        ]
    ];
}
