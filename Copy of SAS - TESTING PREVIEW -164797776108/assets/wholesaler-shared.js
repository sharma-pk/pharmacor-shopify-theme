// Shared wholesaler-account helpers used across custom-style.js, theme.liquid,
// header-menu.liquid, header-mobile-menu-list.liquid and sections/header.liquid.
// Edit here once instead of in each file separately.

// CSS class names Liquid actually renders (case-sensitive, must match the markup exactly) — not the same thing as the lowercase brand keys below
var WHOLESALER_BRAND_CLASS = { api: 'API', sigma: 'Sigma', symbion: 'Symbion', ch2: 'Ch2' };

// single priority order used everywhere a default brand is picked (cart-reconciliation, header widget, card first-paint) — always lowercase; this is the internal brand key, distinct from WHOLESALER_BRAND_CLASS's casing
var WHOLESALER_BRAND_PRIORITY = ['api', 'sigma', 'symbion', 'ch2'];

// derives a brand key from free text (a value, label, or option text) by case-insensitive substring match against WHOLESALER_BRAND_PRIORITY, in priority order — the one place raw/mixed-case text gets normalized into the lowercase brand key; everything downstream only ever deals with that normalized key, never raw text again
function resolveWholesalerBrand(text) {
  var upper = (text || '').toString().toUpperCase();
  for (var i = 0; i < WHOLESALER_BRAND_PRIORITY.length; i++) {
    if (upper.indexOf(WHOLESALER_BRAND_PRIORITY[i].toUpperCase()) !== -1) return WHOLESALER_BRAND_PRIORITY[i];
  }
  return '';
}

// account numbers can be alphanumeric — this only strips stray whitespace/newlines baked into a Liquid-rendered attribute, never real characters
function sanitizeWholesalerNumber(value) {
  return (value || '').toString().replace(/\s+/g, '');
}

function isWholesalerCovered(value) {
  if (!value) return false;
  if (!window.__wholesalerCoverage || window.__wholesalerCoverage.length === 0) {
    return true; // no coverage data loaded yet — don't wipe a cached value based on that
  }
  var v = value.toLowerCase();
  return window.__wholesalerCoverage.some(function (covered) {
    return covered.indexOf(v.replace(/[0-9]/g, '').trim()) !== -1 || v.indexOf(covered) !== -1;
  });
}

// Reads localStorage's cached value for a brand and strips the brand name out of it.
function getWholesalerCachedValue(brand) {
  var raw = localStorage.getItem('selected_' + brand) || '';
  return raw.replace(new RegExp(brand, 'gi'), '').trim();
}

// live account number for a brand: active-brand override first, then this brand's own remembered number (independent of which brand is active), then its first coverage match
function getLiveWholesalerNumberForBrand(brand) {
  var override = (typeof resolveSelectedWholesalerAccountOverride === 'function') ? resolveSelectedWholesalerAccountOverride() : null;
  if (override && override.brand === brand) return override.number;

  var remembered = sanitizeWholesalerNumber((localStorage.getItem('selected_' + brand) || '').replace(new RegExp(brand, 'gi'), ''));
  if (remembered && isWholesalerCovered(brand + remembered)) return remembered;

  var coverage = window.__wholesalerCoverage || [];
  var match = coverage.filter(function (item) { return item.indexOf(brand) !== -1; })[0];
  if (!match) return '';
  return sanitizeWholesalerNumber(match.replace(new RegExp(brand, 'gi'), ''));
}

