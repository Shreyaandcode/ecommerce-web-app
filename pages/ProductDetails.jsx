import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useProductStore } from "../stores/useProductStore";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const { currentProduct, fetchProductById, loading } = useProductStore();
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (!productId) {
      navigate("/");
      return;
    }

    fetchProductById(productId);
  }, [productId, fetchProductById, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Check if size is required for this product
    if ((currentProduct.category === 'top' || currentProduct.category === 'jeans' || currentProduct.category === 'footwear') && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      await addToCart(productId, selectedSize);
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const clothingSizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const footwearSizeOptions = ['4', '5', '6', '7', '8', '9'];
  
  const isSizeRequired = currentProduct && (currentProduct.category === 'top' || currentProduct.category === 'jeans' || currentProduct.category === 'footwear');
  const isFootwear = currentProduct && currentProduct.category === 'footwear';
  const sizeOptions = isFootwear ? footwearSizeOptions : clothingSizeOptions;

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="animate-pulse bg-gray-800 rounded-lg p-8">
          <div className="h-96 bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 pt-24 text-center">
        <h2 className="text-2xl text-gray-300">Product not found</h2>
        <Link to="/" className="text-emerald-400 hover:text-emerald-300 mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <Link
        to="/"
        className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </Link>

      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="relative h-96 md:h-full">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg"; // Fallback image
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-white mb-4">{currentProduct.name}</h1>
            <div className="text-2xl text-emerald-400 font-bold mb-6">
              ₹{currentProduct.price.toLocaleString()}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-emerald-400 mb-2">Description</h2>
              <p className="text-gray-300">{currentProduct.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-emerald-400 mb-2">Category</h2>
              <p className="text-gray-300 capitalize">{currentProduct.category}</p>
            </div>

            {/* Size Selection */}
            {isSizeRequired && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-emerald-400 mb-2">Select Size</h2>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md ${
                        selectedSize === size
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isSizeRequired && !selectedSize}
              className={`w-full py-3 px-4 rounded-md flex items-center justify-center ${
                isSizeRequired && !selectedSize
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600'
              } text-white font-medium transition-colors`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isSizeRequired && !selectedSize ? 'Select a Size' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
