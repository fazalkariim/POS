import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const PrintBill = () => {
  const { id } = useParams();

  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    try {
      const { data } = await API.get(`/bills/${id}`);
      setBill(data);

      // AUTO PRINT
      setTimeout(() => {
        window.print();
      }, 700);

    } catch (error) {
      console.log(error);
    }
  };

  if (!bill) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // TOTAL ITEMS
  const totalQty = bill.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // DISCOUNT
  // const discount = Math.round(
  //   bill.totalAmount * 0.12
  // );

  // // NET
  // const netAmount =
  //   bill.totalAmount - discount;

  // DATE
  const date = new Date(
    bill.createdAt
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // TIME
  const time = new Date(
    bill.createdAt
  ).toLocaleTimeString();

  return (
    <>
      {/* PRINT STYLE */}
     <style>
  {`
    @media print {

      body {
        margin: 0;
        padding: 0;
        background: white;
      }

      body * {
        visibility: hidden;
      }

      .print-area,
      .print-area * {
        visibility: visible;
      }

      .print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      } 

      .no-print {
        display: none;
      }
    }
  `}
</style>

      <div className="bg-white flex justify-center py-4">

        {/* BILL */}
        <div className="print-area w-[340px] bg-white text-black p-4 font-mono">

          {/* LOGO / HEADER */}
          <div className="text-center">

            <h1 className="text-[42px] leading-none tracking-tight">
              Puff N' Stuff
            </h1>

            <p className="text-[16px] mt-3 leading-5">
              Premium Pavillion Sector C2
              <br />
              Bahria Enclave Islamabad
              <br />
              Phone # 0516134634
            </p>

          </div>

          {/* DATE SECTION */}
          <div className="border-2 border-black mt-5">

            {/* TOP */}
            <div className="grid grid-cols-3 text-[20px] border-b border-dashed border-black">

              <div className="p-2 border-r border-dashed border-black text-center">
                {date}
              </div>

              <div className="p-2 border-r border-dashed border-black text-center">
                {time}
              </div>

              <div className="p-2 text-center font-bold">
                POS
              </div>

            </div>

            {/* SECOND */}
            <div className="grid grid-cols-3 text-[12px] font-bold">

              <div className="p-2 border-r border-black text-center">
                Bill:
                {String(
                  bill._id.slice(-3)
                ).padStart(3, "0")}
              </div>

              <div className="p-2 border-r border-black text-center">
                Chq :
                {Math.floor(
                  100000 +
                    Math.random() * 900000
                )}
              </div>

              <div className="p-2 text-center">
                Table:
                {bill.tableNo}
              </div>

            </div>

            {/* TABLE HEAD */}
            <div className="grid grid-cols-4 border-t-2  border-b-2 border-black text-[16px] font-bold">

              <div className="p-2 col-span-1">
                Description
              </div>

              <div className="p-2 text-center">
                Rate
              </div>

              <div className="p-2 text-center">
                Qty
              </div>

              <div className="p-2 text-right">
                Value
              </div>

            </div>

            {/* ITEMS */}
            <div className="min-h-[180px]">

              {bill.items.map(
                (item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 text-[15px]"
                  >

                    <div className="p-2 break-words font-bold">
                      {item.name}
                    </div>

                    <div className="p-2 text-center">
                      {item.price.toFixed(2)}
                    </div>

                    <div className="p-2 text-center">
                      {item.quantity}.00
                    </div>

                    <div className="p-2 text-right">
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* TOTAL */}
          <div className="mt-4">

  {/* SUBTOTAL */}
  <div className="flex justify-between text-[16px]">

    <span>Subtotal</span>

    <span>
      {bill.subtotal?.toFixed(2)}
    </span>

  </div>

  {/* TAX */}
  <div className="flex justify-between text-[16px] mt-2">

    <span>
      Tax ({bill.taxPercentage}%)
    </span>

    <span>
      {bill.taxAmount?.toFixed(2)}
    </span>

  </div>

  {/* GRAND TOTAL */}
  <div className="flex justify-between items-center border-t border-black mt-3 pt-2">

    <h2 className="text-[28px] font-bold">
      Total
    </h2>

    <h2 className="text-[32px] font-bold">
      {bill.totalAmount?.toFixed(2)}
    </h2>

  </div>

</div>

          {/* FOOTER */}
          <div className="mt-6 text-center">

            <p className="text-[12px] uppercase leading-5">
              RUPEES ONLY
            </p>

            <p className="text-[11px] mt-4">
              Software Provided by ShahnaynLabs
              0317-9001036
            </p>

          </div>

          {/* BUTTON */}
          {/* <button
            onClick={() => window.print()}
            className="no-print mt-6 w-full bg-black text-white py-3 rounded-lg text-sm"
          >
            Print Bill
          </button> */}

        </div>

      </div>
    </>
  );
};

export default PrintBill;