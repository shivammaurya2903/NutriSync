<?php
include 'db.php';
include 'email_config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    // Check if email exists
    $sql = "SELECT id FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        // Generate secure token
        $token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Delete any existing reset tokens for this email
        $delete_sql = "DELETE FROM password_resets WHERE email = ?";
        $delete_stmt = $conn->prepare($delete_sql);
        $delete_stmt->bind_param("s", $email);
        $delete_stmt->execute();
        $delete_stmt->close();

        // Insert new reset token
        $insert_sql = "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)";
        $insert_stmt = $conn->prepare($insert_sql);
        $insert_stmt->bind_param("sss", $email, $token, $expires_at);

        if ($insert_stmt->execute()) {
            // Send reset email
            $reset_link = "http://localhost/NutriSync/reset_password.html?token=" . $token;

            if (sendResetEmail($email, $reset_link)) {
                echo json_encode(["success" => true, "message" => "Password reset link sent to your email"]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to send email. Please try again."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Failed to generate reset token"]);
        }

        $insert_stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Email not found"]);
    }

    $stmt->close();
    $conn->close();
}
?>
