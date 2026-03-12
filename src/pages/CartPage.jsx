import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { motion } from "framer-motion";
import { ShoppingCart, User, Phone, MapPin, Building, Globe, Hash, Edit2 } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import DeliveryDetailsForm from "../components/DeliveryDetailsForm";
import { useState } from "react";

const CartPage = () => {
	const { cart } = useCartStore();
	const { user } = useUserStore();
	const [showDeliveryForm, setShowDeliveryForm] = useState(false);
	const [deliveryDetails, setDeliveryDetails] = useState(null);

	const handleDeliveryDetailsSaved = (details) => {
		setDeliveryDetails(details);
		setShowDeliveryForm(false);
	};

	return (
		<div className='py-8 md:py-16'>
			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
				<div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
					<motion.div
						className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{cart.length === 0 ? (
							<EmptyCartUI />
						) : (
							<>
								<div className='space-y-4'>
									{cart.map((item) => (
										<CartItem key={item._id} item={item} />
									))}
								</div>

								{!showDeliveryForm && !deliveryDetails && user && (
									<motion.button
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.3 }}
										onClick={() => setShowDeliveryForm(true)}
										className="mt-6 w-full bg-emerald-600 text-white py-3 px-4 rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
									>
										<MapPin className="h-5 w-5" />
										Add Delivery Details
									</motion.button>
								)}

								{!user && cart.length > 0 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.3 }}
										className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-md"
									>
										<p className="text-gray-300">Please <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">login</Link> to add delivery details and proceed to checkout.</p>
									</motion.div>
								)}

								{showDeliveryForm && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4 }}
										className="mt-6"
									>
										<DeliveryDetailsForm onSuccess={handleDeliveryDetailsSaved} />
									</motion.div>
								)}

								{deliveryDetails && !showDeliveryForm && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.4 }}
										className="mt-6 bg-gray-800 rounded-lg overflow-hidden"
									>
										<div className="p-6">
											<div className="flex justify-between items-center mb-6">
												<h3 className="text-xl font-bold text-emerald-400">Delivery Details</h3>
												<button
													onClick={() => setShowDeliveryForm(true)}
													className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
												>
													<Edit2 className="h-4 w-4" />
													<span className="text-sm">Edit</span>
												</button>
											</div>
											
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="flex items-start gap-3">
													<User className="h-5 w-5 text-gray-400 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-400">Full Name</p>
														<p className="text-base text-gray-200">{deliveryDetails.name}</p>
													</div>
												</div>

												<div className="flex items-start gap-3">
													<Phone className="h-5 w-5 text-gray-400 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-400">Contact</p>
														<p className="text-base text-gray-200">{deliveryDetails.contactNumber}</p>
													</div>
												</div>

												<div className="flex items-start gap-3 md:col-span-2">
													<MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-400">Address</p>
														<p className="text-base text-gray-200">{deliveryDetails.address}</p>
													</div>
												</div>

												<div className="flex items-start gap-3">
													<Building className="h-5 w-5 text-gray-400 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-400">City</p>
														<p className="text-base text-gray-200">{deliveryDetails.city}</p>
													</div>
												</div>

												<div className="flex items-start gap-3">
													<Globe className="h-5 w-5 text-gray-400 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-400">State</p>
														<p className="text-base text-gray-200">{deliveryDetails.state}</p>
													</div>
												</div>

												<div className="flex items-start gap-3">
													<Globe className="h-5 w-5 text-gray-400 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-400">Country</p>
														<p className="text-base text-gray-200">{deliveryDetails.country}</p>
													</div>
												</div>

												<div className="flex items-start gap-3">
													<Hash className="h-5 w-5 text-gray-400 mt-0.5" />
													<div>
														<p className="text-sm font-medium text-gray-400">Pincode</p>
														<p className="text-base text-gray-200">{deliveryDetails.pincode}</p>
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								)}
							</>
						)}
					</motion.div>

					{cart.length > 0 && (
						<motion.div
							className='mt-8 w-full lg:mt-0 lg:w-96'
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<OrderSummary deliveryDetails={deliveryDetails} />
							<GiftCouponCard />
						</motion.div>
					)}
				</div>

				{cart.length > 0 && <PeopleAlsoBought />}
			</div>
		</div>
	);
};

export default CartPage;

const EmptyCartUI = () => (
	<div className='flex flex-col items-center justify-center space-y-4'>
		<ShoppingCart className='h-16 w-16 text-gray-400' />
		<h2 className='text-2xl font-semibold text-black'>Your cart is empty</h2>
		<p className='text-white-500'>Add items to your cart to checkout</p>
		<Link
			to='/products'
			className='rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
		>
			Continue Shopping
		</Link>
	</div>
);
