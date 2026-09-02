const selectors = {
  container: ".js-ticker-container",
  contentContainer: ".js-ticker-content-container"
};
const Ticker = () => {
  const cssClasses = window.themeCore.utils.cssClasses;
  const modificators = {
    hideAfterElement: "after-hidden"
  };
  let containers = [];
  let tickers = [];
  function init(sectionId) {
    containers = [...document.querySelectorAll(selectors.container)].filter((section) => !sectionId || section.closest(`#shopify-section-${sectionId}`));
    tickers = [];
    if (containers) {
      containers.forEach((container) => {
        tickers.push({
          container,
          items: [
            ...container.querySelectorAll(
              selectors.contentContainer
            )
          ],
          contentWidth: container.querySelector(
            selectors.contentContainer
          ).clientWidth
        });
      });
    }
    setContentWidth();
    setEventListeners();
  }
  function setContentWidth() {
    tickers.forEach((ticker) => {
      if (ticker.contentWidth < window.innerWidth) {
        ticker.items.forEach((item) => {
          item.style.minWidth = "100vw";
          item.classList.add(cssClasses.full);
          hideLastChildAfterElement(item);
        });
      } else {
        ticker.items.forEach((item) => {
          item.style.minWidth = "unset";
          item.classList.remove(cssClasses.full);
          showLastChildAfterElement(item);
        });
      }
    });
  }
  function showLastChildAfterElement(element) {
    element.classList.remove(modificators.hideAfterElement);
  }
  function hideLastChildAfterElement(element) {
    element.classList.add(modificators.hideAfterElement);
  }
  function setEventListeners() {
    window.addEventListener("resize", setContentWidth);
  }
  return Object.freeze({
    init
  });
};
const action = () => {
  window.themeCore.Ticker = window.themeCore.Ticker || Ticker();
  window.themeCore.utils.register(window.themeCore.Ticker, "announcement-bar");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
