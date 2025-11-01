// Load cart from localStorage or initialize empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedDiscount = 0;
let giftWrappingCost = 0;
let bulkDiscount = 0;

// Deliverable pincodes (sample for Lucknow area)
const deliverablePincodes = [
  // Lucknow Urban & Suburban
  "226001", "226002", "226003", "226004", "226005", "226006", "226007", "226008", "226009", "226010",
  "226011", "226012", "226013", "226014", "226015", "226016", "226017", "226018", "226019", "226020",
  "226021", "226022", "226023", "226024", "226025", "226026", "226027", "226028", "226029", "226030",
  "226031", "226032", "226033", "226034", "226035", "226036", "226037", "226038", "226039", "226040",
  "226041", "226042", "226043", "226044", "226045", "226046", "226047", "226048", "226049", "226050",
  "226051", "226052", "226053", "226054", "226055", "226056", "226057", "226058", "226059", "226060",
  "226061", "226062", "226063", "226064", "226065", "226066", "226067", "226068", "226069", "226070",
  "226071", "226072", "226073", "226074", "226075", "226076", "226077", "226078", "226079", "226080",
  "226081", "226082", "226083", "226084", "226085", "226086", "226087", "226088", "226089", "226090",
  "226091", "226092", "226093", "226094", "226095", "226096", "226097", "226098", "226099", "226100",
  "226101", "226102", "226103", "226104", "227001", "227002", "227003", "227004", "227005", "227006",
  "227007", "227008", "227009", "227010", "227011", "227012", "227013", "227014", "227015", "227016",
  "227017", "227018", "227019", "227020", "227021", "227022", "227023", "227024", "227025", "227026",
  "227027", "227028", "227029", "227030", "227031", "227032", "227033", "227034", "227035", "227036",
  "227037", "227038", "227039", "227040", "227041", "227042", "227043", "227044", "227045", "227046",
  "227047", "227048", "227049", "227050", "227051", "227052", "227053", "227054", "227055", "227056",
  "227057", "227058", "227059", "227060", "227061", "227062", "227063", "227064", "227065", "227066",
  "227067", "227068", "227069", "227070", "227071", "227072", "227073", "227074", "227075", "227076",
  "227077", "227078", "227079", "227080", "227081", "227082", "227083", "227084", "227085", "227086",
  "227087", "227088", "227089", "227090", "227091", "227092", "227093", "227094", "227095", "227096",
  "227097", "227098", "227099", "227100", "227101", "227102", "227103", "227104", "227105", "227106",
  "227107", "227108", "227109", "227110", "227111", "227112", "227113", "227114", "227115", "227116",
  "227117", "227118", "227119", "227120", "227121", "227122", "227123", "227124", "227125", "227126",
  "227127", "227128", "227129", "227130", "227131", "227132", "227133", "227134", "227135", "227136",
  "227137", "227138", "227139", "227140", "227141", "227142", "227143", "227144", "227145", "227146",
  "227147", "227148", "227149", "227150", "227151", "227152", "227153", "227154", "227155", "227156",
  "227157", "227158", "227159", "227160", "227161", "227162", "227163", "227164", "227165", "227166",
  "227167", "227168", "227169", "227170", "227171", "227172", "227173", "227174", "227175", "227176",
  "227177", "227178", "227179", "227180", "227181", "227182", "227183", "227184", "227185", "227186",
  "227187", "227188", "227189", "227190", "227191", "227192", "227193", "227194", "227195", "227196",
  "227197", "227198", "227199", "227200", "227201", "227202", "227203", "227204", "227205", "227206",
  "227207", "227208", "227209", "227210", "227211", "227212", "227213", "227214", "227215", "227216",
  "227217", "227218", "227219", "227220", "227221", "227222", "227223", "227224", "227225", "227226",
  "227227", "227228", "227229", "227230", "227231", "227232", "227233", "227234", "227235", "227236",
  "227237", "227238", "227239", "227240", "227241", "227242", "227243", "227244", "227245", "227246",
  "227247", "227248", "227249", "227250", "227251", "227252", "227253", "227254", "227255", "227256",
  "227257", "227258", "227259", "227260", "227261", "227262", "227263", "227264", "227265", "227266",
  "227267", "227268", "227269", "227270", "227271", "227272", "227273", "227274", "227275", "227276",
  "227277", "227278", "227279", "227280", "227281", "227282", "227283", "227284", "227285", "227286",
  "227287", "227288", "227289", "227290", "227291", "227292", "227293", "227294", "227295", "227296",
  "227297", "227298", "227299", "227300", "227301", "227302", "227303", "227304", "227305", "227306",
  "227307", "227308",

  // Hardoi District
  "241202", "241204", "241001", "241002", "241003", "241004", "241005", "241006", "241007", "241008",
  "241009", "241010",
  "241201", "241203", "241205", "241206", "241207", "241208", "241209", "241210", "241211", "241212",
  "241213", "241214", "241215", "241216", "241217", "241218", "241219", "241220", "241221", "241222",
  "241223", "241224", "241225", "241226", "241227", "241228", "241229", "241230", "241231", "241232",
  "241233", "241234", "241235", "241236", "241237", "241238", "241239", "241240", "241241", "241242",
  "241243", "241244", "241245", "241246", "241247", "241248", "241249", "241250", "241251", "241252",
  "241253", "241254", "241255", "241256", "241257", "241258", "241259", "241260", "241261", "241262",
  "241263", "241264", "241265", "241266", "241267", "241268", "241269", "241270", "241271", "241272",
  "241273", "241274", "241275", "241276", "241277", "241278", "241279", "241280", "241281", "241282",
  "241283", "241284", "241285", "241286", "241287", "241288", "241289", "241290", "241291", "241292",
  "241293", "241294", "241295", "241296", "241297", "241298", "241299", "241300", "241301", "241302",
  "241303", "241304", "241305", "241306", "241307", "241308", "241309", "241310", "241311", "241312",
  "241313", "241314", "241315", "241316", "241317", "241318", "241319", "241320", "241321", "241322",
  "241323", "241324", "241325", "241326", "241327", "241328", "241329", "241330", "241331", "241332",
  "241333", "241334", "241335", "241336", "241337", "241338", "241339", "241340", "241341", "241342",
  "241343", "241344", "241345", "241346", "241347", "241348", "241349", "241350", "241351", "241352",
  "241353", "241354", "241355", "241356", "241357", "241358", "241359", "241360", "241361", "241362",
  "241363", "241364", "241365", "241366", "241367", "241368", "241369", "241370", "241371", "241372",
  "241373", "241374", "241375", "241376", "241377", "241378", "241379", "241380", "241381", "241382",
  "241383", "241384", "241385", "241386", "241387", "241388", "241389", "241390", "241391", "241392",
  "241393", "241394", "241395", "241396", "241397", "241398", "241399", "241400", "241401", "241402",
  "241403", "241404", "241405"

]
// Function to render order summary
function renderOrderSummary() {
  const orderItems = document.getElementById('order-items');
  const totalAmount = document.getElementById('total-amount');
  const discountInfo = document.getElementById('discount-info');
  const bulkDiscountInfo = document.getElementById('bulk-discount-info');
  orderItems.innerHTML = '';
  let originalTotal = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`;
    orderItems.appendChild(li);
    originalTotal += item.price * item.quantity;
  });

  // Add gift wrapping cost to original total if selected
  const giftWrappingCheckbox = document.getElementById('gift-wrapping');
  if (giftWrappingCheckbox && giftWrappingCheckbox.checked) {
    originalTotal += 50;
    giftWrappingCost = 50;
  } else {
    giftWrappingCost = 0;
  }

  let total = originalTotal;

  // Calculate bulk discount (10% off for 5+ items)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems >= 5) {
    bulkDiscount = total * 0.1;
    total -= bulkDiscount;
    bulkDiscountInfo.textContent = `Bulk Discount: 10% off for 5+ items (₹${bulkDiscount})`;
    bulkDiscountInfo.style.display = 'block';
  } else {
    bulkDiscount = 0;
    bulkDiscountInfo.style.display = 'none';
  }

  // Apply coupon discount if any
  let couponDiscountAmount = 0;
  if (appliedDiscount > 0) {
    couponDiscountAmount = total * (appliedDiscount / 100);
    total -= couponDiscountAmount;
    discountInfo.textContent = `Coupon Discount: ${appliedDiscount}% off (₹${couponDiscountAmount})`;
    discountInfo.style.display = 'block';
  } else {
    discountInfo.style.display = 'none';
  }

  // Update total display
  if (total < originalTotal) {
    totalAmount.innerHTML = `<strong>Total: ₹${total} <span style="text-decoration: line-through; color: #888;">(was ₹${originalTotal})</span></strong>`;
  } else {
    totalAmount.innerHTML = `<strong>Total: ₹${total}</strong>`;
  }
}

// Function to update total when gift wrapping is toggled
function updateTotal() {
  renderOrderSummary();
}

// Function to apply coupon
function applyCoupon(event) {
  event.preventDefault();
  const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
  const couponResult = document.getElementById('coupon-result');

  // Calculate current total before discount (including gift wrapping)
  let currentTotal = 0;
  cart.forEach(item => {
    currentTotal += item.price * item.quantity;
  });
  if (giftWrappingCost > 0) {
    currentTotal += giftWrappingCost;
  }

  // Coupon validation with conditions (in a real app, this would be server-side)
  const validCoupons = {
    'WELCOME150': { discount: 15, minTotal: 1000 },
    'SAVE100': { discount: 10, minTotal: 800 },
    'HEALTHY50': { discount: 5, minTotal: 500 },
    'NUTRISYNC20': { discount: 20, minTotal: 200 }
  };

  if (validCoupons[couponCode]) {
    if (currentTotal >= validCoupons[couponCode].minTotal) {
      appliedDiscount = validCoupons[couponCode].discount;
      couponResult.textContent = `Coupon applied! ${appliedDiscount}% discount.`;
      couponResult.style.color = 'green';
      renderOrderSummary();
    } else {
      couponResult.textContent = `Coupon requires minimum order of ₹${validCoupons[couponCode].minTotal}.`;
      couponResult.style.color = 'red';
    }
  } else if (couponCode === '') {
    couponResult.textContent = 'Please enter a coupon code.';
    couponResult.style.color = 'red';
  } else {
    couponResult.textContent = 'Invalid coupon code.';
    couponResult.style.color = 'red';
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

// Function to handle payment
function handlePayment() {
  const form = document.querySelector('.checkout-form');
  if (!form.checkValidity()) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }

  if (cart.length === 0) {
    showNotification('Your cart is empty. Add items to proceed.', 'error');
    return;
  }

  // Additional validation for billing and shipping details
  const requiredFields = [
    'name', 'email', 'phone', 'address', 'city', 'state', 'pincode'
  ];

  let allFieldsFilled = true;
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) {
      allFieldsFilled = false;
      if (field) {
        field.style.borderColor = 'red';
      }
    } else {
      if (field) {
        field.style.borderColor = '';
      }
    }
  });

  if (!allFieldsFilled) {
    showNotification('Please fill in all billing and shipping details.', 'error');
    return;
  }

  // Validate pincode for delivery
  const pincode = document.getElementById('pincode').value.trim();
  if (!deliverablePincodes.includes(pincode)) {
    showNotification('Delivery not possible for this pincode. Please change location.', 'error');
    return;
  }

  // Store order details in localStorage before proceeding to payment
  const orderDetails = {
    items: cart,
    appliedDiscount: appliedDiscount,
    bulkDiscount: bulkDiscount,
    giftWrapping: giftWrappingCost > 0,
    total: parseFloat(document.getElementById('total-amount').textContent.replace('₹', '')),
    date: new Date().toISOString(),
    billingDetails: {
      name: document.getElementById('name').value,
      // email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      pincode: document.getElementById('pincode').value
    }
  };
  localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));

  // Simulate payment processing
  showNotification('Processing payment...', 'info');

  setTimeout(() => {
    // Clear cart after successful payment
    localStorage.removeItem('cart');
    cart = [];
    renderOrderSummary();
    showNotification('Payment successful! Thank you for your order.', 'success');

    // Redirect to payment page
    window.location.href = 'payment.html';
  }, 2000);
}

// Function to auto-fill location
function autoFillLocation() {
  console.log('Auto-fill location button clicked');
  if (navigator.geolocation) {
    console.log('Geolocation supported, requesting position...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Position obtained:', latitude, longitude);
        try {
          // Use a reverse geocoding API (OpenStreetMap Nominatim is free)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          console.log('API response status:', response.status);
          const data = await response.json();
          console.log('API data:', data);

          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || '';
            const state = data.address.state || data.address.state_district || '';
            const postcode = data.address.postcode || '';

            console.log('Extracted location:', { city, state, postcode });

            document.getElementById('city').value = city;
            document.getElementById('state').value = state;
            document.getElementById('pincode').value = postcode;

            showNotification('Location filled successfully!', 'success');
          } else {
            console.error('No address data in response');
            showNotification('Unable to retrieve location details.', 'error');
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          showNotification('Error retrieving location. Please try again.', 'error');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        showNotification(errorMessage, 'error');
      }
    );
  } else {
    console.error('Geolocation not supported');
    showNotification('Geolocation is not supported by this browser.', 'error');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  renderOrderSummary();

  const payBtn = document.querySelector('.pay-btn');
  payBtn.addEventListener('click', handlePayment);

  const autoFillBtn = document.getElementById('auto-fill-location');
  autoFillBtn.addEventListener('click', autoFillLocation);

  // Coupon form is handled by onsubmit

  // Allow applying coupon on Enter key press
  const couponInput = document.getElementById('coupon-code');
  couponInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      applyCoupon(e);
    }
  });
});
