// q & a section
function toggleFAQ(header) {
  const answer = header.nextElementSibling;
  answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
}

// auto slider
let currentSlide = 0;
let slides = [];
let dots = [];

function initializeSlider() {
  slides = document.querySelectorAll('.slide');
  dots = document.querySelectorAll('.dot');

  if (slides.length === 0 || dots.length === 0) {
    console.error('Slides or dots not found');
    return;
  }

  // Set initial active slide
  showSlide(0);
}

function showSlide(index) {
  if (slides.length === 0 || dots.length === 0) return;

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  if (slides.length === 0) return;
  const nextIndex = (currentSlide + 1) % slides.length;
  showSlide(nextIndex);
}

// Initialize slider when DOM is loaded (only if slider elements exist)
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelectorAll('.slide').length > 0 && document.querySelectorAll('.dot').length > 0) {
    initializeSlider();
    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
  }
});



document.addEventListener('DOMContentLoaded', function() {
  // Load cart from localStorage or initialize empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Function to save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Function to add item to cart
  function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1, image });
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
          const image = productCard.querySelector('img').src;
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
                addToCart(name, price, image);
              } else {
                console.error('Invalid price for product:', name, priceText);
              }
            } else {
              console.error('Price not found for product:', name);
            }
          } else {
            console.error('Price element not found for product:', name);
          }
        } else {
          console.error('Product card not found for button');
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

  // Filter functionality for shop page
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        productCards.forEach(card => {
          const categories = card.getAttribute('data-category') || '';
          const categoryArray = categories.split(' ');

          if (filterValue === 'all' || categoryArray.includes(filterValue)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});


// Delivery location checker with map integration

let map;
let userMarker;
let serviceableZones = [];

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('map')) {
    initializeMap();
  }
});

function initializeMap() {
  // Center on Lucknow, India
  map = L.map('map').setView([26.8467, 80.9462], 9);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Define serviceable zones (approximate polygons for Lucknow and Hardoi)
  const lucknowZone = [
    [26.7, 80.8],
    [26.7, 81.1],
    [26.9, 81.1],
    [26.9, 80.8]
  ];

  const hardoiZone = [
    [27.2, 80.0],
    [27.2, 80.5],
    [27.5, 80.5],
    [27.5, 80.0]
  ];

  // Add Lucknow zone
  const lucknowPolygon = L.polygon(lucknowZone, {color: 'green', fillColor: 'green', fillOpacity: 0.2}).addTo(map);
  lucknowPolygon.bindPopup("Serviceable Zone: Lucknow District");
  serviceableZones.push(lucknowPolygon);

  // Add Hardoi zone
  const hardoiPolygon = L.polygon(hardoiZone, {color: 'blue', fillColor: 'blue', fillOpacity: 0.2}).addTo(map);
  hardoiPolygon.bindPopup("Serviceable Zone: Hardoi District");
  serviceableZones.push(hardoiPolygon);

  // Add click handler for dropping pins
  map.on('click', function(e) {
    dropPin(e.latlng);
  });

  // Auto-detect button
  document.getElementById('auto-detect-btn').addEventListener('click', autoDetectLocation);
}

function dropPin(latlng) {
  // Remove existing user marker
  if (userMarker) {
    map.removeLayer(userMarker);
  }

  // Add new marker
  userMarker = L.marker(latlng).addTo(map);
  userMarker.bindPopup("Your selected location").openPopup();

  // Check if within serviceable zone
  checkLocationInZone(latlng);
}

function checkLocationInZone(latlng) {
  const result = document.getElementById('delivery-result');
  let inZone = false;
  let zoneName = '';

  serviceableZones.forEach(zone => {
    if (zone.getBounds().contains(latlng)) {
      inZone = true;
      zoneName = zone.getPopup().getContent().split(': ')[1];
    }
  });

  if (inZone) {
    result.innerHTML = `✅ Delivery available in ${zoneName}! Estimated time: <strong>2–5 days</strong>`;
  } else {
    result.innerHTML = `❌ Sorry, we don’t currently deliver to this location.`;
  }
}

function autoDetectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latlng = [position.coords.latitude, position.coords.longitude];
      map.setView(latlng, 13);
      dropPin(L.latLng(latlng));
    }, function(error) {
      alert('Unable to retrieve your location. Please allow location access.');
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function checkDelivery(event) {
  event.preventDefault();
  const pincode = document.getElementById('pincode').value;
  const result = document.getElementById('delivery-result');

  // Expanded serviceable pincodes for Lucknow and Hardoi
  const deliveryTimes = {
    // Lucknow City
    '226001': '2–3 days (Lucknow GPO)',
    '226002': '2–3 days (Aminabad)',
    '226003': '2–3 days (Chowk)',
    '226004': '2–3 days (Alambagh)',
    '226005': '2–3 days (Indira Nagar)',
    '226006': '2–3 days (Gomti Nagar)',
    '226007': '2–3 days (Rajajipuram)',
    '226010': '2–3 days (Jankipuram)',
    '226012': '2–3 days (Vikas Nagar)',

    // Lucknow Suburban / Nearby Towns
    '226021': '3–4 days (Malihabad)',
    '226201': '3–4 days (Bakshi Ka Talab)',
    '226028': '3–4 days (Chinhat)',
    '226031': '3–4 days (Kursi Road)',
    '227105': '3–4 days (Gosainganj)',
    '227107': '3–4 days (Mohanlalganj)',

    // Hardoi District
    '241001': '3–5 days (Hardoi City)',
    '241123': '3–5 days (Sandila)',
    '241202': '3–5 days (Bharawan)',
    '241304': '3–5 days (Bilgram)',
    '241126': '3–5 days (Pihani)',
    '241402': '3–5 days (Shahabad)'
  };

  if (deliveryTimes[pincode]) {
    result.innerHTML = `✅ Delivery available! Estimated time: <strong>${deliveryTimes[pincode]}</strong>`;
  } else {
    result.innerHTML = `❌ Sorry, we don’t currently deliver to this pincode.`;
  }
}
