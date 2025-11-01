// Payment page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Function to generate random order ID
    function generateOrderId() {
        return 'NS' + Date.now() + Math.floor(Math.random() * 1000);
    }

    // Function to show payment success section
    function showPaymentSuccess(paymentMethod) {
        const orderId = generateOrderId();
        document.getElementById('order-id').textContent = orderId;
        document.getElementById('payment-success').style.display = 'block';
        document.querySelector('.payment-section').style.display = 'none';
        document.querySelector('.payment-issues').style.display = 'none';
        window.scrollTo(0, 0);

        // Save order to localStorage
        const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
        if (pendingOrder) {
            const order = {
                id: orderId,
                date: new Date(pendingOrder.date).toLocaleDateString('en-IN'),
                items: pendingOrder.items,
                total: pendingOrder.total,
                appliedDiscount: pendingOrder.appliedDiscount,
                bulkDiscount: pendingOrder.bulkDiscount || 0,
                giftWrapping: pendingOrder.giftWrapping,
                paymentMethod: paymentMethod,
                status: 'Processing' // Initial status
            };

            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.unshift(order); // Add to beginning of array
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.removeItem('pendingOrder'); // Clean up
        }
    }

    // Function to show notifications
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            font-weight: bold;
        `;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Confirm payment function
    window.confirmPayment = function(method) {
        let transactionId = '';
        let isValid = true;

        switch(method) {
            case 'upi':
                transactionId = document.getElementById('upi-transaction-id').value.trim();
                if (!transactionId) {
                    showNotification('Please enter UPI Transaction ID.', 'error');
                    isValid = false;
                }
                break;
            case 'card':
                // Card validation would be handled by form submission
                break;
            case 'wallet':
                transactionId = document.getElementById('wallet-transaction-id').value.trim();
                if (!transactionId) {
                    showNotification('Please enter Wallet Transaction ID.', 'error');
                    isValid = false;
                }
                break;
            case 'bank':
                transactionId = document.getElementById('bank-transaction-id').value.trim();
                if (!transactionId) {
                    showNotification('Please enter Bank Transaction Reference ID.', 'error');
                    isValid = false;
                }
                break;
            case 'cod':
                // COD doesn't require transaction ID
                break;
        }

        if (isValid) {
            showPaymentSuccess(method.toUpperCase());
        }
    };

    // Select wallet function
    window.selectWallet = function(walletType) {
        const walletInput = document.getElementById('wallet-transaction-id');
        const confirmBtn = document.getElementById('confirm-wallet');

        // Show input and confirm button
        walletInput.style.display = 'block';
        confirmBtn.style.display = 'block';

        showNotification(`Selected ${walletType.toUpperCase()}. Enter transaction ID to confirm.`, 'info');
    };

    // Card form submission
    const cardForm = document.getElementById('card-form');
    if (cardForm) {
        cardForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const cardNumber = document.getElementById('card-number').value.trim();
            const expiry = document.getElementById('card-expiry').value.trim();
            const cvv = document.getElementById('card-cvv').value.trim();
            const name = document.getElementById('card-name').value.trim();

            // Basic validation
            if (cardNumber.length !== 16 || isNaN(cardNumber)) {
                showNotification('Please enter a valid 16-digit card number.', 'error');
                return;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                showNotification('Please enter expiry date in MM/YY format.', 'error');
                return;
            }

            if (cvv.length !== 3 || isNaN(cvv)) {
                showNotification('Please enter a valid 3-digit CVV.', 'error');
                return;
            }

            if (!name) {
                showNotification('Please enter cardholder name.', 'error');
                return;
            }

            // Simulate card processing
            showNotification('Processing card payment...', 'info');
            setTimeout(() => {
                showPaymentSuccess('Credit/Debit Card');
            }, 2000);
        });
    }
});
