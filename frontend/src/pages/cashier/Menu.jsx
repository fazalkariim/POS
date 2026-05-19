import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);
  const [tableNo, setTableNo] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [cashTax, setCashTax] = useState(0);
  const [cardTax, setCardTax] =useState(0);
  const [serviceTax, setServiceTax] = useState(0);

  const navigate = useNavigate();

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
    fetchTax();;
  }, []);

  // FILTER ITEMS
  const filteredItems = items.filter((item) => {
  if (!item.category) return false;

  if (search.trim() !== "") {
    return item.name
      .toLowerCase()
      .includes(search.toLowerCase());
  }

  if (selectedCategory) {
    return item.category === selectedCategory;
  }

  return true;
});

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
  const subtotal = cart.reduce(
  (acc, item) =>
    acc +
    item.price * item.quantity,
  0
);

const appliedTax =
  paymentMethod === "Cash"
    ? cashTax
    : cardTax;

const taxAmount =
  (subtotal * Number(appliedTax)) / 100;

const serviceTaxAmount =
  (subtotal * Number(serviceTax)) / 100;

const total =
  subtotal +
  taxAmount +
  serviceTaxAmount;

  const fetchTax = async () => {
  try {

    const { data } =
      await API.get("/settings");

    setCashTax(data.cashTax || 0);
    setCardTax(data.cardTax || 0);
    setServiceTax(data.serviceTax || 0);

  } catch (error) {
    console.log(error);
  }
}; 

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

     const res = await API.post(
          "/bills",
          {
            tableNo: Number(tableNo),
            items: cart,
            subtotal,
            taxPercentage: appliedTax,
            taxAmount,

            serviceTaxPercentage: serviceTax,
            serviceTaxAmount,

            paymentMethod,
            totalAmount: total,
          }
        );
        
        toast.success(
          "Bill Generated Successfully"
        );
        
        navigate(
          `/cashier/print/${res.data._id}`
        );
        
        setCart([]);
        setTableNo("");

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
  <div className="min-h-screen bg-[#eef1f5] p-4 flex gap-4">

    {/* LEFT SIDE */}
    <div className="w-[68%]">

      {/* HEADER */}
      <div className="bg-white border border-gray-200 shadow-sm px-5 py-4 mb-4">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* LEFT */}
          <div>

            <h1 className="text-[26px] font-black tracking-tight text-black">
              POS Menu
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Select category and manage orders
            </p>

          </div>

          {/* SEARCH */}
          <div className="w-full md:w-[280px]">

            <input
              type="text"
              placeholder="Search item..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full h-[42px] px-4 border border-gray-300 bg-white text-sm font-medium outline-none hover:border-black focus:border-black transition-all"
            />

          </div>

        </div>

      </div>

      {/* CATEGORY */}
      <div className="bg-white border border-gray-200 shadow-sm p-4 mb-4">

        <div className="flex flex-wrap gap-2">

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setSelectedCategory(cat._id);
                setSearch("");
              }}
              className={`h-[38px] px-4 text-sm font-semibold transition-all border
              ${
                selectedCategory === cat._id
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-black hover:text-white hover:border-black"
              }`}
            >
              {cat.name}
            </button>
          ))}

        </div>

      </div>

      {/* ITEMS */}
      {filteredItems.length === 0 ? (

        <div className="bg-white border border-gray-200 shadow-sm p-10 text-center">

          <h2 className="text-xl font-bold text-gray-800">
            No Item Found
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Try another category or search
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">

          {filteredItems.map((item) => (

            <div
              key={item._id}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* HEADER */}
              <div className="border-b border-gray-200 px-4 py-3 bg-gradient-to-r from-[#fafafa] to-white">

                <div className="flex items-start justify-between">

                  <div>

                    <h2 className="text-[18px] font-medium text-black truncate">
                      {item.name}
                    </h2>

                  </div>
                </div>

              </div>

              {/* BODY */}
              <div className="p-4">

                <div className="flex items-center justify-between mb-4">

                  <div> 

                    <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                      Price
                    </p>

                    <span className="text-[18px] font-medium text-black">
                      Rs {item.price}
                    </span>

                  </div>

                </div>

                <button
                  onClick={() =>
                    addToCart(item)
                  }
                  className="w-full h-10 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-all"
                >
                  Add Item
                </button>

              </div>

            </div>
          ))}

        </div>

      )}

    </div>





    {/* RIGHT SIDE */}
    <div className="w-[32%] bg-white border border-gray-200 shadow-sm p-5 h-fit sticky top-4">

  {/* HEADER */}
  <div className="flex items-center justify-between mb-5">
    <div>
      <h2 className="text-[22px] font-black text-black">
        Cart Summary
      </h2>

      <p className="text-xs text-gray-400 mt-1">
        {cart.length} items added
      </p>
    </div>

    <div className="w-9 h-9 bg-black text-white flex items-center justify-center text-sm font-bold">
      {cart.length}
    </div>
  </div>

  {/* TABLE + PAYMENT */}
  <div className="flex gap-3 mb-5">

    <input
      type="text"
      placeholder="Table No"
      className="w-1/2 h-[38px] px-3 border border-gray-300 bg-white text-xs font-medium outline-none hover:border-black focus:border-black transition-all"
      value={tableNo}
      onChange={(e) => setTableNo(e.target.value)}
    />

    <select
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
      className="w-1/2 h-[38px] px-1 border border-gray-300 bg-white text-xs font-medium outline-none hover:border-black focus:border-black transition-all"
    >
      <option value="Cash">💵 Cash Payment</option>
      <option value="Card">💳 Card Payment</option>
    </select>

  </div>

  {/* CART ITEMS */}
  <div className="space-y-2 max-h-[320px] overflow-y-auto">
    {cart.length === 0 ? (
      <div className="text-center py-10">
        <p className="text-sm text-gray-400">
          No items in cart
        </p>
      </div>
    ) : (
      cart.map((item) => (
        <div
          key={item._id}
          className="border border-gray-200 p-3"
        >
          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-sm font-semibold text-black">
                {item.name}
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Rs {item.price}
              </p>
            </div>

            {/* QTY */}
            <div className="flex items-center gap-2">

              <button
                onClick={() => decreaseQty(item._id)}
                className="w-7 h-7 border border-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
              >
                −
              </button>

              <span className="text-sm font-bold w-5 text-center">
                {item.quantity}
              </span>

              <button
                onClick={() => addToCart(item)}
                className="w-7 h-7 border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all"
              >
                +
              </button>

            </div>
          </div>
        </div>
      ))
    )}
  </div>

  {/* TOTAL */}
  <div className="mt-5 pt-4 border-t border-gray-200 space-y-2">

    {/* SUBTOTAL */}
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        Subtotal
      </span>

      <span className="text-sm font-semibold">
        Rs {subtotal.toFixed(2)}
      </span>
    </div>

    {/* TAX */}
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        GST ({appliedTax}%)
      </span>

      <span className="text-sm font-semibold">
        Rs {taxAmount.toFixed(2)}
      </span>
    </div>

    {/* SERVICE TAX */}
<div className="flex items-center justify-between">
  <span className="text-sm text-gray-500">
    Service Tax ({serviceTax}%)
  </span>

  <span className="text-sm font-semibold">
    Rs {serviceTaxAmount.toFixed(2)}
  </span>
</div>

    {/* TOTAL */}
    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
      <span className="text-sm font-medium text-gray-500">
        Grand Total
      </span>

      <span className="text-[26px] font-medium text-black">
        Rs {total.toFixed(2)}
      </span>
    </div>
  </div>

  {/* BUTTON */}
  <button
    onClick={generateBill}
    className="w-full h-[44px] mt-5 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-all"
  >
    Generate Bill
  </button>

</div>

  </div>
);
};

export default Menu;