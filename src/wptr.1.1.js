export default function WebPullToRefresh() {
  /**
   * Hold all of the default parameters for the module
   * @type {object}
   */
  const defaults = {
    // Number of pixels of panning until refresh
    distanceToRefresh: 70,

    // Pointer to function that does the loading and returns a promise
    loadingFunction: false,

    // Dragging resistance level
    resistance: 2.5,
  };

  /**
   * Hold all of the merged parameter and default module options
   * @type {object}
   */
  let options = {};

  /**
   * Pan event parameters
   * @type {object}
   */
  const pan = {
    enabled: false,
    distance: 0,
    startingPositionY: 0,
  };

  function bodyClassRemove() {
    options.containerEl.classList.remove(`${options.prefixCls}-reset`);
    options.containerEl.removeEventListener('transitionend', bodyClassRemove, false);
  }

  /**
   * Reset all elements to their starting positions before any paning took place.
   */
  function _doReset() {
    options.containerEl.classList.remove(`${options.prefixCls}-loading`);
    options.containerEl.classList.remove(`${options.prefixCls}-refresh`);
    options.containerEl.classList.add(`${options.prefixCls}-reset`);
    options.containerEl.addEventListener('transitionend', bodyClassRemove, false);
  }

  /**
   * Position content and refresh elements to show that loading is taking place.
   */
  function _doLoading() {
    options.containerEl.classList.add(`${options.prefixCls}-loading`);

    // If no valid loading function exists, just reset elements
    if (!options.loadingFunction) {
      return _doReset();
    }

    // The loading function should return a promise
    const loadingPromise = options.loadingFunction();

    // For UX continuity, make sure we show loading for at least one second before resetting
    setTimeout(() => {
      // Once actual loading is complete, reset pull to refresh
      loadingPromise.then(_doReset);
    }, 1000);
  }

  /**
   * Initialize pull to refresh, hammer, and bind pan events.
   *
   * @param {object=} params - Setup parameters for pull to refresh
   */
  function init(params) {
    options = {
      ...params,
      distanceToRefresh: params.distanceToRefresh || defaults.distanceToRefresh,
      loadingFunction: params.loadingFunction || defaults.loadingFunction,
      resistance: params.resistance || defaults.resistance,
    };
  }

  /**
   * Set the CSS transform on the content element to move it on the screen.
   */
  function _setContentPan() {
    // Use transforms to smoothly animate elements on desktop and mobile devices
    options.contentEl.style.transform = options.contentEl.style.webkitTransform =
      `translate3d( 0, ${pan.distance}px, 0 )`;
    options.ptrEl.style.transform = options.ptrEl.style.webkitTransform =
      `translate3d( 0, ${pan.distance - options.ptrEl.offsetHeight}px, 0 )`;
  }

  /**
   * Set/remove the loading body class to show or hide the loading indicator after pull down.
   */
  function _setBodyClass() {
    if (pan.distance > options.distanceToRefresh) {
      options.containerEl.classList.add(`${options.prefixCls}-refresh`);
    } else {
      options.containerEl.classList.remove(`${options.prefixCls}-refresh`);
    }
  }

  /**
   * Determine whether pan events should apply based on scroll position on panstart
   */
  function onPanStart() {
    if (options.containerEl.classList.contains(`${options.prefixCls}-loading`)) {
      pan.enabled = false;
      return;
    }

    pan.startingPositionY = options.containerEl.scrollTop;

    if (pan.startingPositionY === 0) {
      pan.enabled = true;
    }
  }

  /**
   * Handle element on screen movement when the pandown events is firing.
   *
   * @param {object} e - Event object
   */
  function onPanDown(e) {
    if (!pan.enabled) {
      return;
    }

    e.preventDefault();
    pan.distance = e.distance / options.resistance;

    _setContentPan();
    _setBodyClass();
  }

  /**
   * Handle element on screen movement when the pandown events is firing.
   *
   * @param {object} e - Event object
   */
  function onPanUp(e) {
    if (!pan.enabled || pan.distance === 0) {
      return;
    }

    e.preventDefault();

    if (pan.distance < e.distance / options.resistance) {
      pan.distance = 0;
    } else {
      pan.distance = e.distance / options.resistance;
    }

    _setContentPan();
    _setBodyClass();
  }

  /**
   * Determine how to animate and position elements when the panend event fires.
   *
   * @param {object} e - Event object
   */
  function onPanEnd(e) {
    if (!pan.enabled || pan.distance === 0) {
      return;
    }

    e.preventDefault();

    options.contentEl.style.transform = options.contentEl.style.webkitTransform = '';
    options.ptrEl.style.transform = options.ptrEl.style.webkitTransform = '';

    if (options.containerEl.classList.contains(`${options.prefixCls}-refresh`)) {
      _doLoading();
    } else {
      _doReset();
    }

    pan.distance = 0;
    pan.enabled = false;
  }

  function onPan(e) {
    if (e.additionalEvent === 'pandown') {
      onPanDown(e);
    } else {
      onPanUp(e);
    }
  }

  return {
    init,
    events: {
      onPanStart,
      onPan,
      onPanEnd,
    },
  };
}
