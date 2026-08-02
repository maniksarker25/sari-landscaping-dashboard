import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "@/index.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      position="top-center"
      richColors
      closeButton
      expand={true}
      toastOptions={{
        style: {
          zIndex: 99999,
        },
      }}
    />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
