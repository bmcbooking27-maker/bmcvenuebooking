document.addEventListener('click', function() {
    var dd = document.getElementById('contact-dropdown');
    var btn = document.getElementById('contact-btn');
    if (dd) dd.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    const venueSelect = document.getElementById('venue-name-filter');
    const dateInput = document.getElementById('venue-date-filter');
    
    function updateMobileFilters() {
        if (venueSelect) {
            const wrap = venueSelect.closest('.filter-wrap');
            if (wrap) {
                if (venueSelect.value && venueSelect.value !== "") {
                    wrap.classList.add('has-value');
                } else {
                    wrap.classList.remove('has-value');
                }
            }
        }
        if (dateInput) {
            const wrap = dateInput.closest('.filter-wrap');
            if (wrap) {
                if (dateInput.value && dateInput.value !== "") {
                    wrap.classList.add('has-value');
                } else {
                    wrap.classList.remove('has-value');
                }
            }
        }
    }

    if (venueSelect) venueSelect.addEventListener('change', updateMobileFilters);
    if (dateInput) dateInput.addEventListener('change', updateMobileFilters);
    
    const clearBtn = document.querySelector('.btn-clear-filters');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            setTimeout(updateMobileFilters, 10);
        });
    }

    updateMobileFilters();
});
