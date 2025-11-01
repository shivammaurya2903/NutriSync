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
                paymentMethod: paymentMethod,
                status: 'Delivered' // Default status for demo
            };

            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.unshift(order); // Add to beginning of array
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.removeItem('pendingOrder'); // Clean up
        }
    }

    // UPI Payment
    const upiButton = document.querySelector('.payment-box:nth-child(1) button');
    const upiInput = document.querySelector('.payment-box:nth-child(1) input');

    if (upiButton && upiInput) {
        upiButton.addEventListener('click', function() {
            const transactionId = upiInput.value.trim();
            if (transactionId === '') {
                alert('Please enter the UPI Transaction ID.');
                return;
            }
            showPaymentSuccess('UPI');
        });
    }

    // Bank Transfer
    const bankButton = document.querySelector('.payment-box:nth-child(2) button');
    const bankInput = document.querySelector('.payment-box:nth-child(2) input');

    if (bankButton && bankInput) {
        bankButton.addEventListener('click', function() {
            const referenceId = bankInput.value.trim();
            if (referenceId === '') {
                alert('Please enter the Transaction Reference ID.');
                return;
            }
            showPaymentSuccess('Bank Transfer');
        });
    }

    // Cash on Delivery
    const codButton = document.querySelector('.payment-box:nth-child(3) button');

    if (codButton) {
        codButton.addEventListener('click', function() {
            showPaymentSuccess('Cash on Delivery');
        });
    }
});
