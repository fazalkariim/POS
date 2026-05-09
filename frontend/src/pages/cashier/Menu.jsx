import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);
  const [tableNo, setTableNo] = useState("");

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const { data } = await API.get(
        "/categories"
      );

      setCategories(data);

    } catch (error) {
      console.log(error);
    }
  };

  // FETCH ITEMS
  const fetchItems = async () => {
    try {
      const { data } = await API.get(
        "/items"
      );

      setItems(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  // FILTER ITEMS
  const filteredItems = items.filter(
    (item) => {

      // SEARCH
      if (search.trim() !== "") {
        return item.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );
      }

      // CATEGORY
      if (selectedCategory) {
        return (
          item.category ===
          selectedCategory
        );
      }

      return true;
    }
  );

  // ADD TO CART
  const addToCart = (item) => {
    const exists = cart.find(
      (c) => c._id === item._id
    );

    if (exists) {
      setCart(
        cart.map((c) =>
          c._id === item._id
            ? {
                ...c,
                quantity:
                  c.quantity + 1,
              }
            : c
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          quantity: 1,
        },
      ]);
    }
  };

  // REMOVE QTY
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((c) =>
          c._id === id
            ? {
                ...c,
                quantity:
                  c.quantity - 1,
              }
            : c
        )
        .filter(
          (c) => c.quantity > 0
        )
    );
  };

  // TOTAL
  const total = cart.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity,
    0
  );

  // GENERATE BILL
  const generateBill = async () => {
    try {
      if (!tableNo) {
        toast.error(
          "Table number is required"
        );
        return;
      }

      if (cart.length === 0) {
        toast.error(
          "Add at least 1 item"
        );
        return;
      }

      await API.post("/bills", {
        tableNo: Number(tableNo),
        items: cart,
        totalAmount: total,
      });

      toast.success(
        "Bill Generated Successfully"
      );

      setCart([]);
      setTableNo("");

    } catch (error) {
      console.log(error);

      toast.error(
        "Bill generation failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-5 flex gap-5">

      {/* LEFT SIDE */}
      <div className="w-[68%]">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

          <div>

            <h1 className="text-[28px] font-bold tracking-tight text-gray-900">
              POS Menu
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Select category and add
              items to cart
            </p>

          </div>

          {/* SEARCH */}
          <div className="w-full md:w-[300px]">

            <input
              type="text"
              placeholder="Search item..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full h-[46px] px-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all shadow-sm"
            />

          </div>

        </div>

        {/* CATEGORY SECTION */}
        <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm mb-5">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-sm font-semibold text-gray-800">
              Categories
            </h2>

            <span className="text-xs text-gray-400">
              {categories.length}
            </span>

          </div>

          <div className="flex flex-wrap gap-2">

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(
                    cat._id
                  );

                  setSearch("");
                }}
                className={`px-4 h-10 rounded-xl text-sm font-medium border transition-all duration-200
                ${
                  selectedCategory ===
                  cat._id
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-black hover:bg-black hover:text-white"
                }
              `}
              >
                {cat.name}
              </button>
            ))}

          </div>

        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-5">

          <div className="h-px flex-1 bg-gray-200"></div>

          <span className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
            Items
          </span>

          <div className="h-px flex-1 bg-gray-200"></div>

        </div>

        {/* ITEMS */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">

          {filteredItems.length ===
            0 && (
            <div className="col-span-full bg-white rounded-3xl border border-gray-200 p-10 text-center shadow-sm">

              <h2 className="text-lg font-semibold text-gray-800">
                No Item Found
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Try another search
              </p>

            </div>
          )}

          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group bg-white border border-gray-200 rounded-3xl p-4 h-[160px] flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              <div>

                <div className="flex items-start justify-between">

                  <h2 className="font-semibold text-gray-900 text-[15px] leading-tight">
                    {item.name}
                  </h2>

                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>

                </div>

                <p className="text-[15px] font-bold text-black mt-3">
                  Rs {item.price}
                </p>

              </div>

              <button
                onClick={() =>
                  addToCart(item)
                }
                className="h-10 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition-all"
              >
                Add Item
              </button>

            </div>
          ))}

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-[32%] sticky top-5 h-fit bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">

        {/* CART HEADER */}
        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Cart Summary
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              {cart.length} items
              added
            </p>

          </div>

          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-semibold">
            {cart.length}
          </div>

        </div>

        {/* TABLE INPUT */}
        <input
          type="number"
          placeholder="Table No"
          className="w-full h-11 px-4 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all mb-5"
          value={tableNo}
          onChange={(e) =>
            setTableNo(
              e.target.value
            )
          }
        />

        {/* CART ITEMS */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">

          {cart.length === 0 ? (
            <div className="text-center py-10 text-gray-400">

              <p className="text-sm">
                No items in cart
              </p>

            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-1 hover:bg-gray-100 transition-all"
              >

                <div className="flex-1 min-w-0">

                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-500 ">
                    Rs {item.price}
                  </p>

                </div>

                {/* QTY */}
                <div className="flex items-center gap-2 ml-3">

                  <button
                    onClick={() =>
                      decreaseQty(
                        item._id
                      )
                    }
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 transition flex items-center justify-center"
                  >
                    −
                  </button>

                  <span className="w-5 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      addToCart(item)
                    }
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-black hover:text-white hover:border-black transition flex items-center justify-center"
                  >
                    +
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

        {/* TOTAL */}
        <div className="mt-5 pt-1 border-t border-gray-200 flex items-center justify-between">

          <span className="text-sm font-medium text-gray-500">
            Total Amount
          </span>

          <span className="text-2xl font-bold text-black">
            Rs {total}
          </span>

        </div>

        {/* BUTTON */}
        <button
          onClick={generateBill}
          className="w-full h-12 mt-5 rounded-2xl bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-all shadow-md"
        >
          Generate Bill
        </button>

      </div>

    </div>
  );
};

export default Menu;