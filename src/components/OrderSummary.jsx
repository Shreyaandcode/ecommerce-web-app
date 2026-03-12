import { useState, useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";
import { loadStripe } from "@stripe/stripe-js";
const OrderSummary = ({ deliveryDetails }) => {
	const [total, setTotal] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const { cart, subtotal, coupon, isCouponApplied } = useCartStore();
	const navigate = useNavigate();

	useEffect(() => {
		const newTotal = cart.reduce((acc, item) => {
			return acc + item.price * item.quantity;
		}, 0);
		setTotal(newTotal);
	}, [cart]);

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handleCheckout = async () => {
		if (!deliveryDetails) {
			toast.error("Please add delivery details before checkout");
			return;
		}

		setIsProcessing(true);
		try {
			const response = await axios.post("/payments/create-checkout-session", {
				products: cart,
				deliveryDetails,
				couponCode: coupon ? coupon.code : null,
			});

			const session = response.data;
			const stripe = await loadStripe(
				"pk_test_51R9VZRFWdagn91ANPonjW3D5ERtb9GQfpvgaI12xU3u7hdzTvR0aYP4pzRELF8Q9lRYOP0DolqKiyJy3HjyceLHF00OQf09qYo"
			);
			const result = await stripe.redirectToCheckout({
				sessionId: session.id,
			});

			if (result.error) {
				console.error("Error:", result.error);
			}
		} catch (error) {
			console.error("Error during checkout:", error);
			toast.error("Failed to process checkout");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>₹{formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-₹{formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>₹{formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleCheckout}
					disabled={isProcessing || !deliveryDetails || cart.length === 0}
				>
					{isProcessing ? "Processing..." : "Checkout"}
				</motion.button>
				{!deliveryDetails && cart.length > 0 && (
					<p className="mt-2 text-sm text-red-600 text-center">
						Please add delivery details before checkout
					</p>
				)}

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary;
