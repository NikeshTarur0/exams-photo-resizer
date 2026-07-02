<?php
/**
 * REST API Endpoint: /api/process.php
 * Handles server-side image processing fallback by invoking Python compressor script
 */

require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST."]);
    exit;
}

// Ensure upload temp directory exists
$tmp_dir = sys_get_temp_dir();

$uploaded_file = $_FILES['image']['tmp_name'] ?? null;
$width = (int)($_POST['width'] ?? 350);
$height = (int)($_POST['height'] ?? 450);
$min_kb = (float)($_POST['min_kb'] ?? 20);
$max_kb = (float)($_POST['max_kb'] ?? 50);

if (!$uploaded_file || !is_uploaded_file($uploaded_file)) {
    // Check if base64 payload was sent instead
    $raw_input = file_get_contents('php://input');
    $json = json_decode($raw_input, true);
    if ($json && isset($json['image_base64'])) {
        $base64_data = preg_replace('#^data:image/\w+;base64,#i', '', $json['image_base64']);
        $img_data = base64_decode($base64_data);
        $temp_path = tempnam($tmp_dir, 'exam_img_');
        file_put_contents($temp_path, $img_data);
        $uploaded_file = $temp_path;
        $width = (int)($json['width'] ?? $width);
        $height = (int)($json['height'] ?? $height);
        $min_kb = (float)($json['min_kb'] ?? $min_kb);
        $max_kb = (float)($json['max_kb'] ?? $max_kb);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No image file or base64 provided."]);
        exit;
    }
}

$script_path = realpath(__DIR__ . '/../compressor.py');
$python_bin = 'python'; // Or 'python3' depending on system PATH

$command = sprintf(
    '%s %s --input %s --width %d --height %d --min-kb %f --max-kb %f',
    escapeshellcmd($python_bin),
    escapeshellarg($script_path),
    escapeshellarg($uploaded_file),
    $width,
    $height,
    $min_kb,
    $max_kb
);

$output = [];
$return_code = 0;
exec($command, $output, $return_code);

$json_response = implode("\n", $output);
$result = json_decode($json_response, true);

if ($result && isset($result['success']) && $result['success']) {
    echo json_encode([
        "status" => "success",
        "processed_by" => "python_server_fallback",
        "data" => $result
    ]);
} else {
    // Fallback error or Python missing response
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $result['error'] ?? "Failed to execute Python image compressor script.",
        "raw_output" => $json_response
    ]);
}

// Cleanup temp file if created
if (isset($temp_path) && file_exists($temp_path)) {
    @unlink($temp_path);
}
