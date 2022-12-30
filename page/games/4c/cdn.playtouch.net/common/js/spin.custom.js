(function (factory) {
  if (typeof exports == "object") {
    // CommonJS
    factory(require("jquery"), require("spin.js"));
  } else if (typeof define == "function" && define.amd) {
    // AMD, register as anonymous module
    define(["jquery", "spin"], factory);
  } else {
    // Browser globals
    if (!window.Spinner) throw new Error("Spin.js not present");
    factory(window.jQuery, window.Spinner);
  }
})(function ($, Spinner) {
  $.fn.spin = function (opts, color) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data();

      if (data.spinner) {
        data.spinner.stop();
        delete data.spinner;
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css("color") },
          $.fn.spin.presets[opts] || opts
        );
        data.spinner = new Spinner(opts).spin(this);
      }
    });
  };

  $.fn.spin.presets = {
    tiny: { lines: 8, length: 2, width: 2, radius: 3 },
    small: { lines: 8, length: 4, width: 3, radius: 5 },
    large: { lines: 10, length: 8, width: 4, radius: 8 },
    customLoading: {
      lines: 11, // The number of lines to draw
      length: 56, // The length of each line
      width: 30, // The line thickness
      radius: 84, // The radius of the inner circle
      scale: 0.5, // Scales overall size of the spinner
      corners: 1, // Corner roundness (0..1)
      color: ["black", "white"], // #rgb or #rrggbb or array of colors
      opacity: 0.25, // Opacity of the lines
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      speed: 1, // Rounds per second
      trail: 53, // Afterglow percentage
      fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
      //, zIndex: 2e9 // The z-index (defaults to 2000000000)
      className: "spinner", // The CSS class to assign to the spinner
      top: "50%", // Top position relative to parent
      left: "50%", // Left position relative to parent
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      position: "absolute", // Element positioning
    },
  };
  $.fn.center = function () {
    this.css("position", "absolute");
    this.css("top", ($(window).height() - this.height()) / 2 + "px");
    this.css("left", ($(window).width() - this.width()) / 2 + "px");
    return this;
  };
});
