  $('.customquickview').on('click', function () {
    var prohandle = $(this).attr('prohandle');
    $('.csutom' + prohandle).click();
  });

// addClassAndCheckPreviousInput needs the combined "brand+number" class form (e.g. "sigma123456")
function liveBrandedWholesalerValue(brand) {
  if (typeof getLiveWholesalerNumberForBrand !== 'function') {
    return (localStorage.getItem('selected_' + brand) || '').trim();
  }
  var number = getLiveWholesalerNumberForBrand(brand);
  return number ? (brand + number).trim() : '';
}

var apival = liveBrandedWholesalerValue('api');
var sigmaval = liveBrandedWholesalerValue('sigma');
var symbionval = liveBrandedWholesalerValue('symbion');
var ch2val = liveBrandedWholesalerValue('ch2');

// Function to add class and check previous input
function addClassAndCheckPreviousInput(parentSelector, className, newClass) {
  if (!className) return;

  var parent = document.querySelector(parentSelector);
  if (!parent) {
    //console.warn('Parent not found:', parentSelector);
    return;
  }

  var el = parent.querySelector('.' + className);
  if (el) {
    // Add class if not already present
    if (!el.classList.contains(newClass)) {
      el.classList.add(newClass);
     // console.log('Class added:', newClass, 'to', className, 'inside', parentSelector);
    } else {
     // console.log('Element already has class:', newClass, '->', className, 'inside', parentSelector);
    }

    // Check the previous input if it exists
    var prevInput = el.previousElementSibling;
    if (prevInput && prevInput.tagName.toLowerCase() === 'input') {
      if (!prevInput.checked) {
        prevInput.checked = true;
       // console.log('Previous input checked for', className);
      } else {
       // console.log('Previous input already checked for', className);
      }
    } else {
     // console.warn('No previous input found for', className);
    }

  } else {
   // console.warn('No element found for class inside', parentSelector + ':', className);
  }
}

// Usage
addClassAndCheckPreviousInput('.mobileseller', apival, 'custom-active');
addClassAndCheckPreviousInput('.mobileseller', sigmaval, 'custom-active');
addClassAndCheckPreviousInput('.mobileseller', symbionval, 'custom-active');
addClassAndCheckPreviousInput('.mobileseller', ch2val, 'custom-active');

// Remove 'custom-active' only from the clicked .customlable
document.querySelectorAll('.customlable').forEach(function(label) {
  label.addEventListener('click', function() {
    if (label.classList.contains('custom-active')) {
      label.classList.remove('custom-active');
    //  console.log('Removed custom-active from clicked element:', label);
    }
  });
});









// Function to trigger click inside .desktopseller
function triggerClickByClass(className) {
  if (className) {
    var parent = document.querySelector('.desktopseller');
    if (!parent) return;

    var el = parent.querySelector('.' + className);
    if (el) {
      el.click();
     // console.log('Clicked:', className);
    } else {
    //  console.warn('No element found in .desktopseller for class:', className);
    }
  }
}

// Trigger clicks
triggerClickByClass(apival);
triggerClickByClass(sigmaval);
triggerClickByClass(symbionval);
triggerClickByClass(ch2val);


function handleRadioInputClick(parentDepth) {
  return function (event) {
    var selectedval = event.target.value.toLowerCase();
    var parent = event.target.closest('.radio-input');
    for (var i = 0; i < parentDepth && parent; i++) parent = parent.parentElement;
    if (!parent) return;

    if (selectedval.includes('sigma')) applyWholesalerValue(parent, 'sigma', getLiveWholesalerNumberForBrand('sigma'));
    else if (selectedval.includes('api')) applyWholesalerValue(parent, 'api', getLiveWholesalerNumberForBrand('api'));
    else if (selectedval.includes('symbion')) applyWholesalerValue(parent, 'symbion', getLiveWholesalerNumberForBrand('symbion'));
    else if (selectedval.includes('ch2')) applyWholesalerValue(parent, 'ch2', getLiveWholesalerNumberForBrand('ch2'));
  };
}

document.querySelectorAll('.radio-input').forEach((radio) => {
  radio.addEventListener('click', handleRadioInputClick(3));
});

document.querySelectorAll('.radio-input').forEach((radio) => {
  radio.addEventListener('click', handleRadioInputClick(4));
});

