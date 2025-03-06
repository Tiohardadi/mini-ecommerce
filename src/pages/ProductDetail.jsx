import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getProduct, getCategories } from "../services/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const productData = await getProduct(parseInt(id));
        setProduct(productData);

        const categories = await getCategories();
        const productCategory = categories.find(
          (cat) => cat.id === productData.categoryId
        );
        setCategory(productCategory);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (user) {
      addItemToCart(product.id, quantity);
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-base font-light text-gray-600">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-lg font-medium mb-2 text-gray-800">Product Not Found</h2>
        <p className="mb-4 text-gray-600 font-light">
          The product you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2 text-sm font-light"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className=" min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex justify-center items-start">
              <img
                // src={product.imageUrl || "https://placehold.co/600x600"}
                src={`https://mrmockup.com/wp-content/uploads/2024/07/Free-Backside-T-Shirt-Mockup-Square-1024x1024.jpg?x33229`}
                alt={product.name}
                className="w-full h-auto"
              />
            </div>

            {/* Product Information */}
            <div>
              <h1 className="text-3xl font-normal mb-2 text-gray-900">{product.name}</h1>

              <div className="mb-4">
                <span className="text-gray-500 font-light">Category: </span>
                <span className="text-gray-700">{category?.name || "Uncategorized"}</span>
              </div>

              <p className="text-gray-600 mb-8 font-light leading-relaxed">{product.description}</p>

              {/* Product Price */}
              <div className="mb-8">
                <span className="text-black text-2xl font-normal">${product.price.toFixed(2)}</span>
              </div>

              {/* Product Stock */}
              <div className="mb-6">
                <span className="text-gray-700 font-light">
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                </span>
              </div>

              {/* Quantity & Add to Cart */}
              {product.stock > 0 && (
                <div className="space-y-4 mb-8">
                  <div>
                    <label htmlFor="quantity" className="block mb-2 text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-full md:w-24 p-2 border border-gray-300 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="bg-black text-white px-8 py-3 text-sm font-light w-full md:w-auto"
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              {/* Back Button */}
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900 font-light flex items-center"
              >
                ← Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;