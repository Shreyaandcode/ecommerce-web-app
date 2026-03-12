import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products, fetchAllProducts } = useProductStore();
	const { user } = useUserStore();
	const [productToDelete, setProductToDelete] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAllProducts();
		setLoading(false);
	}, [fetchAllProducts]);

	const handleDeleteClick = async (productId) => {
		try {
			await deleteProduct(productId);
			toast.success("Product deleted successfully");
			fetchAllProducts();
		} catch (error) {
			toast.error("Failed to delete product");
		}
	};

	if (loading) {
		return (
			<div className="text-center text-gray-300 py-8">
				<p>Loading products...</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="text-center text-gray-300 py-8">
				<p>Not logged in. Please log in first.</p>
			</div>
		);
	}

	if (user.role !== "admin") {
		return (
			<div className="text-center text-gray-300 py-8">
				<p>You don't have permission to view this page.</p>
			</div>
		);
	}

	if (!products || products.length === 0) {
		return (
			<div className="text-center text-gray-300 py-8">
				<p>No products found.</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-700">
						<thead className="bg-gray-700">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Product</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Price</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Featured</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-gray-800 divide-y divide-gray-700">
							{products.map((product) => (
								<tr key={product._id} className="hover:bg-gray-700">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="h-10 w-10">
												<img 
													src={product.image} 
													alt={product.name}
													className="h-10 w-10 rounded-full object-cover"
												/>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-white">{product.name}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-300">₹{product.price.toFixed(2)}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-300">{product.category}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() => toggleFeaturedProduct(product._id)}
											className={`p-1 rounded-full ${
												product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
											} hover:bg-yellow-500 transition-colors duration-200`}
										>
											<Star className="h-5 w-5" />
										</button>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() => handleDeleteClick(product._id)}
											className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
										>
											<Trash className="h-4 w-4 mr-2" />
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProductsList;
