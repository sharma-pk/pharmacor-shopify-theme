import { P as Product } from "./product-a63c7d81.js";
import "./disableTabulationOnNotActiveSlidesWithModel-38e80234.js";
const action = () => {
  window.themeCore.Product = window.themeCore.Product || Product();
  window.themeCore.utils.register(window.themeCore.Product, "featured-product");
};
if (window.themeCore && window.themeCore.loaded) {
  action();
} else {
  document.addEventListener("theme:all:loaded", action, { once: true });
}
