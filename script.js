document.addEventListener('DOMContentLoaded', function() {
  // Load cart from localStorage or initialize empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Function to save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Function to add item to cart
  function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    showNotification(`${name} added to cart!`, 'success');
  }

  // Function to remove item from cart
  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }

  // Function to update quantity
  function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return;
    cart[index].quantity = newQuantity;
    saveCart();
    renderCart();
  }

  // Function to render cart on cart.html
  function renderCart() {
    const cartTableBody = document.querySelector('.cart-table tbody');
    const totalElement = document.querySelector('.cart-summary h3');
    const freeShippingBanner = document.getElementById('free-shipping-banner');

    if (!cartTableBody) return; // Not on cart page

    cartTableBody.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td><input type="number" value="${item.quantity}" min="1" aria-label="Quantity for ${item.name}" /></td>
        <td>₹${subtotal}</td>
        <td><button data-index="${index}">✕</button></td>
      `;
      cartTableBody.appendChild(row);

      // Attach quantity change listener
      const quantityInput = row.querySelector('input[type="number"]');
      quantityInput.addEventListener('input', function() {
        updateQuantity(index, parseInt(this.value));
      });

      // Attach remove listener
      const removeBtn = row.querySelector('button');
      removeBtn.addEventListener('click', function() {
        removeFromCart(index);
      });
    });

    totalElement.textContent = 'Total: ₹' + total;

    // Show free shipping banner if total >= 2000
    if (total >= 2000) {
      freeShippingBanner.style.display = 'block';
    } else {
      freeShippingBanner.style.display = 'none';
    }
  }

  // Attach event listeners to all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('button');
  addToCartButtons.forEach(button => {
    if (button.textContent.trim() === 'Add to Cart') {
      button.addEventListener('click', function() {
        const productCard = this.closest('.product-card, .gift-card');
        if (productCard) {
          const name = productCard.querySelector('h3, h4').textContent;
          let priceElement = productCard.querySelector('.price');
          if (!priceElement) {
            // Fallback to first p element containing ₹
            const pElements = productCard.querySelectorAll('p');
            for (let p of pElements) {
              if (p.textContent.includes('₹')) {
                priceElement = p;
                break;
              }
            }
          }
          if (priceElement) {
            const priceText = priceElement.textContent.trim();
            const priceMatch = priceText.match(/₹(\d+)/);
            if (priceMatch) {
              const price = parseInt(priceMatch[1]);
              if (!isNaN(price) && price > 0) {
                addToCart(name, price);
              }
            }
          }
        }
      });
    }
  });

  // Render cart if on cart page
  renderCart();

  // Function to show notifications
  function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
      color: white;
      padding: 12px 20px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      font-weight: bold;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification('Thank you for subscribing!', 'success');
      newsletterForm.reset();
    });
  }
});
