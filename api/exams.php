<?php
/**
 * REST API Endpoint: /api/exams.php
 * Fetch list of exam presets and specific requirements
 */

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

$pdo = getDBConnection();
$exam_code = $_GET['code'] ?? null;

if ($pdo === null) {
    // MySQL not available -> Serve from fallback dataset
    $exams = getFallbackExamsData();
    if ($exam_code) {
        $filtered = array_filter($exams, function($item) use ($exam_code) {
            return strtolower($item['code']) === strtolower($exam_code);
        });
        if (empty($filtered)) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Exam code not found"]);
            exit;
        }
        $selected = array_values($filtered)[0];
        echo json_encode(["status" => "success", "source" => "memory_fallback", "data" => $selected]);
        exit;
    }

    echo json_encode(["status" => "success", "source" => "memory_fallback", "data" => $exams]);
    exit;
}

try {
    if ($exam_code) {
        // Query specific exam by code
        $stmt = $pdo->prepare("SELECT * FROM exams WHERE code = :code");
        $stmt->execute(['code' => $exam_code]);
        $exam = $stmt->fetch();

        if (!$exam) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Exam not found in database"]);
            exit;
        }

        $reqStmt = $pdo->prepare("SELECT * FROM exam_requirements WHERE exam_id = :exam_id");
        $reqStmt->execute(['exam_id' => $exam['id']]);
        $requirements = $reqStmt->fetchAll();

        $req_map = [];
        foreach ($requirements as $r) {
            $req_map[$r['doc_type']] = [
                "min_width_px" => (int)$r['min_width_px'],
                "max_width_px" => (int)$r['max_width_px'],
                "min_height_px" => (int)$r['min_height_px'],
                "max_height_px" => (int)$r['max_height_px'],
                "target_width" => (int)$r['min_width_px'],
                "target_height" => (int)$r['min_height_px'],
                "aspect_ratio" => $r['aspect_ratio'],
                "min_kb" => (int)$r['min_kb'],
                "max_kb" => (int)$r['max_kb'],
                "bg_color" => $r['bg_color'],
                "allowed_formats" => $r['allowed_formats'],
                "dpi" => (int)$r['dpi'],
                "special_instructions" => $r['special_instructions']
            ];
        }

        $exam['requirements'] = $req_map;
        echo json_encode(["status" => "success", "source" => "mysql_db", "data" => $exam]);
        exit;
    }

    // Query all exams
    $stmt = $pdo->query("SELECT * FROM exams ORDER BY name ASC");
    $exams = $stmt->fetchAll();

    foreach ($exams as &$e) {
        $reqStmt = $pdo->prepare("SELECT * FROM exam_requirements WHERE exam_id = :exam_id");
        $reqStmt->execute(['exam_id' => $e['id']]);
        $reqs = $reqStmt->fetchAll();
        $e['requirements'] = [];
        foreach ($reqs as $r) {
            $e['requirements'][$r['doc_type']] = [
                "min_width_px" => (int)$r['min_width_px'],
                "max_width_px" => (int)$r['max_width_px'],
                "min_height_px" => (int)$r['min_height_px'],
                "max_height_px" => (int)$r['max_height_px'],
                "target_width" => (int)$r['min_width_px'],
                "target_height" => (int)$r['min_height_px'],
                "aspect_ratio" => $r['aspect_ratio'],
                "min_kb" => (int)$r['min_kb'],
                "max_kb" => (int)$r['max_kb'],
                "bg_color" => $r['bg_color'],
                "allowed_formats" => $r['allowed_formats'],
                "dpi" => (int)$r['dpi'],
                "special_instructions" => $r['special_instructions']
            ];
        }
    }

    echo json_encode(["status" => "success", "source" => "mysql_db", "data" => $exams]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database query failed: " . $e->getMessage()]);
}
