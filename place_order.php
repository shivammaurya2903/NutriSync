<?php
include 'db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $total_amount = $_POST['total_amount'];
    $status = 'pending';

    $sql = "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ids", $user_id, $total_amount, $status);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Order placed successfully", "order_id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "message" => "Error placing order: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
}
?>
