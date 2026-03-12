import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
	withCredentials: true, // send cookies to the server
});

// Add a request interceptor to handle authentication
axiosInstance.interceptors.request.use(
	(config) => {
		// You can add any request modifications here
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle specific error cases
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			if (error.response.status === 401) {
				// Handle unauthorized access
				console.error("Unauthorized access. Please log in again.");
			} else if (error.response.status === 403) {
				// Handle forbidden access (e.g., admin-only routes)
				console.error("Access forbidden. You don't have permission to perform this action.");
			} else if (error.response.status === 404) {
				// Handle not found
				console.error("Resource not found.");
			} else if (error.response.status === 500) {
				// Handle server error
				console.error("Server error. Please try again later.");
			}
		} else if (error.request) {
			// The request was made but no response was received
			console.error("No response received from server. Please check your connection.");
		} else {
			// Something happened in setting up the request that triggered an Error
			console.error("Error setting up the request:", error.message);
		}
		
		return Promise.reject(error);
	}
);

export default axiosInstance;
