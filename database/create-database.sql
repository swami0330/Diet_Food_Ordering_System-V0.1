-- NutriDash Database Creation Script for XAMPP MySQL
-- Run this script in phpMyAdmin or MySQL command line

-- Create the database
CREATE DATABASE IF NOT EXISTS nutridash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE nutridash;

-- Show confirmation
SELECT 'NutriDash database created successfully!' as message;