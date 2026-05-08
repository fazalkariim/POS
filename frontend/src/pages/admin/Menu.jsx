import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    const { data } = await API.get("/categories");
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ➕ ADD / ✏️ UPDATE
  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      if (editId) {
        await API.put(`/categories/${editId}`, { name });
        setEditId(null);
      } else {
        await API.post("/categories", { name });
      }

      setName("");
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  // ✏️ EDIT
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
  };

  // delete 
  const deleteCategory = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this category?");
  
  if (!confirmDelete) return;

  try {
    await API.delete(`/categories/${id}`);
    fetchCategories();
  } catch (error) {
    console.log(error);
  }
};

  return (
  <div className="min-h-screen bg-gray-50 p-6">

    {/* HEADER */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Categories
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Manage your restaurant menu categories
      </p>
    </div>

    {/* INPUT CARD */}
    <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">

      <input
        className="border rounded-lg px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-black/10"
        placeholder="Enter category name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition w-full sm:w-auto"
      >
        {editId ? "Update Category" : "Add Category"}
      </button>

    </div>

    {/* GRID UI */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

      {categories.map((cat) => (
        <div
          key={cat._id}
          className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[120px]"
          onClick={() => navigate(`/admin/menu/${cat._id}`)}
        >

          {/* TOP */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 truncate">
              {cat.name}
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Tap to view items
            </p>
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-2 mt-3">

  {/* EDIT */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleEdit(cat);
    }}
    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition"
  >
    Edit
  </button>

  {/* DELETE */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      deleteCategory(cat._id);
    }}
    className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition"
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

export default Menu;