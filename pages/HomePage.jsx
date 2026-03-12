import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/saree", name: "Saree", imageUrl: "/saree.avif" },
	{ href: "/top", name: "Top", imageUrl: "/top.webp" },
	{ href: "/footwear", name: "Footwear", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/jewellary", name: "Jewellary", imageUrl: "/jewellary.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white'>
			{/* Background Image */}
			<div 
				className='absolute inset-0 -z-10'
				style={{
					backgroundImage: 'url("/shopping-background.jpg")',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					opacity: '0.8'
				}}
			/>
			
			{/* Content */}
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='bg-purple-900/80 rounded-lg p-8 backdrop-blur-sm'>
					<h1 className='text-center text-5xl sm:text-6xl font-bold text-white mb-4'>
						Explore Our Categories
					</h1>
					<p className='text-center text-xl text-gray-300 mb-12'>
						Discover the latest trends in eco-friendly fashion
					</p>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{categories.map((category) => (
							<CategoryItem category={category} key={category.name} />
						))}
					</div>

					{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