function getCookie(name) {
  var nameEQ = name + '=';
  var parts = document.cookie.split(';');
  for (var i = 0; i < parts.length; i++) {
    var c = parts[i].trim();
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

// resolves the customer's picked number (per-number selector) so we can override Liquid's first-match default
function resolveSelectedWholesalerAccountOverride() {
  var chosenNumber = getCookie('wholesaler_selected_number') || localStorage.getItem('selected_country');
  if (!chosenNumber) return null;

  var coverage = window.__wholesalerCoverage || [];
  var chosenLower = chosenNumber.toLowerCase().replace(/\s+/g, '').trim();
  // exact match only, in either "brand+number" or bare-number form — was a substring match, so "1" could match "123456"
  var match = coverage.filter(function (item) {
    var itemClean = item.replace(/\s+/g, '');
    if (itemClean === chosenLower) return true; // full "brand+number" form
    var itemNumber = itemClean.replace(/api|sigma|symbion|ch2/gi, '');
    return itemNumber === chosenLower; // bare-number form
  })[0];
  if (!match) return null;

  var brand = null;
  if (match.indexOf('api') !== -1) brand = 'api';
  else if (match.indexOf('sigma') !== -1) brand = 'sigma';
  else if (match.indexOf('symbion') !== -1) brand = 'symbion';
  else if (match.indexOf('ch2') !== -1) brand = 'ch2';
  if (!brand) return null;

  var number = sanitizeWholesalerNumber(match.replace(/api|sigma|symbion|ch2/gi, ''));
  return { brand: brand, number: number };
}

// Only overwrites the number on whichever brand field Liquid already populated (never switches brand); routed per card/form scope through applyWholesalerValue() so sibling brand fields get cleared too, instead of leaving stale ones that could produce two populated brands on one cart line.
function applyWholesalerNumberOverride() {
  var override = resolveSelectedWholesalerAccountOverride();
  if (!override) return;

  var targetClass = WHOLESALER_BRAND_CLASS[override.brand];
  if (!targetClass) return;

  var fields = document.querySelectorAll('.' + targetClass);
  var scopes = [];
  var fieldsArr = fields.forEach ? fields : Array.prototype.slice.call(fields);
  fieldsArr.forEach(function (field) {
    if (!field.value) return; // blank means this product/card isn't using this brand — leave it alone
    var scope = field.closest('.custom-main-inner-wrap') || field.closest('form') || document;
    if (scopes.indexOf(scope) === -1) scopes.push(scope);
  });

  scopes.forEach(function (scope) {
    applyWholesalerValue(scope, override.brand, override.number);
  });
}

// re-enabled — the earlier corruption was from the unrelated custom-style.js dropdown-sync loop (now fixed), not this function
document.addEventListener('DOMContentLoaded', applyWholesalerNumberOverride);

// Clears all four wholesaler fields inside `scope` (defaults to the whole
// document), then sets the one matching `brand` to `value`.
// Uses querySelectorAll because some card templates render duplicate hidden
// forms (e.g. a visible form plus a hidden zero-width fallback form) that
// both carry the same .API/.Sigma/.Symbion/.Ch2 classes — all copies need
// to stay in sync, not just whichever one querySelector finds first.
function applyWholesalerValue(scope, brand, value) {
  var root = scope || document;
  Object.keys(WHOLESALER_BRAND_CLASS).forEach(function (key) {
    var els = root.querySelectorAll('.' + WHOLESALER_BRAND_CLASS[key]);
    els.forEach(function (el) { el.value = ''; });
  });

  var targetClass = WHOLESALER_BRAND_CLASS[brand];
  if (!targetClass) return;
  var targets = root.querySelectorAll('.' + targetClass);
  targets.forEach(function (target) { target.value = sanitizeWholesalerNumber(value); });
}

// single entry point every wholesaler brand-picker (dropdown, radio, Shopify variant option) should call on change — replaces each page re-implementing "figure out the brand, find the scope, apply it"
function handleWholesalerSelectionChange(el) {
  if (!el) return;
  var raw = el.value || el.getAttribute('data-option-value') || el.textContent || '';
  var brand = resolveWholesalerBrand(raw);
  if (!brand) return;
  var scope = el.closest('.custom-main-inner-wrap') || el.closest('.custom-variant') || el.form || el.closest('form') || document;
  applyWholesalerValue(scope, brand, getLiveWholesalerNumberForBrand(brand));
}

// exact match by number (itemnumber attribute) among .wholwseller-input elements — was a CSS attribute-contains selector ([itemnumber*="1"] matched "123456" too); pass an explicit candidates list (e.g. only the currently-visible brand's items) to avoid matching a different brand's number that happens to share a value; defaults to every .wholwseller-input on the page
function findWholesellerInputByNumber(number, candidates) {
  if (!number) return null;
  var list = candidates || document.querySelectorAll('.wholwseller-input');
  for (var i = 0; i < list.length; i++) {
    if ((list[i].getAttribute('itemnumber') || '').trim() === number) return list[i];
  }
  return null;
}

// True unless there's clear evidence this card's own Wholesaler selector doesn't list `brand` — used only to stop a site-wide brand switch (the header widget) from overwriting a card that never offered that brand. Fails open (returns true) whenever it can't positively identify the card's Wholesaler selector, rather than guessing.
function cardSupportsWholesalerBrand(scope, brand) {
  if (!scope || scope === document || !WHOLESALER_BRAND_CLASS[brand]) return true;

  // explicit marker first — <option data-brand="..."> is ground truth when Liquid rendered it, no guessing needed
  var brandedOptions = scope.querySelectorAll('option[data-brand]');
  if (brandedOptions.length) {
    var markedFound = false;
    brandedOptions.forEach(function (opt) { if (opt.getAttribute('data-brand') === brand) markedFound = true; });
    return markedFound;
  }

  // fallback: the wholesaler <select> specifically, identified by its options carrying a known brand class — not just any select carrying the shared "custom-list-wholesaler" class, which every option's select gets, wholesaler or not
  var selects = scope.querySelectorAll('select');
  for (var i = 0; i < selects.length; i++) {
    var hasAnyBrandOption = WHOLESALER_BRAND_PRIORITY.some(function (b) { return selects[i].querySelector('option.custom' + b); });
    if (hasAnyBrandOption) return !!selects[i].querySelector('option.custom' + brand);
  }

  // fallback: radio-based cards — only trust this if at least one radio in the group actually looks like a wholesaler brand (otherwise it's a Size/Color group, not Wholesaler)
  var radios = scope.querySelectorAll('.radioinput, .radio-input');
  var looksLikeWholesalerGroup = false;
  var found = false;
  radios.forEach(function (r) {
    var b = resolveWholesalerBrand(r.value);
    if (b) looksLikeWholesalerGroup = true;
    if (b === brand) found = true;
  });
  if (looksLikeWholesalerGroup) return found;

  return true; // no recognizable Wholesaler selector found — don't guess, leave existing behavior alone
}

// Cart-line merge logic, shared by layout/theme.liquid (cart-page variant
// change) and sections/product-template.liquid (product-page add-to-cart).

// deterministic _line_uid (same shape as the old random one) so identical lines can merge
function computeLineUid(variantId, brand, value) {
  var raw = variantId + '|' + brand + '|' + sanitizeWholesalerNumber(value);
  var hash = 0;
  for (var i = 0; i < raw.length; i++) {
    hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  }
  var part1 = String(hash).padStart(13, '0').slice(-13);
  var part2 = hash.toString(36).padStart(8, '0').slice(-8);
  return part1 + '_' + part2;
}

// fetches the product and computes Saving Per Item for one of its variants
function computeSavingPercentForVariant(productHandle, variantId) {
  return fetch('/products/' + productHandle + '.js')
    .then(function (r) { return r.json(); })
    .then(function (productData) {
      var variant = productData.variants.find(function (v) { return v.id === Number(variantId); });
      if (!variant) return '';
      var price = variant.price / 100;
      var compare = (variant.compare_at_price || 0) / 100;
      return compare > price ? (((compare - price) / compare) * 100).toFixed(2) + '%' : '';
    })
    .catch(function () {
      return '';
    });
}

var MERGE_COMPARISON_PROPERTY_KEYS = [
  'Wholesaler Account No.1',
  'Wholesaler Account No.2',
  'Wholesaler Account No.3',
  'Wholesaler Account No.4',
  'Delivery Date',
  'subscription',
  'Shipping Option',
  '_line_uid'
];

var WHOLESALER_NUMBER_PROPERTY_KEYS = [
  'Wholesaler Account No.1',
  'Wholesaler Account No.2',
  'Wholesaler Account No.3',
  'Wholesaler Account No.4'
];

function normalizeLineProperties(properties) {
  var source = properties || {};
  var result = {};
  MERGE_COMPARISON_PROPERTY_KEYS.forEach(function (key) {
    var value = source[key] || '';
    result[key] = WHOLESALER_NUMBER_PROPERTY_KEYS.indexOf(key) !== -1 ? sanitizeWholesalerNumber(value) : value;
  });
  // carry forward anything else not in the known list (e.g. bundle-app properties)
  Object.keys(source).forEach(function (key) {
    if (!(key in result)) result[key] = source[key];
  });
  return result;
}

// call right after two lines merge, to refresh Saving Per Item for the combined line
// (based only on price vs compare_at_price — not quantity-tier-aware, so usually a no-op)
function recalculateSavingPerItemAfterMerge(lineKey, productHandle, variantId) {
  return fetch('/cart.js', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (cart) {
      var line = cart.items.find(function (i) { return i.key === lineKey; });
      if (!line) return;

      return computeSavingPercentForVariant(productHandle, variantId).then(function (savingPerItem) {
        var updatedProperties = Object.assign({}, line.properties, { 'Saving Per Item': savingPerItem });
        return fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: lineKey, quantity: line.quantity, properties: updatedProperties })
        });
      });
    });
}

