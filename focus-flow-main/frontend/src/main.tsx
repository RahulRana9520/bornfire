import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker for offline support
const updateSW = registerSW({
  onNeedRefresh() {
    // Automatically apply update and reload seamlessly without bothering the user
    updateSW(true);
  },
  onOfflineReady() {
    // App is ready for offline use
  },
});

createRoot(document.getElementById("root")!).render(<App />);
