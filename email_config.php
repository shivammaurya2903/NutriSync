<?php
// Email configuration for password reset
// For production, use a proper SMTP service like SendGrid, Mailgun, or AWS SES

// Option 1: Using PHP mail() with local SMTP (requires SMTP server setup)
// This is the current implementation in forgot_password.php

// Option 2: Using PHPMailer (recommended for production)
// Uncomment and configure the following if you install PHPMailer

/*
require 'vendor/autoload.php'; // If using Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendPasswordResetEmail($to, $subject, $message) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Use your SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'your-email@gmail.com'; // Your email
        $mail->Password = 'your-app-password'; // App password, not regular password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('no-reply@nutrisync.com', 'NutriSync');
        $mail->addAddress($to);

        // Content
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $message;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email sending failed: " . $mail->ErrorInfo);
        return false;
    }
}
*/

// Option 3: For local development, you can log emails to a file instead
function sendPasswordResetEmail($to, $subject, $message) {
    // Log to file for development
    $logFile = 'email_log.txt';
    $logEntry = date('Y-m-d H:i:s') . " - To: $to\nSubject: $subject\nMessage:\n$message\n\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);

    // For development, return true to simulate success
    return true;
}

// Current implementation using PHP mail() - replace with above functions as needed
function sendResetEmail($to, $resetLink) {
    $subject = "Password Reset Request - NutriSync";
    $message = "Hello,\n\nYou have requested to reset your password for NutriSync.\n\nClick the following link to reset your password:\n" . $resetLink . "\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nNutriSync Team";

    // Use the configured method
    return sendPasswordResetEmail($to, $subject, $message);
}
?>
