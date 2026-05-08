import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminBills = () => {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("daily");

  // FETCH BILLS
  const fetchBills = async () => {
    try {
      const { data } = await API.get("/bills");
      setBills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBills();

    const interval = setInterval(fetchBills, 5000);
    return () => clearInterval(interval);
  }, []);

  // SAFE FORMATTER
  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return { date: "Invalid Date", time: "--" };
    }

    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString(),
    };
  };

  // FILTER LOGIC
const filteredBills = useMemo(() => {
  const now = new Date();

  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const startOfMonth = (date) => {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const nowTime = now.getTime();

  let startTime = 0;

  if (filter === "daily") {
    startTime = startOfDay(now).getTime();
  }

  if (filter === "weekly") {
    const d = new Date();
    d.setDate(d.getDate() - 6); // ✅ last 7 days INCLUDING today
    d.setHours(0, 0, 0, 0);
    startTime = d.getTime();
  }

  if (filter === "monthly") {
    startTime = startOfMonth(now).getTime();
  }

  return bills
    .filter((bill) => {
      if (!bill.createdAt) return false;

      const billTime = new Date(bill.createdAt).getTime();

      if (isNaN(billTime)) return false;

      return billTime >= startTime && billTime <= nowTime;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
}, [bills, filter]);

  // TOTAL SALES
  const totalSales = filteredBills.reduce(
    (acc, bill) => acc + Number(bill.totalAmount || 0),
    0
  );

  // PDF DOWNLOAD
  const downloadPDF = () => {
    if (filteredBills.length === 0) {
      alert("No bills available");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`${filter.toUpperCase()} SALES REPORT`, 14, 15);

    const tableData = [];
    let totalItems = 0;

    filteredBills.forEach((bill) => {
      tableData.push([
        bill.tableNo,
        bill.items.length,
        `Rs ${bill.totalAmount}`,
        formatDate(bill.createdAt).date,
        formatDate(bill.createdAt).time,
      ]);

      totalItems += bill.items.length;
    });

    autoTable(doc, {
      head: [["Table", "Items", "Amount", "Date", "Time"]],
      body: tableData,
      startY: 25,
    });

    const finalY = doc.lastAutoTable?.finalY || 30;

    doc.text(`Total Bills: ${filteredBills.length}`, 14, finalY + 10);
    doc.text(`Total Items Sold: ${totalItems}`, 14, finalY + 18);
    doc.text(`Total Sales: Rs ${totalSales}`, 14, finalY + 26);

    doc.save(`${filter}-sales-report.pdf`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Bills Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Sales overview & reports
          </p>
        </div>

        {/* TOTAL SALES */}
        <div className="bg-green-100 px-6 py-3 rounded-xl text-center min-w-[170px]">
          <p className="text-sm text-gray-600 font-medium">
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Sales
          </p>
          <p className="text-2xl font-bold text-green-700">
            Rs {totalSales}
          </p>
        </div>

        {/* DROPDOWN FILTER */}
        <div className="bg-gray-100 px-4 py-3 rounded-xl">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent outline-none text-sm font-medium"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* PDF BUTTON */}
        <button
          onClick={downloadPDF}
          className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition-all text-sm font-medium"
        >
          Download PDF
        </button>
      </div>

      {/* EMPTY STATE */}
      {filteredBills.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            No Bills Found
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {filteredBills.map((bill) => (
            <div
              key={bill._id}
              className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-all"
            >

              {/* HEADER */}
              <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                <h2 className="font-semibold">
                  Table #{bill.tableNo}
                </h2>

                <div className="text-right">
                  <p className="text-xs text-blue-100">
                    {formatDate(bill.createdAt).date}
                  </p>
                  <p className="text-xs text-blue-200">
                    {formatDate(bill.createdAt).time}
                  </p>
                </div>
              </div>

              {/* BODY */}
              <div className="p-4">

                <div className="space-y-2 max-h-[160px] overflow-y-auto">

                  {bill.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm border-b pb-1"
                    >
                      <span className="truncate">
                        {item.name} × {item.quantity}
                      </span>

                      <span className="text-green-600 font-semibold whitespace-nowrap">
                        Rs {item.price * item.quantity}
                      </span>
                    </div>
                  ))}

                </div>

                <div className="border-t mt-3 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rs {bill.totalAmount}</span>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default AdminBills;