// ============================================================
// Shared add-to-cart property builder, used by every collection/search/
// welcome/favourites .custom-carttt / .custom-btn-boxes click handler.
// Works with either a native form Element or a jQuery-wrapped form.
// ============================================================
function _wholesalerFieldValue(parentForm, selector) {
  if (parentForm.querySelector) {
    var el = parentForm.querySelector(selector);
    return (el && el.value) || '';
  }
  return parentForm.find(selector).val() || '';
}

function _wholesalerFieldAttr(parentForm, selector, attr) {
  if (parentForm.querySelector) {
    var el = parentForm.querySelector(selector);
    return (el && el.getAttribute(attr)) || '';
  }
  return parentForm.find(selector).attr(attr) || '';
}

// resolves the variant id from whichever class actually exists in this card template
function resolveWholesalerVariantId(parentForm) {
  return _wholesalerFieldValue(parentForm, '.cusotm-cart-id') || _wholesalerFieldValue(parentForm, '.custom-idd');
}

// builds the full, merge-ready properties object for a /cart/add.js call
function buildWholesalerCartProperties(parentForm, variantId, extraProperties) {
  var wholesaler1 = _wholesalerFieldValue(parentForm, '.API');
  var wholesaler2 = _wholesalerFieldValue(parentForm, '.Sigma');
  var wholesaler3 = _wholesalerFieldValue(parentForm, '.Symbion');
  var wholesaler4 = _wholesalerFieldValue(parentForm, '.Ch2');
  var wholesalerBrand = wholesaler1 ? 'API' : wholesaler2 ? 'SIGMA' : wholesaler3 ? 'SYMBION' : wholesaler4 ? 'CH2' : '';
  var wholesalerValue = wholesaler1 || wholesaler2 || wholesaler3 || wholesaler4 || '';

  // #custom-inline-property / .itemperdiscount are always rendered blank and never
  // populated — read the pre-computed per-variant discount attribute instead.
  // Looked up document-wide, skipping any element that doesn't have the attribute
  // at all (some templates render a decoy input sharing the same myvarientid with
  // no variantprofit set) — picking the first real match keeps this consistent
  // regardless of which button/form triggered the add.
  var savingPerItem = '';
  if (variantId) {
    var variantProfitEls = document.querySelectorAll('[myvarientid="' + variantId + '"]');
    for (var i = 0; i < variantProfitEls.length; i++) {
      var attr = variantProfitEls[i].getAttribute('variantprofit');
      if (attr !== null) { savingPerItem = attr.trim(); break; }
    }
  }

  var base = {
    'Wholesaler Account No.1': wholesaler1,
    'Wholesaler Account No.2': wholesaler2,
    'Wholesaler Account No.3': wholesaler3,
    'Wholesaler Account No.4': wholesaler4,
    'Delivery Date': _wholesalerFieldValue(parentForm, '#delivery_date'),
    'Saving Per Item': savingPerItem
  };
  for (var key in (extraProperties || {})) { base[key] = extraProperties[key]; }

  var properties = normalizeLineProperties(base);
  properties['_line_uid'] = computeLineUid(variantId, wholesalerBrand, wholesalerValue);
  return properties;
}
