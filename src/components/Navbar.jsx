import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart, User, LayoutDashboard, LogOut, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const { cart } = useCartStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			toast.success("Logged out successfully");
			navigate("/login");
		} catch (error) {
			toast.error("Failed to logout");
		}
	};

	return (
		<nav className="bg-purple-900 text-white py-4">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center">
					<Link to="/" className="text-2xl font-bold text-white">
						gLaMiFy
					</Link>

					<div className="flex items-center space-x-6">
						<Link
							to="/customize"
							className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
						>
							<Wand2 className="h-5 w-5" />
							<span>Customize</span>
						</Link>
						{user ? (
							<>
								{user.role === "admin" && (
									<Link
										to="/secret-dashboard"
										className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
									>
										<LayoutDashboard className="h-5 w-5" />
										<span>Dashboard</span>
									</Link>
								)}
								<Link
									to="/profile"
									className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
								>
									<User className="h-5 w-5" />
									<span>Profile</span>
								</Link>
								<Link
									to="/cart"
									className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
								>
									<div className="relative">
										<ShoppingCart className="h-5 w-5" />
										{cart?.length > 0 && (
											<span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
												{cart.length}
											</span>
										)}
									</div>
									<span>Cart</span>
								</Link>
								<button
									onClick={handleLogout}
									className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
								>
									<LogOut className="h-5 w-5" />
									<span>Logout</span>
								</button>
							</>
						) : (
							<Link
								to="/login"
								className="flex items-center space-x-2 hover:text-pink-500 transition-colors"
							>
								<User className="h-5 w-5" />
								<span>Login</span>
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
