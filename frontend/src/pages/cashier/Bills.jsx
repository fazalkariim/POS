import { useEffect, useState } from "react";
import API from "../../services/api";

const Bills = () => {
  const [bills, setBills] = useState([]);

  const fetchBills = async () => {
    try {
      const { data } = await API.get("/bills");
      setBills(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        
        <h1 className="text-3xl font-bold text-gray-800">
          Cashier Bills
        </h1>
        <p className="text-gray-500 mt-1">
          Generated receipts history
        </p>
      </div>

      {/* EMPTY */}
      {bills.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-gray-500 text-lg">
            No Bills Found
          </p>
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {[...bills]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((bill) => (
           
            <div
              key={bill._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden"
            >

              {/* TOP BAR */}
              <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">

                <h2 className="text-lg font-semibold">
                  Table #{bill.tableNo}
                </h2>
                  <div className="text-right">
                <p className="text-xs">
                  {new Date(bill.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-300">
                  {new Date(bill.createdAt).toLocaleTimeString()}
                </p>
                 </div>

                {/* <span className="text-xs bg-white text-green-600 px-2 py-1 rounded-full">
                  CASHIER
                </span> */}

              </div>

              {/* BODY */}
              <div className="p-4">

                {/* ITEMS */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto">

                  {bill.items.map((item, index) => (

                    <div
                      key={index}
                      className="flex justify-between items-start border-b pb-1"
                    >

                      {/* LEFT */}
                      <div className="min-w-0">

                        <h3 className="font-medium text-sm text-gray-800 truncate">
                          {item.name}
                        </h3>

                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>

                      </div>

                      {/* RIGHT */}
                      <div className="flex-shrink-0 text-right">

                        <span className="font-semibold text-sm text-green-600 whitespace-nowrap">
                          Rs {item.price * item.quantity}
                        </span>

                      </div>

                    </div>
                  ))}

                </div>

                {/* TOTAL */}
                <div className="border-t pt-3 flex justify-between items-center">

                  <h3 className="text-sm font-semibold text-gray-700">
                    Total
                  </h3>

                  <span className="text-base font-bold text-black whitespace-nowrap">
                    Rs {bill.totalAmount}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Bills;