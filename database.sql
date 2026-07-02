-- ============================================================================
-- Indian Exam Photo & Signature Resizer - Unified Database Setup & Seed
-- File: `database.sql`
-- Import with: mysql -u root -p < database.sql
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `indian_exam_resizer` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `indian_exam_resizer`;

-- ----------------------------------------------------------------------------
-- 1. Table Structures
-- ----------------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `exam_requirements`;
DROP TABLE IF EXISTS `exams`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `exams` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique identifier code, e.g. ssc_cgl, upsc_cse',
    `name` VARCHAR(150) NOT NULL COMMENT 'Full name of the examination',
    `conducting_body` VARCHAR(150) NOT NULL COMMENT 'Conducting authority e.g., NTA, UPSC, SSC, IBPS',
    `category` VARCHAR(50) DEFAULT 'General' COMMENT 'Exam category: Civil Services, Banking, Engineering, Medical, Defense',
    `official_url` VARCHAR(255) DEFAULT NULL COMMENT 'Official portal URL for guidelines reference',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exam_requirements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `exam_id` INT NOT NULL,
    `doc_type` ENUM('photo', 'signature') NOT NULL COMMENT 'Document category',
    `min_width_px` INT NOT NULL COMMENT 'Minimum width in pixels',
    `max_width_px` INT NOT NULL COMMENT 'Maximum width in pixels',
    `min_height_px` INT NOT NULL COMMENT 'Minimum height in pixels',
    `max_height_px` INT NOT NULL COMMENT 'Maximum height in pixels',
    `aspect_ratio` VARCHAR(20) DEFAULT '3.5:4.5' COMMENT 'Expected aspect ratio representation',
    `min_kb` INT NOT NULL COMMENT 'Minimum file size in Kilobytes',
    `max_kb` INT NOT NULL COMMENT 'Maximum file size in Kilobytes',
    `bg_color` VARCHAR(50) DEFAULT 'White / Light' COMMENT 'Required background guidelines',
    `allowed_formats` VARCHAR(100) DEFAULT 'JPEG, JPG' COMMENT 'Allowed image file extensions',
    `dpi` INT DEFAULT 200 COMMENT 'Recommended print DPI resolution',
    `special_instructions` TEXT DEFAULT NULL COMMENT 'Additional exam notes e.g., Name/Date stamp requirement',
    FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_exam_doc` ON `exam_requirements` (`exam_id`, `doc_type`);

-- ----------------------------------------------------------------------------
-- 2. Seed Data (Official Indian Exam Specifications)
-- ----------------------------------------------------------------------------

-- Insert Exams
INSERT INTO `exams` (`id`, `code`, `name`, `conducting_body`, `category`, `official_url`) VALUES
(1, 'ssc_cgl', 'SSC Combined Graduate Level (CGL)', 'Staff Selection Commission', 'Government Job', 'https://ssc.gov.in'),
(2, 'ssc_chsl', 'SSC Combined Higher Secondary Level (CHSL)', 'Staff Selection Commission', 'Government Job', 'https://ssc.gov.in'),
(3, 'upsc_cse', 'UPSC Civil Services Examination (IAS/IPS)', 'Union Public Service Commission', 'Civil Services', 'https://upsc.gov.in'),
(4, 'ibps_po', 'IBPS Probationary Officer (PO / MT)', 'Institute of Banking Personnel Selection', 'Banking', 'https://ibps.in'),
(5, 'nta_neet', 'NTA NEET (UG) Medical Entrance', 'National Testing Agency', 'Medical Entrance', 'https://neet.nta.nic.in'),
(6, 'nta_jee', 'NTA JEE Main Engineering Entrance', 'National Testing Agency', 'Engineering Entrance', 'https://jeemain.nta.ac.in'),
(7, 'sbi_po', 'SBI Probationary Officer (PO)', 'State Bank of India', 'Banking', 'https://sbi.co.in/careers'),
(8, 'gate', 'Graduate Aptitude Test in Engineering (GATE)', 'IIT / IISc', 'Post Graduate', 'https://gate2026.iitkgp.ac.in'),
(9, 'rrb_ntpc', 'RRB NTPC Non-Technical Popular Categories', 'Railway Recruitment Board', 'Railways', 'https://indianrailways.gov.in');

-- SSC CGL Requirements
INSERT INTO `exam_requirements` (`exam_id`, `doc_type`, `min_width_px`, `max_width_px`, `min_height_px`, `max_height_px`, `aspect_ratio`, `min_kb`, `max_kb`, `bg_color`, `allowed_formats`, `dpi`, `special_instructions`) VALUES
(1, 'photo', 350, 450, 450, 550, '3.5:4.5', 20, 50, 'White or light plain background', 'JPG, JPEG', 200, 'Recent color passport photograph without cap/goggles. Ears must be clearly visible.'),
(1, 'signature', 280, 400, 140, 200, '4.0:2.0', 10, 20, 'White paper with Black ink signature', 'JPG, JPEG', 200, 'Signature must be running hand in dark black ink. Capital block letters strictly prohibited.');

-- SSC CHSL Requirements
INSERT INTO `exam_requirements` (`exam_id`, `doc_type`, `min_width_px`, `max_width_px`, `min_height_px`, `max_height_px`, `aspect_ratio`, `min_kb`, `max_kb`, `bg_color`, `allowed_formats`, `dpi`, `special_instructions`) VALUES
(2, 'photo', 350, 450, 450, 550, '3.5:4.5', 20, 50, 'Plain light background', 'JPG, JPEG', 200, 'Must be taken within last 3 months. Both ears must be visible.'),
(2, 'signature', 280, 400, 140, 200, '4.0:2.0', 10, 20, 'White background', 'JPG, JPEG', 200, 'Signed in black ink.');

-- UPSC Civil Services Requirements
INSERT INTO `exam_requirements` (`exam_id`, `doc_type`, `min_width_px`, `max_width_px`, `min_height_px`, `max_height_px`, `aspect_ratio`, `min_kb`, `max_kb`, `bg_color`, `allowed_formats`, `dpi`, `special_instructions`) VALUES
(3, 'photo', 350, 1000, 350, 1000, '1:1', 20, 300, 'White / Plain background', 'JPG, JPEG', 300, 'Dimensions must be equal (Square format). Name of candidate and date of photograph taking must be printed at bottom.'),
(3, 'signature', 350, 1000, 350, 1000, '1:1', 20, 300, 'White background with Black ink', 'JPG, JPEG', 300, 'Square aspect ratio. Clear legible signature on white sheet.');

-- IBPS PO Requirements
INSERT INTO `exam_requirements` (`exam_id`, `doc_type`, `min_width_px`, `max_width_px`, `min_height_px`, `max_height_px`, `aspect_ratio`, `min_kb`, `max_kb`, `bg_color`, `allowed_formats`, `dpi`, `special_instructions`) VALUES
(4, 'photo', 200, 250, 230, 270, '4.5:3.5', 20, 50, 'Light-colored (preferably white) background', 'JPG, JPEG', 200, 'Look straight at camera with relaxed face.'),
(4, 'signature', 140, 200, 60, 100, '2.3:1', 10, 20, 'White paper with Black ink pen', 'JPG, JPEG', 200, 'Signature in capital letters will NOT be accepted.');

-- NTA NEET UG Requirements
INSERT INTO `exam_requirements` (`exam_id`, `doc_type`, `min_width_px`, `max_width_px`, `min_height_px`, `max_height_px`, `aspect_ratio`, `min_kb`, `max_kb`, `bg_color`, `allowed_formats`, `dpi`, `special_instructions`) VALUES
(5, 'photo', 350, 600, 450, 800, '3.5:4.5', 10, 200, 'White background (80% face coverage)', 'JPG, JPEG', 300, '80% face coverage without mask. Name of candidate and date of taking photo at bottom.'),
(5, 'signature', 280, 500, 100, 250, '3.5:1.5', 4, 30, 'White background with Black ink pen', 'JPG, JPEG', 300, 'Signature must be in running handwriting.');

-- NTA JEE Main Requirements
INSERT INTO `exam_requirements` (`exam_id`, `doc_type`, `min_width_px`, `max_width_px`, `min_height_px`, `max_height_px`, `aspect_ratio`, `min_kb`, `max_kb`, `bg_color`, `allowed_formats`, `dpi`, `special_instructions`) VALUES
(6, 'photo', 350, 600, 450, 800, '3.5:4.5', 10, 200, 'White background (80% face visible)', 'JPG, JPEG', 300, 'Recent passport size photo showing ears clearly.'),
(6, 'signature', 280, 500, 100, 250, '3.5:1.5', 4, 30, 'White paper with Black pen', 'JPG, JPEG', 300, 'Full running signature in black ink.');

-- SBI PO Requirements
INSERT INTO `exam_requirements` (`exam_id`, `doc_type`, `min_width_px`, `max_width_px`, `min_height_px`, `max_height_px`, `aspect_ratio`, `min_kb`, `max_kb`, `bg_color`, `allowed_formats`, `dpi`, `special_instructions`) VALUES
(7, 'photo', 200, 250, 230, 270, '4.5:3.5', 20, 50, 'Light colored background', 'JPG, JPEG', 200, 'Recent colored passport photograph.'),
(7, 'signature', 140, 200, 60, 100, '2.3:1', 10, 20, 'White paper with Black ink', 'JPG, JPEG', 200, 'Signature in block/capital letters rejected.');

-- GATE Requirements
INSERT INTO `exam_requirements` (`exam_id`, `doc_type`, `min_width_px`, `max_width_px`, `min_height_px`, `max_height_px`, `aspect_ratio`, `min_kb`, `max_kb`, `bg_color`, `allowed_formats`, `dpi`, `special_instructions`) VALUES
(8, 'photo', 480, 600, 640, 800, '3.5:4.5', 20, 200, 'White background strictly', 'JPG, JPEG', 300, 'Face should occupy 60%-70% of photo area.'),
(8, 'signature', 280, 560, 80, 160, '3.5:1.0', 10, 200, 'White background, Dark Blue or Black ink', 'JPG, JPEG', 300, 'Only handwritten signature allowed.');

-- RRB NTPC Requirements
INSERT INTO `exam_requirements` (`exam_id`, `doc_type`, `min_width_px`, `max_width_px`, `min_height_px`, `max_height_px`, `aspect_ratio`, `min_kb`, `max_kb`, `bg_color`, `allowed_formats`, `dpi`, `special_instructions`) VALUES
(9, 'photo', 320, 400, 400, 500, '3.5:4.5', 20, 50, 'White / Light plain background', 'JPG, JPEG', 200, 'Color passport photo without dark glasses or caps.'),
(9, 'signature', 250, 350, 100, 150, '3.0:1.2', 10, 20, 'White paper with Black or Blue ink', 'JPG, JPEG', 200, 'Running hand signature strictly.');
