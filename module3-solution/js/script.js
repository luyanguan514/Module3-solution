$(document).ready(function () {

    // 1. Auto-close mobile menu
    $('#nav-list li a').on('click', function () {
        if ($('#collapsable-nav').hasClass('in')) {
            $('.navbar-toggle').trigger('click');
        }
    });

    // 2. Page-turn reveal + stamp
    $('.section-inner').css({
        opacity: 0,
        transform: 'perspective(900px) rotateX(8deg) translateY(40px)',
        transformOrigin: 'top center'
    });

    function revealCards() {
        var windowBottom = $(window).scrollTop() + $(window).height();
        $('.section-inner').each(function () {
            if ($(this).offset().top < windowBottom - 60 && $(this).css('opacity') === '0') {
                $(this).css({
                    opacity: 1,
                    transform: 'perspective(900px) rotateX(0deg) translateY(0)',
                    transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
                });
                stampCard($(this));
            }
        });
    }

    function stampCard($card) {
        if ($card.find('.handbook-stamp').length) return;
        var $stamp = $('<div class="handbook-stamp" aria-hidden="true">✦<br>Discovered</div>');
        $card.append($stamp);
        $stamp[0].offsetHeight;
        $stamp.addClass('stamp-in');
        setTimeout(function () { $stamp.addClass('stamp-fade'); }, 1600);
    }

    // 3. Quest progress bar
    $('body').append('<div id="quest-progress"><div id="quest-progress-fill"></div></div>');
    function updateProgress() {
        var scrollTop = $(window).scrollTop();
        var docHeight = $(document).height() - $(window).height();
        $('#quest-progress-fill').css('width', (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%');
    }
    $(window).on('scroll resize', updateProgress);
    updateProgress();

    // 4. Quick-nav
    var regions = [
        { id: 'mondstadt', icon: '🍽️', name: 'Mondstadt' },
        { id: 'liyue', icon: '🥢', name: 'Liyue' },
        { id: 'inazuma', icon: '🍣', name: 'Inazuma' },
        { id: 'sumeru', icon: '🍛', name: 'Sumeru' },
        { id: 'fontaine', icon: '🥐', name: 'Fontaine' },
        { id: 'natlan', icon: '🔥', name: 'Natlan' },
        { id: 'nodkrai', icon: '🌙', name: 'Nod-Krai' },
        { id: 'snezhnaya', icon: '🍲', name: 'Snezhnaya' }
    ];
    var $quickNav = $('<nav id="quick-nav" aria-label="Region quick navigation"></nav>');
    $.each(regions, function (i, r) {
        $quickNav.append(
            '<a href="#' + r.id + '" class="quick-tab" data-target="' + r.id + '">' +
            '<span class="quick-icon">' + r.icon + '</span>' +
            '<span class="quick-label">' + r.name + '</span></a>'
        );
    });
    $('body').append($quickNav);

    function updateQuickNav() {
        var scrollMid = $(window).scrollTop() + ($(window).height() / 2);
        var activeId = null;
        $('.menu-section').each(function () {
            var top = $(this).offset().top;
            if (scrollMid >= top && scrollMid <= top + $(this).outerHeight()) {
                activeId = $(this).attr('id');
            }
        });
        $('.quick-tab').removeClass('active');
        if (activeId) $('.quick-tab[data-target="' + activeId + '"]').addClass('active');
    }
    $(window).on('scroll resize', updateQuickNav);
    updateQuickNav();

    $('.quick-tab').on('click', function (e) {
        var target = $($(this).attr('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: target.offset().top - 20 }, 600);
        }
    });

    // 5. Loader
    var $loader = $('<div id="handbook-loader"><div class="loader-inner"><div class="loader-icon">📖</div><div class="loader-text">Opening the Handbook…</div></div></div>');
    $('body').append($loader);
    setTimeout(function () {
        $loader.addClass('loader-out');
        setTimeout(function () { $loader.remove(); }, 800);
    }, 900);

    // 6. Smooth back-to-top + brand
    $('.back-to-top, .navbar-brand').on('click', function (e) {
        var href = $(this).attr('href');
        if (href && href.charAt(0) === '#') {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 500);
        }
    });

    // Run reveal after loader
    setTimeout(revealCards, 1000);
    $(window).on('scroll resize', revealCards);
});
