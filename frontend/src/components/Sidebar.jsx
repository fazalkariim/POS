import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-64 min-h-screen bg-black text-white p-5 border-r border-gray-800 flex flex-col">

      {/* TOP SECTION */}
      <div>

        {/* LOGO + ROLE */}
        <div className="mb-24">

          <div className="bg-white text-black rounded-2xl p-4 shadow-lg text-center">

            <h1 className="text-2xl font-extrabold tracking-wide">
              POS System
            </h1>

            {/* ROLE UNDER TITLE */}
            <p className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">
              {user?.role === "admin" ? "Admin Panel" : "Cashier Panel"}
            </p>

          </div>

        </div>

        {/* LINKS */}
        <div className="flex flex-col gap-4">

          {user?.role === "cashier" && (
            <>
              <Link
                to="/cashier/menu"
                className={`p-4 rounded-2xl flex justify-between items-center border transition-all duration-300
                  ${
                    location.pathname.includes("/cashier/menu")
                      ? "bg-white text-black border-white shadow-lg scale-[1.02]"
                      : "bg-black border-gray-800 hover:bg-white hover:text-black"
                  }
                `}
              >
                Menu <span>→</span>
              </Link>

              <Link
                to="/cashier/bills"
                className={`p-4 rounded-2xl flex justify-between items-center border transition-all duration-300
                  ${
                    location.pathname.includes("/cashier/bills")
                      ? "bg-white text-black border-white shadow-lg scale-[1.02]"
                      : "bg-black border-gray-800 hover:bg-white hover:text-black"
                  }
                `}
              >
                Bills <span>→</span>
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                to="/admin/menu"
                className={`p-4 rounded-2xl flex justify-between items-center border transition-all duration-300
                  ${
                    location.pathname.includes("/admin/menu")
                      ? "bg-white text-black border-white shadow-lg scale-[1.02]"
                      : "bg-black border-gray-800 hover:bg-white hover:text-black"
                  }
                `}
              >
                Menu <span>→</span>
              </Link>

              <Link
                to="/admin/bills"
                className={`p-4 rounded-2xl flex justify-between items-center border transition-all duration-300
                  ${
                    location.pathname.includes("/admin/bills")
                      ? "bg-white text-black border-white shadow-lg scale-[1.02]"
                      : "bg-black border-gray-800 hover:bg-white hover:text-black"
                  }
                `}
              >
                Bills <span>→</span>
              </Link>
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Sidebar;