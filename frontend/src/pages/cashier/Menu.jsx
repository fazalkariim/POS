import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);
  const [tableNo, setTableNo] = useState("");

  // 🔥 GET CATEGORIES (FROM ADMIN)
  const fetchCategories = async () => {
    const { data } = await API.get("/categories");
    setCategories(data);
  };

  // 🔥 GET ITEMS
 const fetchItems = async () => {
  try {
    const { data } = await API.get("/items");

    setItems(Array.isArray(data) ? data : []);

  } catch (error) {
    console.log(error);
  }
};


 const filteredItems = items.filter((item) => {

  // 🔍 SEARCH PRIORITY
  if (search.trim() !== "") {
    return item.name
      .toLowerCase()
      .includes(search.toLowerCase());
  }

  // 📂 CATEGORY FILTER
  if (selectedCategory) {
    return item.category === selectedCategory;
  }

  // ✅ SHOW ALL
  return true;
});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
  fetchItems();
}, []);

  // ➕ ADD TO CART
  const addToCart = (item) => {
    const exists = cart.find((c) => c._id === item._id);

    if (exists) {
      setCart(
        cart.map((c) =>
          c._id === item._id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // ➖ REMOVE
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((c) =>
          c._id === id
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  // 💰 TOTAL
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 🧾 BILL GENERATE
const generateBill = async () => {
  try {

    // ❌ TABLE VALIDATION
    if (!tableNo) {
      toast.error("Table number is required");
      return;
    }

    // ❌ EMPTY CART VALIDATION
    if (cart.length === 0) {
      toast.error("Add at least 1 item");
      return;
    }

    // ✅ API
    const res = await API.post("/bills", {
      tableNo: Number(tableNo),
      items: cart,
      totalAmount: total,
    });

    console.log(res.data);

    // ✅ SUCCESS
    toast.success("Bill Generated Successfully");

    // RESET
    setCart([]);
    setTableNo("");

  } catch (error) {
    console.log(error);

    toast.error("Bill generation failed");
  }
};
return (
  <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex gap-6">

    {/* LEFT PANEL */}
    <div className="w-2/3">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            POS Menu
          </h1>
          <p className="text-gray-500 text-sm">
            Select category and add items to cart
          </p>
        </div>

        {/* SEARCH */}
        <div className="w-full md:w-[320px]">
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border bg-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black shadow-sm"
          />
        </div>

      </div>

      {/* 🔥 CATEGORY SECTION (SEPARATED BOX) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border mb-6">

        <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest">
          Categories
        </p>

        <div className="flex gap-3 flex-wrap">

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setSelectedCategory(cat._id);
                setSearch("");
              }}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all border
                ${
                  selectedCategory === cat._id
                    ? "bg-black text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-black hover:text-white"
                }
              `}
            >
              {cat.name}
            </button>
          ))}

        </div>
      </div>

      {/* 🔥 DIVIDER LINE (CATEGORY → ITEMS SEPARATION) */}
      <div className="flex items-center gap-3 mb-4">

        <div className="h-[1px] flex-1 bg-gray-300"></div>

        <span className="text-xs text-gray-500 uppercase tracking-widest">
          Items
        </span>

        <div className="h-[1px] flex-1 bg-gray-300"></div>

      </div>

      {/* ITEMS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">

        {filteredItems.length === 0 && (
          <div className="col-span-full bg-white p-10 rounded-xl text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No Item Found
            </h2>
            <p className="text-gray-500 mt-2">
              Try searching another item
            </p>
          </div>
        )}

        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all p-4 flex flex-col justify-between h-[150px]"
          >

            <div>
              <h2 className="font-semibold text-gray-800 text-base truncate">
                {item.name}
              </h2>

              <p className="text-green-600 font-bold mt-1">
                Rs {item.price}
              </p>
            </div>

            <button
              onClick={() => addToCart(item)}
              className="mt-3 bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition"
            >
              Add Item
            </button>

          </div>
        ))}

      </div>

    </div>

    {/* RIGHT CART (unchanged) */}
    {/* RIGHT CART */}
<div className="w-1/3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-5 h-fit sticky top-5">

  {/* HEADER */}
  <div className="flex items-center justify-between mb-5">

    <h2 className="text-xl font-bold text-gray-800">
      Cart Summary
    </h2>

    <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
      {cart.length} Items
    </span>

  </div>

  {/* TABLE INPUT */}
  <input
    type="number"
    placeholder="Table No"
    className="w-full border border-gray-200 rounded-xl p-3 mb-5 focus:ring-2 focus:ring-black outline-none bg-white"
    value={tableNo}
    onChange={(e) => setTableNo(e.target.value)}
  />

  {/* CART ITEMS */}
  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">

    {cart.length === 0 ? (
      <div className="text-center py-10 text-gray-400">

        <p className="text-sm">No items in cart</p>
        <p className="text-xs mt-1">Add items from menu</p>

      </div>
    ) : (
      cart.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3 hover:bg-gray-100 transition"
        >

          {/* LEFT */}
          <div className="flex-1">

            <h3 className="font-medium text-gray-800 text-sm truncate">
              {item.name}
            </h3>

            <p className="text-xs text-green-600 font-semibold mt-1">
              Rs {item.price}
            </p>

          </div>

          {/* QTY CONTROLS */}
          <div className="flex items-center gap-2">

            <button
              onClick={() => decreaseQty(item._id)}
              className="w-7 h-7 rounded-md bg-gray-200 hover:bg-red-500 hover:text-white transition flex items-center justify-center text-sm"
            >
              −
            </button>

            <span className="text-sm font-semibold w-5 text-center">
              {item.quantity}
            </span>

            <button
              onClick={() => addToCart(item)}
              className="w-7 h-7 rounded-md bg-gray-200 hover:bg-green-600 hover:text-white transition flex items-center justify-center text-sm"
            >
              +
            </button>

          </div>

        </div>
      ))
    )}

  </div>

  {/* TOTAL */}
  <div className="mt-5 border-t pt-4 flex items-center justify-between">

    <span className="text-gray-600 font-medium">
      Total
    </span>

    <span className="text-lg font-bold text-black">
      Rs {total}
    </span>

  </div>

  {/* BUTTON */}
  <button
    onClick={generateBill}
    className="w-full mt-5 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
  >
    Generate Bill
  </button>

</div>

  </div>
);
}

export default Menu;