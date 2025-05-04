$(document).ready(function () {
  // detect OS/browser preference (kept for potential future use or other logic)
  const browserPref = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  // Set the theme on page load or when explicitly called
  var setTheme = function (theme) {
    // --- MODIFIED LOGIC ---
    // Prioritize:
    // 1. Explicit theme passed to function
    // 2. Theme saved in localStorage
    // 3. Default to 'light' otherwise (ignoring browserPref for default)
    const use_theme =
      theme ||
      localStorage.getItem("theme") ||
      // $("html").attr("data-theme") || // Removed this check as it could interfere on initial load
      'light'; // Default to light mode

    // Apply the theme
    if (use_theme === "dark") {
      // Remove the attribute for light mode (assuming CSS defaults to light)
      $("html").removeAttr("data-theme");
       // Update icon if a theme toggle button exists
       if ($("#theme-icon").length) {
           $("#theme-icon").removeClass("fa-moon").addClass("fa-sun");
       }
    } else { // Includes 'light' and any other case
      // Remove the attribute for light mode (assuming CSS defaults to light)
      $("html").removeAttr("data-theme");
       // Update icon if a theme toggle button exists
       if ($("#theme-icon").length) {
           $("#theme-icon").removeClass("fa-moon").addClass("fa-sun");
       }
    }
  };

  // Set the theme when the page is ready
  setTheme();

  // --- Original listener for OS changes ---
  // This listener will now only apply theme changes IF localStorage is not set.
  // Since we default to 'light' and the toggle saves to localStorage,
  // this listener might have less impact unless localStorage is cleared.
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener("change", (e) => {
      // Only apply OS preference if the user hasn't explicitly chosen via toggle (saved in localStorage)
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  // --- Original Toggle Functionality ---
  // Toggle the theme manually when the button is clicked
  var toggleTheme = function () {
    // Check the current theme by reading the attribute (or assume light if absent)
    const current_theme = $("html").attr("data-theme") || 'light';
    const new_theme = current_theme === "dark" ? "light" : "dark";
    // Save the user's choice to localStorage
    localStorage.setItem("theme", new_theme);
    // Apply the new theme
    setTheme(new_theme);
  };

  // Attach the toggle function to the button click event
  $('#theme-toggle').on('click', toggleTheme);

  // --- Rest of the original main.js code ---

  // These should be the same as the settings in _variables.scss
  const scssLarge = 925; // pixels

  // Sticky footer
  var bumpIt = function () {
    // Check if footer exists before trying to get its height
    if ($(".page__footer").length > 0) {
        $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    }
  },
    didResize = false;

  bumpIt();

  $(window).resize(function () {
    didResize = true;
  });
  setInterval(function () {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);

  // FitVids init (Check if function exists before calling)
  if ($.fn.fitVids) {
    fitvids();
  }


  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function () {
    $(".author__urls").fadeToggle("fast", function () { });
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // Restore the follow menu if toggled on a window resize
  jQuery(window).on('resize', function () {
    if ($('.author__urls.social-icons').length > 0 && $('.author__urls.social-icons').css('display') == 'none' && $(window).width() >= scssLarge) {
      $(".author__urls").css('display', 'block')
    }
  });

  // init smooth scroll, this needs to be slightly more than then fixed masthead height
  // Check if function exists before calling
  if ($.fn.smoothScroll) {
    $("a").smoothScroll({
      offset: -75, // needs to match $masthead-height
      preventDefault: false,
    });
  }


  // add lightbox class to all image links
  // Add "image-popup" to links ending in image extensions,
  // but skip any <a> that already contains an <img>
  $("a[href$='.jpg'],\
  a[href$='.jpeg'],\
  a[href$='.JPG'],\
  a[href$='.png'],\
  a[href$='.gif'],\
  a[href$='.webp']")
      .not(':has(img)')
      .addClass("image-popup");

  // 1) Wrap every <p><img> (except emoji images) in an <a> pointing at the image, and give it the lightbox class
  $('p > img').not('.emoji').each(function() {
    var $img = $(this);
    // skip if it’s already wrapped in an <a.image-popup>
    if ( ! $img.parent().is('a.image-popup') ) {
      $('<a>')
        .addClass('image-popup')
        .attr('href', $img.attr('src'))
        .insertBefore($img)   // place the <a> right before the <img>
        .append($img);        // move the <img> into the <a>
    }
  });

  // Magnific-Popup options (Check if function exists before calling)
  if ($.fn.magnificPopup) {
    $(".image-popup").magnificPopup({
      type: 'image',
      tLoading: 'Loading image #%curr%...',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
      },
      image: {
        tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
      },
      removalDelay: 500, // Delay in milliseconds before popup is removed
      // Class that is added to body when popup is open.
      // make it unique to apply your CSS animations just to this exact popup
      mainClass: 'mfp-zoom-in',
      callbacks: {
        beforeOpen: function () {
          // just a hack that adds mfp-anim class to markup
          this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
        }
      },
      closeOnContentClick: true,
      midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
  } // End check for magnificPopup

}); // End document ready
