import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,
	currentProduct: null,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			console.error("Error creating product:", error);
			toast.error(error.response?.data?.message || "Failed to create product");
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			console.error("Error fetching products:", error);
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			console.error("Error fetching products by category:", error);
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			return response.data;
		} catch (error) {
			console.error("Error deleting product:", error);
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to delete product");
			throw error;
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			console.error("Error toggling featured product:", error);
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			console.error("Error fetching featured products:", error);
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch products");
		}
	},
	fetchProductById: async (productId) => {
		set({ loading: true, currentProduct: null });
		try {
			const response = await axios.get(`/products/${productId}`);
			set({ currentProduct: response.data, loading: false });
			return response.data;
		} catch (error) {
			console.error("Error fetching product:", error);
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch product");
			throw error;
		}
	},
}));
