import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<AuthContextProvider>
				<App />
				<Toaster position="bottom-right" />
			</AuthContextProvider>
		</BrowserRouter>
	</StrictMode>
);
