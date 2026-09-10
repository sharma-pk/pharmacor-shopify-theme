 

 (function () {
  const removeDisabled = () => {
    document.querySelectorAll('[disabled]').forEach(el => {
      // Skip sold-out add-to-cart buttons - they should stay disabled
      if (el.classList.contains('custom_add_to-Cart_button') && el.closest('.custom_product-section')) {
        return;
      }
      // Skip buttons currently in loading/adding state
      if (el.classList.contains('atc-loading')) {
        return;
      }
      el.removeAttribute('disabled');
      el.disabled = false;
    });
  };

  // 1️⃣ Remove on page load / refresh
  document.addEventListener('DOMContentLoaded', removeDisabled);

  // 2️⃣ Remove on any click
  document.addEventListener('click', removeDisabled);

  // 3️⃣ Prevent future additions (Shopify / JS safe)
  const observer = new MutationObserver(removeDisabled);
  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ['disabled']
  });
})();


  document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return; // prevents error if element not on page

  searchInput.addEventListener('input', function () {
    const searchVal = this.value.trim().toLowerCase();
    const products = document.querySelectorAll('.custom-main-inner-wrap');

    products.forEach(function (product) {
      const title = (product.getAttribute('data-title') || '').toLowerCase();

      if (searchVal === '' || title.includes(searchVal)) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  });
});


  var legacySearchInput = document.getElementById('searchInput');
  if (legacySearchInput) legacySearchInput.addEventListener('input', function () {
    var searchVal = this.value.trim();
    var allTabs = document.querySelectorAll('.nav-tabs .tab-btn');
    var allProductsBtn = document.querySelector(".nav-tabs .tab-btn[onclick*='custom-all']");
    if (!allProductsBtn) return;

    if (searchVal.length > 0) {
      // sab tabs hide karo
      allTabs.forEach(function (btn) {
        btn.classList.add('myhidden');
        btn.classList.remove('active-tab');
      });

      // All Products ko dikhana aur activate karna
      allProductsBtn.classList.remove('myhidden');
      allProductsBtn.classList.add('active-tab');

      // uska click trigger bhi karo
      allProductsBtn.click();
    } else {
      // sab tabs wapas show karo
      allTabs.forEach(function (btn, index) {
        btn.classList.remove('myhidden');
        btn.classList.remove('active-tab');
      });

      // pehli tab ko wapas active aur click karo
      let firstTab = allTabs[0];
      if (firstTab) {
        firstTab.classList.add('active-tab');
        firstTab.click();
      }

      // All Products tab ko wapas hide karo
      allProductsBtn.classList.add('myhidden');
      allProductsBtn.classList.remove('active-tab');
    }
  });
  document.addEventListener('DOMContentLoaded', function () {

  function initLoadMore(wrapperSelector, buttonSelector, initialVisible = 10, increment = 10) {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;

    const items = wrapper.querySelectorAll('.collection__item');
    const loadMoreBtn = document.querySelector(buttonSelector);
    if (!loadMoreBtn) return;

    let visible = initialVisible;

    // Hide all items initially
    items.forEach(item => item.style.display = 'none');

    // Show initial items
    for (let i = 0; i < visible && i < items.length; i++) {
      items[i].style.display = 'block';
    }

    // Hide button if not enough items
    if (items.length <= visible) loadMoreBtn.style.display = 'none';

    // Load more on button click
    loadMoreBtn.addEventListener('click', function () {
      const nextVisible = visible + increment;
      for (let i = visible; i < nextVisible && i < items.length; i++) {
        items[i].style.display = 'block';
      }
      visible = nextVisible;

      // Hide button if all items are shown
      if (visible >= items.length) loadMoreBtn.style.display = 'none';
    });
  }

  // Initialize for your dynamic wrapper
  initLoadMore('#dynamic', '.loadMore', 10, 10);

});


//collection

document.addEventListener('DOMContentLoaded', function () {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;

                // Check if the predictive-search product row is added and active
                const activeRow = node.matches('.js-predictive-search-result-row.is-active') 
                    ? node 
                    : node.querySelector('.js-predictive-search-result-row.is-active');

                if (activeRow) {
                    console.log('Predictive search product row is now visible!');

                    const selectedWholeseller = localStorage.getItem('selected_wholeseller');
                    console.log('Selected wholeseller:', selectedWholeseller);

                    // Loop through all product columns
                    const products = activeRow.querySelectorAll('.predictive-search__result-col');

                    products.forEach(product => {
                        let inputToClick = null;

                        if (selectedWholeseller) {
                            // Try to find input matching the selected wholeseller
                            inputToClick = product.querySelector(
                                `.radioinput.${selectedWholeseller.toLowerCase()}`
                            );
                        }

                        // If no matching input found, select the first radio input
                        if (!inputToClick) {
                            inputToClick = product.querySelector('.radioinput');
                        }

                        if (inputToClick) {
                            inputToClick.click();
                            console.log(`Clicked radio input for product: ${inputToClick.value}`);
                        } else {
                            console.log('No radio input found for this product');
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});






/* =====================================================
   YOUR CLEAR CART CODE (UNCHANGED)
===================================================== */


