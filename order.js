// Order page JavaScript

// Function to initialize sample orders if none exist
function initializeSampleOrders() {
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    if (existingOrders.length === 0) {
        const sampleOrders = [
            {
                id: 'NS1734300000000',
                date: '15/12/2024',
                items: [{ name: 'Premium Almonds', price: 499, quantity: 2, image: 'https://media.istockphoto.com/id/1360789044/photo/almonds-isolated-on-wooden-background-flat-lay.jpg?s=612x612&w=0&k=20&c=m3JUwL1ru0rHGQwdtkHpl7PjWjvdGzbMKcTnkyJmzFw=' }],
                total: 998,
                appliedDiscount: 0,
                paymentMethod: 'UPI',
                status: 'Delivered'
            },
            {
                id: 'NS1732800000000',
                date: '28/11/2024',
                items: [{ name: 'Exotic Berries Mix', price: 699, quantity: 1, image: 'https://www.goingnuts.in/wp-content/uploads/2023/03/361A2490-scaled-1.jpg' }],
                total: 699,
                appliedDiscount: 0,
                paymentMethod: 'Bank Transfer',
                status: 'Delivered'
            },
            {
                id: 'NS1731200000000',
                date: '10/11/2024',
                items: [{ name: 'Organic Cashews', price: 450, quantity: 1, image: 'https://narayanjigajakwale.in/cdn/shop/files/Cashwe-180-No.jpg?v=1727454538' }],
                total: 450,
                appliedDiscount: 0,
                paymentMethod: 'Cash on Delivery',
                status: 'Delivered'
            }
        ];
        localStorage.setItem('orders', JSON.stringify(sampleOrders));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeSampleOrders();
    loadOrders();

    // Function to load orders from localStorage
    function loadOrders() {
        const ordersContainer = document.getElementById('orders-container');
        const orders = JSON.parse(localStorage.getItem('orders')) || [];

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found. Start shopping to place your first order!</p>';
            return;
        }

        ordersContainer.innerHTML = '';

        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';

            // Determine status class
            const statusClass = order.status.toLowerCase() === 'delivered' ? 'status-delivered' : 'status-shipped';

            // Build items HTML
            let itemsHTML = '';
            order.items.forEach(item => {
                itemsHTML += `
                    <div class="order-item">
                        <img src="${item.image || 'images/default-product.png'}" alt="${item.name}" />
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>${item.quantity} × ₹${item.price}</p>
                            <p>₹${item.price * item.quantity}</p>
                        </div>
                    </div>
                `;
            });

            orderCard.innerHTML = `
                <div class="order-header">
                    <h3>${order.id}</h3>
                    <span class="order-status ${statusClass}">${order.status}</span>
                </div>
                <div class="order-details">
                    <p><strong>Date:</strong> ${order.date}</p>
                    <p><strong>Total:</strong> ₹${order.total}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                </div>
                <div class="order-items">
                    ${itemsHTML}
                </div>
                <div class="order-actions">
                    <button class="btn-secondary">${order.status === 'Shipped' ? 'Track Order' : 'Reorder'}</button>
                    <button class="btn-primary">View Details</button>
                    <button class="btn-danger">Remove Order</button>
                </div>
            `;

            ordersContainer.appendChild(orderCard);
        });

        // Add event listeners to dynamically created buttons
        addEventListeners();
    }

    // Function to add event listeners to buttons
    function addEventListeners() {
        const reorderButtons = document.querySelectorAll('.btn-secondary');
        const viewDetailsButtons = document.querySelectorAll('.btn-primary');
        const removeButtons = document.querySelectorAll('.btn-danger');

        reorderButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.textContent === 'Reorder') {
                    const orderCard = this.closest('.order-card');
                    const orderId = orderCard.querySelector('.order-header h3').textContent;
                    const order = orders.find(o => o.id === orderId);
                    if (order) {
                        // Add items to cart
                        let cart = JSON.parse(localStorage.getItem('cart')) || [];
                        order.items.forEach(item => {
                            const existingItem = cart.find(cartItem => cartItem.name === item.name);
                            if (existingItem) {
                                existingItem.quantity += item.quantity;
                            } else {
                                cart.push({ ...item });
                            }
                        });
                        localStorage.setItem('cart', JSON.stringify(cart));
                        alert(`Reordering items from ${orderId}. You will be redirected to the cart.`);
                        window.location.href = 'cart.html';
                    }
                } else if (this.textContent === 'Track Order') {
                    const orderCard = this.closest('.order-card');
                    const orderId = orderCard.querySelector('.order-header h3').textContent;
                    alert(`Tracking information for ${orderId}: Your order is on the way and will be delivered within 2 days.`);
                }
            });
        });

        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                const orderId = orderCard.querySelector('.order-header h3').textContent;
                const orderDate = orderCard.querySelector('.order-details p:first-child').textContent;
                const total = orderCard.querySelector('.order-details p:nth-child(2)').textContent;
                const payment = orderCard.querySelector('.order-details p:nth-child(3)').textContent;
                const items = Array.from(orderCard.querySelectorAll('.item-info h4')).map(h4 => h4.textContent).join(', ');

                alert(`Order Details:\n${orderId}\n${orderDate}\n${total}\n${payment}\nItems: ${items}`);
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                const orderId = orderCard.querySelector('.order-header h3').textContent;
                if (confirm(`Are you sure you want to remove order ${orderId}?`)) {
                    let orders = JSON.parse(localStorage.getItem('orders')) || [];
                    orders = orders.filter(o => o.id !== orderId);
                    localStorage.setItem('orders', JSON.stringify(orders));
                    loadOrders(); // Reload orders after removal
                }
            });
        });
    }

    // Simulate dynamic order status updates (for demo purposes)
    setInterval(() => {
        const shippedOrders = document.querySelectorAll('.status-shipped');
        shippedOrders.forEach(order => {
            // Randomly change some shipped orders to delivered
            if (Math.random() > 0.95) {
                order.textContent = 'Delivered';
                order.className = 'order-status status-delivered';

                // Update in localStorage
                const orderId = order.closest('.order-card').querySelector('.order-header h3').textContent;
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                const orderIndex = orders.findIndex(o => o.id === orderId);
                if (orderIndex !== -1) {
                    orders[orderIndex].status = 'Delivered';
                    localStorage.setItem('orders', JSON.stringify(orders));
                }
            }
        });
    }, 10000); // Check every 10 seconds
});
