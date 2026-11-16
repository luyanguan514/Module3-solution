/* ============================================================
   TEYVAT TASTE — Adventure Handbook JavaScript
   Genshin Impact Restaurant · Module 3 Solution
   ============================================================ */

$(document).ready(function () {

    /* ============================================================
       1. AUTO-CLOSE MOBILE MENU after a region link is clicked
       ============================================================ */
    $('#nav-list li a').on('click', function () {
        if ($('#collapsable-nav').hasClass('in')) {
            $('.navbar-toggle').trigger('click');
        }
    });


    /* ============================================================
       2. HANDBOOK PAGE-TURN REVEAL
       Each region card fades + tilts in like a page being turned.
       ============================================================ */
    $('.section-inner').css({
        opacity: 0,
        transform: 'perspective(900px) rotateX(8deg) translateY(40px)',
        transformOrigin: 'top center'
    });

    function revealCards() {
        var windowBottom = $(window).scrollTop() + $(window).height();

        $('.section-inner').each(function () {
            var cardTop = $(this).offset().top;
            if (cardTop < windowBottom - 60 && $(this).css('opacity') === '0') {
                $(this).css({
                    opacity: 1,
                    transform: 'perspective(900px) rotateX(0deg) translateY(0)',
                    transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
                });

                // Golden "DISCOVERED" stamp on first reveal
                stampCard($(this));
            }
        });
    }

    /* ============================================================
       3. "DISCOVERED" STAMP EFFECT
       A gold wax-seal style stamp pops onto each card once.
       ============================================================ */
    function stampCard($card) {
        if ($card.find('.handbook-stamp').length) return; // only once

        var $stamp = $('<div class="handbook-stamp" aria-hidden="true">✦<br>Discovered</div>');
        $card.append($stamp);

        // Force reflow so the transition triggers
        $stamp[0].offsetHeight;

        $stamp.addClass('stamp-in');

        // Fade out after a moment so it doesn't block content
        setTimeout(function () {
            $stamp.addClass('stamp-fade');
        }, 1600);
    }


    /* ============================================================
       4. QUEST PROGRESS BAR
       A thin gold bar under the navbar tracks how far
       through the handbook you've read.
       ============================================================ */
    var $progress = $('<div id="quest-progress"><div id="quest-progress-fill"></div></div>');
    $('body').append($progress);

    function updateProgress() {
        var scrollTop = $(window).scrollTop();
        var docHeight = $(document).height() - $(window).height();
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        $('#quest-progress-fill').css('width', pct + '%');
    }

    $(window).on('scroll resize', updateProgress);
    updateProgress();


    /* ============================================================
       5. FLOATING REGION QUICK-NAV (desktop only)
       A vertical "handbook tabs" strip on the left edge.
       ============================================================ */
    var regions = [
        { id: 'mondstadt',  icon: '🍽️', name: 'Mondstadt' },
        { id: 'liyue',      icon: '🥢', name: 'Liyue' },
        { id: 'inazuma',    icon: '🍣', name: 'Inazuma' },
        { id: 'sumeru',     icon: '🍛', name: 'Sumeru' },
        { id: 'fontaine',   icon: '🥐', name: 'Fontaine' },
        { id: 'natlan',     icon: '🔥', name: 'Natlan' },
        { id: 'nodkrai',    icon: '🌙', name: 'Nod-Krai' },
        { id: 'snezhnaya',  icon: '🍲', name: 'Snezhnaya' }
    ];

    var $quickNav = $('<nav id="quick-nav" aria-label="Region quick navigation"></nav>');

    $.each(regions, function (i, r) {
        var $tab = $(
            '<a href="#' + r.id + '" class="quick-tab" data-target="' + r.id + '">' +
                '<span class="quick-icon">' + r.icon + '</span>' +
                '<span class="quick-label">' + r.name + '</span>' +
            '</a>'
        );
        $quickNav.append($tab);
    });

    $('body').append($quickNav);

    // Highlight active tab based on scroll position
    function updateQuickNav() {
        var scrollMid = $(window).scrollTop() + ($(window).height() / 2);
        var activeId = null;

        $('.menu-section').each(function () {
            var top = $(this).offset().top;
            var bottom = top + $(this).outerHeight();
            if (scrollMid >= top && scrollMid <= bottom) {
                activeId = $(this).attr('id');
            }
        });

        $('.quick-tab').removeClass('active');
        if (activeId) {
            $('.quick-tab[data-target="' + activeId + '"]').addClass('active');
        }
    }

    $(window).on('scroll resize', updateQuickNav);
    updateQuickNav();

    // Smooth-scroll for quick-nav clicks (in addition to CSS smooth behavior)
    $('.quick-tab').on('click', function (e) {
        var target = $($(this).attr('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: target.offset().top - 20 }, 600);
        }
    });


    /* ============================================================
       6. HANDBOOK PAGE LOADER
       A brief "opening the handbook" fade on first load.
       ============================================================ */
    var $loader = $(
        '<div id="handbook-loader">' +
            '<div class="loader-inner">' +
                '<div class="loader-icon">📖</div>' +
                '<div class="loader-text">Opening the Handbook…</div>' +
            '</div>' +
        '</div>'
    );
    $('body').append($loader);

    setTimeout(function () {
        $loader.addClass('loader-out');
        setTimeout(function () { $loader.remove(); }, 800);
    }, 900);


    /* ============================================================
       7. BACK TO TOP — smooth scroll fallback
       (CSS scroll-behavior handles modern browsers; this is
       a jQuery fallback for older ones and also works with the
       animated quick-nav above.)
       ============================================================ */
    $('.back-to-top, .navbar-brand').on('click', function (e) {
        var target = $($(this).attr('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 500);
        }
    });

});