document.addEventListener('click', function (event) {
  if (!event.target.classList.contains('radio-input')) return;
  if (!event.target.checked) return;

  var customval = event.target.value.toLowerCase();

  var parent = event.target.closest('#quick-view');
  if (!parent) return;

  if (customval.includes('sigma')) applyWholesalerValue(parent, 'sigma', getLiveWholesalerNumberForBrand('sigma'));
  else if (customval.includes('api')) applyWholesalerValue(parent, 'api', getLiveWholesalerNumberForBrand('api'));
  else if (customval.includes('symbion')) applyWholesalerValue(parent, 'symbion', getLiveWholesalerNumberForBrand('symbion'));
  else if (customval.includes('ch2')) applyWholesalerValue(parent, 'ch2', getLiveWholesalerNumberForBrand('ch2'));
});




    $('.custom_dropdown').change(function () {

      $(this)
        .parent()
        .find('.custom_dropdown option')
        .each(function () {
          if ($(this).is(':selected')) {
            var customval = $(this).val();
            // checked-radio lookup stays document-wide (one global header selector);
            // only the hidden-field writes are scoped to this product's container.
            var container = $(this).parent().parent().parent().parent()[0];
            if (!container) return;

            if (customval.includes('sigma')) {
              const checkedRadio = document.querySelector('.wholwseller-input.customsigma:checked');
              applyWholesalerValue(container, 'sigma', checkedRadio ? checkedRadio.value.replace('sigma', '') : '');
            } else if (customval.includes('api')) {
              const customApiRadio = document.querySelector('.wholwseller-input.customapi:checked');
              applyWholesalerValue(container, 'api', customApiRadio ? customApiRadio.value.replace('api', '') : '');
            } else if (customval.includes('symbion')) {
              const customsymbionRadio = document.querySelector('.wholwseller-input.customsymbion:checked');
              applyWholesalerValue(container, 'symbion', customsymbionRadio ? customsymbionRadio.value.replace('symbion', '') : '');
            } else if (customval.includes('ch2')) {
              const customch2Radio = document.querySelector('.wholwseller-input.customch2:checked');
              applyWholesalerValue(container, 'ch2', customch2Radio ? customch2Radio.value.replace('ch2', '') : '');
            }
          }
        });
    });

  document.addEventListener('DOMContentLoaded', function () {
    function simulateUserClick(element) {
      ['mousedown', 'mouseup', 'click'].forEach((eventType) => {
        const event = new MouseEvent(eventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1,
        });
        element.dispatchEvent(event);
      });
    }

    function checkMatchingInputs() {
      if (window.__wholesalerSyncGuard) return; // synthetic events from this same sync shouldn't re-trigger it
      window.__wholesalerSyncGuard = true;
      try {
        const checkedRadio = document.querySelector('input[name="wholeseller"]:checked');
        if (!checkedRadio) return;

        const checkedValue = checkedRadio.value;
        //console.log('Selected value: ' + checkedValue);

        // Find elements with the class and click them like a real user
        const elements = document.querySelectorAll('.' + checkedValue);
        elements.forEach((el) => {
          if (!el.checked) {
            simulateUserClick(el);
          }
        });
      } finally {
        window.__wholesalerSyncGuard = false;
      }
    }

    // Run on page load
    checkMatchingInputs();

    // Run on change
    const radios = document.querySelectorAll('input[name="wholeseller"]');
    radios.forEach((radio) => {
      radio.addEventListener('change', checkMatchingInputs);
    });
  });



  document.addEventListener('DOMContentLoaded', function () {
    function simulateUserSelect(selectElement, valueToSelect) {
      // For real <select> elements
      if (selectElement.tagName.toLowerCase() === 'select') {
        const option = Array.from(selectElement.options).find((opt) => opt.value === valueToSelect);
        if (!option) return;

        selectElement.value = valueToSelect;

        ['mousedown', 'mouseup', 'click', 'change'].forEach((eventType) => {
          const event = new Event(eventType, { bubbles: true, cancelable: true });
          selectElement.dispatchEvent(event);
        });
      } else {
        // For custom dropdown divs
        // Try clicking the option inside the custom dropdown
        const option = selectElement.querySelector(`[data-value="${valueToSelect}"]`);
        if (option) {
          option.click();
        }
      }
    }

    window.__wholesalerManualDropdowns = window.__wholesalerManualDropdowns || new WeakSet();

    // a real user pick on a product's own wholesaler dropdown must never get swept back by the global default
    document.addEventListener('change', function (e) {
      if (window.__wholesalerSyncGuard) return; // this is our own synthetic dispatch, not a real pick
      if (e.target.getAttribute && e.target.getAttribute('option-name') === 'wholesaler') {
        window.__wholesalerManualDropdowns.add(e.target);
      }
    });

    function checkMatchingDropdown() {
      if (window.__wholesalerSyncGuard) return; // synthetic events from this same sync shouldn't re-trigger it
      window.__wholesalerSyncGuard = true;
      try {
        const selectedRadio = document.querySelector('input[name="wholeseller"]:checked');
        if (!selectedRadio) return;

        const checkedValue = selectedRadio.value;
       // console.log('Selected value for dropdown: ' + checkedValue);

        const dropdowns = document.querySelectorAll('.custom_dropdown[option-name="wholesaler"]');
        dropdowns.forEach((dropdown) => {
          if (window.__wholesalerManualDropdowns.has(dropdown)) return;
          if (dropdown.value !== checkedValue) {
            simulateUserSelect(dropdown, checkedValue);
          }
        });
      } finally {
        window.__wholesalerSyncGuard = false;
      }
    }

    // Run on page load with a slight delay
    setTimeout(checkMatchingDropdown, 100); // 100ms delay to ensure dropdown is ready

    // Run on change of wholeseller radio
    const radios = document.querySelectorAll('input[name="wholeseller"]');
    radios.forEach((radio) => {
      radio.addEventListener('change', checkMatchingDropdown);
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const DELAY = 1200; // initial delay after clicking the button
    const OBSERVE_TIMEOUT = 5000; // stop observing after this many ms

    const L = (...args) => console.log('[quickview]', ...args);

    function simulateUserClick(el) {
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
        el.dispatchEvent(
          new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window,
            composed: true,
            buttons: 1,
          })
        );
      });
    }

    function triggerChange(el) {
      try {
        el.dispatchEvent(new Event('input', { bubbles: true }));
      } catch (e) {}
      try {
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {}
    }

    function findMatchingInput(wrapper, value) {
    if (!wrapper || value == null) return null;

    const normalized = ('' + value).trim().toLowerCase();

    const candidates = Array.from(
      wrapper.querySelectorAll(
        'input, label, [data-value], [data-option-value], [data-wholesale], [role="option"], .option'
      )
    );

    for (const el of candidates) {
      if (!el || el.nodeType !== 1) continue;

      const checks = [
        el.value,
        el.getAttribute?.('value'),
        el.getAttribute?.('data-value'),
        el.getAttribute?.('data-option-value'),
        el.getAttribute?.('data-wholesale'),
        el.getAttribute?.('name'),
        el.id,
        el.getAttribute?.('aria-label'),
        typeof el.textContent === 'string' ? el.textContent : null // ✅ FIX
      ];

      for (const ch of checks) {
        if (!ch) continue;

        if (('' + ch).trim().toLowerCase() === normalized) {
          if (el.tagName === 'LABEL') {
            return el.querySelector('input') || el;
          }
          return el;
        }
      }
    }

    return null;
  }
    // main
    document.querySelectorAll('.customquickview').forEach((button) => {
      button.addEventListener('click', (event) => {
        const btn = event.currentTarget;
        setTimeout(() => {
          // scope to nearest logical container OR fallback to document
          const scope = btn.closest('.quick-view-modal, .quick-view, .product-card') || document;

          // look for a checked wholeseller radio (several fallbacks)
          let checked =
            scope.querySelector('.wholeseller-wraper .radio-input:checked') ||
            document.querySelector('.wholeseller-wraper .radio-input:checked');

          if (!checked) {
            // maybe the control is not a real <input> but a custom element with .active
            checked =
              scope.querySelector(
                '.wholeseller-wraper .radio-input.active, .wholeseller-wraper .radio-input.checked'
              ) ||
              document.querySelector(
                '.wholeseller-wraper .radio-input.active, .wholeseller-wraper .radio-input.checked'
              );
          }

          if (!checked) {
            L('No checked wholeseller radio found. Candidates below:');
            const cands = scope.querySelectorAll('.wholeseller-wraper .radio-input');
            L('candidates count:', cands.length);
            cands.forEach((c, i) => L(i, 'val:', c.value || c.getAttribute('value') || c.textContent));
            return;
          }

          const value = (
            checked.value ||
            (checked.getAttribute && checked.getAttribute('data-value')) ||
            (checked.getAttribute && checked.getAttribute('value')) ||
            checked.textContent ||
            ''
          ).trim();
          L('Found wholeseller selected value ->', value);

          // find options wrapper, observe if not present
          let optionsWrapper =
            scope.querySelector('.quick-view-form__options-wrapper') ||
            document.querySelector('.quick-view-form__options-wrapper');

          if (!optionsWrapper) {
            L('Options wrapper not found yet — observing DOM for it for', OBSERVE_TIMEOUT, 'ms');
            const moTarget = document.body;
            const mo = new MutationObserver((mutations, obs) => {
              optionsWrapper =
                scope.querySelector('.quick-view-form__options-wrapper') ||
                document.querySelector('.quick-view-form__options-wrapper');
              if (optionsWrapper) {
                obs.disconnect();
                handleOptions(optionsWrapper, value);
              }
            });
            mo.observe(moTarget, { childList: true, subtree: true });
            setTimeout(() => mo.disconnect(), OBSERVE_TIMEOUT);
          } else {
            handleOptions(optionsWrapper, value);
          }

          function handleOptions(wrapper, val) {
            L('Processing options wrapper for value:', val);
            const candidate = findMatchingInput(wrapper, val);
            if (candidate) {
              L('Matched option element:', candidate);
              // Prefer clicking the label bound to the input (if exists)
              let label = null;
              if (candidate.tagName === 'INPUT') {
                label =
                  wrapper.querySelector("label[for='" + (candidate.id || '') + "']") || candidate.closest('label');
              } else if (candidate.tagName === 'LABEL') {
                label = candidate;
              }

              if (label) {
                L('Clicking label:', label);
                simulateUserClick(label);
              } else {
                L('Clicking element directly:', candidate);
                simulateUserClick(candidate);
              }

              // ensure change/input events fire and checked property set if applicable
              try {
                if (candidate.tagName === 'INPUT' && !candidate.checked) {
                  candidate.checked = true;
                }
              } catch (e) {}

              triggerChange(candidate);
              L('Action complete.');
              return;
            }

            L('No matching option found. Listing inputs/labels inside wrapper for debugging:');
            Array.from(wrapper.querySelectorAll('input, label, [data-value], .option')).forEach((el, idx) => {
              L(
                idx,
                el.tagName || el.nodeName,
                'value=',
                el.value,
                'data-value=',
                el.getAttribute && el.getAttribute('data-value'),
                'id=',
                el.id,
                'text=',
                (el.textContent || '').trim()
              );
            });

            // fallback: click first input if exists
            const first = wrapper.querySelector('input');
            if (first) {
              L('Fallback: clicking first input found in wrapper.');
              const lab = wrapper.querySelector("label[for='" + (first.id || '') + "']") || first.closest('label');
              if (lab) simulateUserClick(lab);
              else simulateUserClick(first);
              try {
                first.checked = true;
              } catch (e) {}
              triggerChange(first);
            } else {
              L('No fallback input available.');
            }
          }
        }, DELAY); // initial delay
      });
    });
  });

  document.addEventListener('click', function (event) {
    // Check if the clicked element has class .qwbtn or is inside it
    var button = event.target.closest('.qwbtn');
    if (!button) return; // exit if click is not on a .qwbtn

    event.preventDefault(); // prevent default action

    // Find the closest .quick-view__form relative to the clicked button
    var form = button.closest('.quick-view__form');
    if (!form) return;

    // Serialize form data
    var formData = new FormData(form);

    // Convert FormData to URL-encoded string
    var params = new URLSearchParams();
    formData.forEach((value, key) => {
      params.append(key, value);
    });

    // Send POST request
    fetch(form.action || '/your-post-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })
      .then((response) => response.json()) // or response.text() depending on backend
      .then((data) => {
        console.log('Form submitted successfully:', data);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      });
  });


document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('wholeseller-select');

  select.addEventListener('change', showValue);
  select.addEventListener('input', showValue);

  function showValue() {
    const selectedId = this.value; // value of the selected option

    // 1️⃣ Find the input associated with this value
    const input = document.getElementById(selectedId);

    if (input) {
      // 2️⃣ Find its label
      const label = document.querySelector(`label[for="${input.id}"]`);

      if (label) {
        // 3️⃣ Trigger click on the label
        label.click();
       // console.log("Triggered click on label for input: " + input.id);
      } else {
      //  console.log("No label found for input id: " + input.id);
      }

      // 4️⃣ Optionally, handle related menu block
      const targetBlock = document.querySelector('.header-mega-menu__block #' + selectedId);
      if (targetBlock) {
        targetBlock.classList.add('active');
    //    console.log("Activated menu block: " + selectedId);
      }
    } else {
    //  console.log("No input found with ID: " + selectedId);
    }
  }
});



document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('.wholwseller-input').forEach(input => {
    input.removeAttribute("tabindex");
  });
});


 $('.wholwseller-input').on('click', function (event) {
  let value = $(event.target).val();
  let values = $(this).attr('itemnumber');

  // If no wholesale account number → clear fields and stop
  if (!values || values.trim() === '') {
    $('.API, .Sigma, .Symbion, .Ch2').val('');
    return;
  }

  // clear all four before setting the matching one, so stale values don't linger
  $('.API, .Sigma, .Symbion, .Ch2').val('');

  if (value.includes('api')) {
    $('.API').val(values);
  } else if (value.includes('symbion')) {
    $('.Symbion').val(values);
  } else if (value.includes('ch2')) {
    $('.Ch2').val(values);
  } else if (value.includes('sigma')) {
    $('.Sigma').val(values);
  }
});

  document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    if (path === "/account/logout" || path === "/account/login") {
      localStorage.clear();
    }
  });

