import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";

const CategoryItems = () => {
  const { categoryId } = useParams();

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [editId, setEditId] = useState(null);

  const fetchItems = async () => {
    const { data } = await API.get("/items");

    const filtered = data.filter(
      (item) => item.category === categoryId
    );

    setItems(filtered);
  };

  useEffect(() => {
    fetchItems();
  }, [categoryId]);

  // ➕ ADD / ✏️ UPDATE
  const handleSubmit = async (e) => {
  e.preventDefault();

  // ❌ validation 1: empty fields
  if (!form.name.trim() || !form.price) {
    toast.error("⚠️ Item name and price are required!");
    return;
  }

  try {
    if (editId) {
      await API.put(`/items/${editId}`, form);
      toast.success("Item updated successfully!");
      setEditId(null);
    } else {
      await API.post("/items", {
        ...form,
        category: categoryId,
      });

      toast.success("Item added successfully!");
    }

    setForm({ name: "", price: "" });
    fetchItems();

  } catch (error) {
    console.log(error);
    toast.error("Something went wrong!");
  }
};

  // 🗑 DELETE
  const deleteItem = async (id) => {
    await API.delete(`/items/${id}`);
    fetchItems();
  };

  // ✏️ EDIT
  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
    });
    setEditId(item._id);
  };

 return (
  <div className="min-h-screen bg-gray-50 p-6">

    {/* HEADER */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Category Items
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Add, edit and manage items for this category
      </p>
    </div>

    {/* FORM CARD */}
    <form
  onSubmit={handleSubmit}
  className="bg-white p-3 rounded-xl shadow border flex flex-col sm:flex-row gap-2 mb-6 items-stretch"
>

  <input
    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-black/10"
    placeholder="Item name"
    value={form.name}
    onChange={(e) =>
      setForm({ ...form, name: e.target.value })
    }
  />

  <input
    className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-black/10"
    placeholder="Price"
    value={form.price}
    onChange={(e) =>
      setForm({ ...form, price: e.target.value })
    }
  />

  <button
    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm whitespace-nowrap"
  >
    {editId ? "Update Item" : "Add Item"}
  </button>

</form>

    {/* ITEMS GRID */}
   {/* ITEMS GRID */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

  {items.map((item) => (
    <div
      key={item._id}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm 
                 hover:shadow-lg transition-all duration-200 
                 p-4 flex flex-col justify-between h-[130px]"
    >

      {/* TOP SECTION */}
      <div className="space-y-1">

        {/* NAME (BIG & CLEAN) */}
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {item.name}
        </h2>

        {/* PRICE (INLINE STYLE) */}
        <p className="text-sm font-bold text-green-600">
          Rs {item.price}
        </p>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center mt-3">

        <button
          onClick={() => handleEdit(item)}
          className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 
                     hover:bg-blue-100 transition"
        >
          Edit
        </button>

        <button
          onClick={() => deleteItem(item._id)}
          className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600 
                     hover:bg-red-100 transition"
        >
          Delete
        </button>

      </div>

    </div>
  ))}

</div>

  </div>
);
};

export default CategoryItems;