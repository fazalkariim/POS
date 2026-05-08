import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // hide on auth pages
  if (
    location.pathname === "/" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="h-16 border-b flex justify-end items-center px-6">
      
      <button
        onClick={logoutHandler}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
};

export default Navbar;


// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// const Navbar = () => {
//      const location = useLocation();

//   // ❌ hide on login/register
//   if (location.pathname === "/" || location.pathname === "/register") {
//     return null;
//   }
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <div className="bg-black text-white p-3 flex justify-between">
//       <h1 className="font-bold">
//         Bayroute_POS ({user?.role?.toUpperCase()})
//       </h1>

//       <div className="flex gap-4">
//         {user?.role === "admin" && (
//           <>
//             <button onClick={() => navigate("/admin/menu")}>
//               Menu
//             </button>
//             <button onClick={() => navigate("/admin/bills")}>
//               Bills
//             </button>
//           </>
//         )}

//         {user?.role === "cashier" && (
//           <>
//             <button onClick={() => navigate("/cashier/menu")}>
//               Menu
//             </button>
//             <button onClick={() => navigate("/cashier/bills")}>
//               Bills
//             </button>
//           </>
//         )}

//         <button onClick={handleLogout} className="text-red-400">
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Navbar;