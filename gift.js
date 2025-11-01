document.addEventListener('DOMContentLoaded', function() {
  // Load cart from localStorage or initialize empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Function to save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Function to add item to cart
  function addToCart(name, price, image) {
    if (!name || !price || isNaN(price) || price <= 0) {
      console.error('Invalid item name or price:', name, price);
      showNotification('Error adding item to cart.', 'error');
      return;
    }
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1, image });
    }
    saveCart();
    showNotification(`${name} added to cart!`, 'success');
  }

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

  // Occasion filter functionality for gifting page
  const occasionButtons = document.querySelectorAll('.occasion-btn');
  const giftCards = document.querySelectorAll('.gift-card');
  const giftBuilder = document.querySelector('.gift-builder');
  const giftGrid = document.querySelector('.gift-grid');

  let dragAndDropInitialized = false;

  if (occasionButtons.length > 0 && giftCards.length > 0) {
    occasionButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        occasionButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');

        let filterValue = this.textContent.toLowerCase();

        if (filterValue === 'diwali picks') {
          filterValue = 'diwali';
        } else if (filterValue === 'wedding hampers') {
          filterValue = 'wedding';
        } else if (filterValue === 'corporate gifting') {
          filterValue = 'corporate';
        } else if (filterValue === 'custom builder') {
          filterValue = 'custombuilder';
        }

        if (filterValue === 'custombuilder') {
          // Show gift builder and hide gift grid
          giftBuilder.style.display = 'block';
          giftGrid.style.display = 'none';

          // Initialize drag and drop functionality when gift builder is shown
          if (!dragAndDropInitialized) {
            initializeDragAndDrop();
            dragAndDropInitialized = true;
          }
        } else {
          // Hide gift builder and show gift grid with filtering
          giftBuilder.style.display = 'none';
          giftGrid.style.display = 'grid';

          giftCards.forEach(card => {
            const occasion = card.getAttribute('data-occasion') || 'all';

            if (filterValue === 'all' || occasion === filterValue) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  }

  // Function to initialize drag and drop functionality
  function initializeDragAndDrop() {
    const draggableItems = document.querySelectorAll('.draggable-item');
    const dropZone = document.getElementById('drop-zone');
    const previewBtn = document.querySelector('.preview-btn');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const boxLid = document.querySelector('.box-lid');

    let draggedItem = null;

    if (draggableItems.length > 0 && dropZone) {
      draggableItems.forEach(item => {
        item.draggable = true; // Enable dragging
        item.addEventListener('dragstart', function(e) {
          draggedItem = this;
          e.dataTransfer.effectAllowed = 'copy';
          this.style.opacity = '0.5';
        });

        item.addEventListener('dragend', function(e) {
          this.style.opacity = '1';
          draggedItem = null;
        });
      });

      dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        this.classList.add('drag-over');
      });

      dropZone.addEventListener('dragleave', function(e) {
        this.classList.remove('drag-over');
      });

      dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');

        if (draggedItem) {
          const itemName = draggedItem.getAttribute('data-item');
          const existingItem = this.querySelector(`[data-item="${itemName}"]`);

          if (!existingItem) {
            const newItem = document.createElement('div');
            newItem.textContent = itemName;
            newItem.setAttribute('data-item', itemName);
            newItem.className = 'dropped-item';
            newItem.style.cssText = `
              background-color: var(--gold);
              color: var(--bg-dark);
              padding: 0.25rem 0.5rem;
              margin: 0.25rem;
              border-radius: 5px;
              font-size: 0.8rem;
              font-weight: bold;
              display: inline-block;
            `;
            this.appendChild(newItem);
            this.classList.add('has-items');
          }
        }
      });
    }

    // Preview assembly animation
    if (previewBtn && boxLid) {
      previewBtn.addEventListener('click', function() {
        boxLid.classList.toggle('open');
        dropZone.classList.add('assemble-animation');
        setTimeout(() => {
          dropZone.classList.remove('assemble-animation');
        }, 1000);
      });
    }

    // Add custom box to cart
    if (addToCartBtn && dropZone) {
      addToCartBtn.addEventListener('click', function() {
        const items = dropZone.querySelectorAll('.dropped-item');
        if (items.length > 0) {
          const itemNames = Array.from(items).map(item => item.textContent).join(', ');
          const customBoxName = `Custom Gift Box (${itemNames})`;
          const price = 1500 + (items.length * 200); // Base price + per item
          const image = 'images/custom-gift-box.png'; // Default image for custom boxes
          addToCart(customBoxName, price, image);
          showNotification('Custom gift box added to cart!', 'success');
        } else {
          showNotification('Please add items to your custom box first.', 'error');
        }
      });
    }
  }
});
