import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {
		// Check if user exists and has cartItems
		if (!req.user || !req.user.cartItems) {
			return res.json([]);
		}

		// Filter out any invalid cart items (where product is undefined)
		const validCartItems = req.user.cartItems.filter(item => item && item.product);

		if (validCartItems.length === 0) {
			return res.json([]);
		}

		const products = await Product.find({ 
			_id: { $in: validCartItems.map(item => item.product.toString()) } 
		});

		// add quantity and size for each product
		const cartItems = products.map((product) => {
			const item = validCartItems.find((cartItem) => 
				cartItem.product.toString() === product._id.toString()
			);
			return { ...product.toJSON(), quantity: item.quantity, size: item.size };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId, size } = req.body;

		// Validate productId
		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		const user = req.user;

		// Initialize cartItems if it doesn't exist
		if (!user.cartItems) {
			user.cartItems = [];
		}

		// Validate that the product exists in the database
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Check if size is required for this product category
		if ((product.category === 'top' || product.category === 'jeans' || product.category === 'footwear') && !size) {
			return res.status(400).json({ message: "Size is required for this product" });
		}

		// Find existing item with the same product and size
		const existingItem = user.cartItems.find((item) => 
			item && 
			item.product && 
			item.product.toString() === productId.toString() &&
			item.size === size
		);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({
				product: productId,
				quantity: 1,
				size: size || null
			});
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const user = req.user;
		user.cartItems = [];
		await user.save();
		res.json({ message: "Cart cleared successfully" });
	} catch (error) {
		console.log("Error in removeAllFromCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { quantity } = req.body;
		const productId = req.params.id;
		const user = req.user;

		const existingItem = user.cartItems.find(
			(item) => item.product.toString() === productId
		);

		if (existingItem) {
			if (quantity <= 0) {
				user.cartItems = user.cartItems.filter(
					(item) => item.product.toString() !== productId
				);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found in cart" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
