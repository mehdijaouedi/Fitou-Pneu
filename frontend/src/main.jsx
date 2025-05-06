import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { CartProvider } from "./store/slice/CartContext"; // ✅ import your CartProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CartProvider> {/* ✅ Wrap App with CartProvider */}
      <App />
    </CartProvider>
  </Provider>
);
