<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $token = $_POST['token'];
    $new_password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Verify token and check if not expired
    $sql = "SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $email = $row['email'];

        // Update user password
        $update_sql = "UPDATE users SET password = ? WHERE email = ?";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bind_param("ss", $new_password, $email);

        if ($update_stmt->execute()) {
            // Delete the used token
            $delete_sql = "DELETE FROM password_resets WHERE token = ?";
            $delete_stmt = $conn->prepare($delete_sql);
            $delete_stmt->bind_param("s", $token);
            $delete_stmt->execute();
            $delete_stmt->close();

            echo json_encode(["success" => true, "message" => "Password reset successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update password"]);
        }

        $update_stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid or expired token"]);
    }

    $stmt->close();
    $conn->close();
}
?>
