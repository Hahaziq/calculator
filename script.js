document.addEventListener("DOMContentLoaded", function () {
  var typed = new Typed(".typing", {
    strings: ["RCS2405A", "2022987619"],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true,
  });
});

google.charts.load('current', { packages: ['corechart'] });

google.charts.setOnLoadCallback(function () {
  const originalPriceInput = document.getElementById('original-price');
  const discountPercentageInput = document.getElementById('discount-percentage');
  const discountedPriceInput = document.getElementById('discounted-price');
  const quantityInput = document.getElementById('quantity');
  const shippingCostInput = document.getElementById('shipping-cost');
  const taxRateInput = document.getElementById('tax-rate');
  const couponCodeInput = document.getElementById('coupon-code');
  const currencySelect = document.getElementById('currency');
  const membershipLevelSelect = document.getElementById('membership-level');

  function calculateDiscount() {
    // Reset error messages
    clearErrors();

    // Get input values
    const originalPrice = parseFloat(originalPriceInput.value);
    const discountPercentage = parseFloat(discountPercentageInput.value);
    const quantity = parseInt(quantityInput.value);
    const shippingCost = parseFloat(shippingCostInput.value);
    const taxRate = parseFloat(taxRateInput.value);
    const couponCode = couponCodeInput.value;
    const currency = currencySelect.value;
    const membershipLevel = membershipLevelSelect.value;

    // Validate inputs
    let isValid = true;

    if (isNaN(originalPrice) || originalPrice <= 0) {
      markAsInvalid(originalPriceInput, 'Invalid original price');
      isValid = false;
    }

    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      markAsInvalid(discountPercentageInput, 'Invalid discount percentage');
      isValid = false;
    }

    if (isNaN(quantity) || quantity <= 0) {
      markAsInvalid(quantityInput, 'Invalid quantity');
      isValid = false;
    }

    if (isNaN(shippingCost) || shippingCost < 0) {
      markAsInvalid(shippingCostInput, 'Invalid shipping cost');
      isValid = false;
    }

    if (isNaN(taxRate) || taxRate < 0) {
      markAsInvalid(taxRateInput, 'Invalid tax rate');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Calculate discounted price
    let discountedPrice = originalPrice - (originalPrice * discountPercentage / 100);

    // Apply additional discounts based on membership level
    if (membershipLevel === 'silver') {
      discountedPrice -= 10;
    } else if (membershipLevel === 'gold') {
      discountedPrice -= 20;
    } else if (membershipLevel === 'platinum') {
      discountedPrice -= 30;
    }

    // Calculate total price including quantity, shipping cost, and tax
    let totalPrice = discountedPrice * quantity;
    totalPrice += shippingCost;
    totalPrice += (totalPrice * taxRate / 100);

    // Display result
    discountedPriceInput.value = formatCurrency(discountedPrice, currency);
    document.getElementById('total-price').textContent = formatCurrency(totalPrice, currency);

    // Render the chart
    const data = google.visualization.arrayToDataTable([
      ['Price', 'Amount'],
      ['Original Price', originalPrice],
      ['Discounted Price', discountedPrice],
    ]);

    const options = {
      title: 'Price Comparison',
      vAxis: { title: 'Price' },
      hAxis: { title: '' },
      animation: {
        duration: 1000,
        easing: 'out',
        startup: true,
      },
      legend: { position: 'none' },
      seriesType: 'bars',
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('chart-container'));
    chart.draw(data, options);
  }

  function clearErrors() {
    originalPriceInput.classList.remove('error');
    discountPercentageInput.classList.remove('error');
    quantityInput.classList.remove('error');
    shippingCostInput.classList.remove('error');
    taxRateInput.classList.remove('error');

    const errorContainers = document.getElementsByClassName('error-message');
    Array.from(errorContainers).forEach(function (container) {
      container.textContent = '';
    });
  }

  function markAsInvalid(input, errorMessage) {
    input.classList.add('error');
    const errorContainer = document.getElementById(input.id + '-error');
    errorContainer.textContent = errorMessage;
  }

  function formatCurrency(amount, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });

    return formatter.format(amount);
  }

  document.getElementById('calculate-button').addEventListener('click', calculateDiscount);
});
