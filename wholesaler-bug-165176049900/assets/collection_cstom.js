document.addEventListener('DOMContentLoaded', function () {
  const parents = document.querySelectorAll('.custom-product-parent');

  parents.forEach(parent => {
    const items = parent.querySelectorAll('.customitem');
    const loadMoreBtn = parent.querySelector('.loadMore');
    if (!loadMoreBtn || items.length === 0) return;

    let visible = 10;
    const total = items.length;

    // Hide all via single loop
    for (let i = 0; i < total; i++) {
      items[i].style.display = 'none';
    }

    // Show first batch
    for (let i = 0; i < visible && i < total; i++) {
      items[i].style.display = 'block';
    }

    // Hide button if not needed
    if (total <= visible) {
      loadMoreBtn.style.display = 'none';
      return;
    }

    loadMoreBtn.addEventListener('click', () => {
      const nextVisible = visible + 10;

      for (let i = visible; i < nextVisible && i < total; i++) {
        items[i].style.display = 'block';
      }

      visible = nextVisible;

      if (visible >= total) {
        loadMoreBtn.style.display = 'none';
      }
    });
  });
});

 $('.facets input[data-search]').on('keyup', function() {
            var searchVal = $(this).val();
            var filterItems = $('[data-filter-item]');
            if ( searchVal != '' ) {
            filterItems.addClass('hidden');
            $('[data-filter-item][data-filter-name*="' + searchVal.toLowerCase() + '"]').removeClass('hidden');
            } else {
            filterItems.removeClass('hidden');
            }
            });

        var loc = window.location.pathname;
            $("#searchInput").keyup(function() {
            var tvalue = $(this).val();
           // console.log(tvalue);
        });

