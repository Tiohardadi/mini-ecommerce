import { useState } from "react";
import { updateProduct, deleteProduct } from "../services/api";
import { Pencil, Trash } from "lucide-react";
const AdminProductItem = ({ product, categories, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    image: product.image,
    description: product.description,
    stock: product.stock,
    categoryId: product.categoryId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "categoryId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(product.id, formData);
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await deleteProduct(product.id);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="border border-black text-white px-5 py-2 rounded-md bg-black hover:bg-gray-500 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="border border-black text-black px-5 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
      <div>
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-600">
          Price: ${product.price.toFixed(2)} | Stock: {product.stock}
        </p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 flex items-center"
        >
          <Pencil size={16} className="mr-1" />
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 transition flex items-center"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

export default AdminProductItem;
