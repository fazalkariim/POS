import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CashierMenu from "./pages/cashier/Menu";
import CashierBills from "./pages/cashier/Bills";

import AdminMenu from "./pages/admin/Menu";
import AdminBills from "./pages/admin/Bills";
import CategoryItems from "./pages/admin/CategoryItems";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

const Layout = () => {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen flex">

      {/* SIDEBAR */}
      {!hideLayout && <Sidebar />}

      {/* RIGHT SIDE (NAV + CONTENT + FOOTER) */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* NAVBAR */}
        {!hideLayout && <Navbar />}

        {/* PAGE CONTENT */}
        <main className="flex-1">
          <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/cashier/menu" element={<CashierMenu />} />
            <Route path="/cashier/bills" element={<CashierBills />} />

            <Route path="/admin/menu" element={<AdminMenu />} />
            <Route path="/admin/menu/:categoryId" element={<CategoryItems />} />
            <Route path="/admin/bills" element={<AdminBills />} />

          </Routes>
        </main>

        {/* FOOTER (FULL WIDTH FIXED) */}
        {!hideLayout && (
          <div className="w-full">
            <Footer />
          </div>
        )}

      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";

// import CashierMenu from "./pages/cashier/Menu";
// import CashierBills from "./pages/cashier/Bills";

// import AdminMenu from "./pages/admin/Menu";
// import AdminBills from "./pages/admin/Bills";
// import CategoryItems from "./pages/admin/CategoryItems";
// import Navbar from "./components/Navbar";
// import { AuthProvider } from "./context/AuthContext";
// import PrivateRoute from "./routes/PrivateRoute";

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//       <Navbar/>
//         <Routes>

//           {/* AUTH */}
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* CASHIER */}
//           <Route
//             path="/cashier/menu"
//             element={
//               <PrivateRoute role="cashier">
//                 <CashierMenu />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/cashier/bills"
//             element={
//               <PrivateRoute role="cashier">
//                 <CashierBills />
//               </PrivateRoute>
//             }
//           />

//           {/* ADMIN MAIN MENU */}
//           <Route
//             path="/admin/menu"
//             element={
//               <PrivateRoute role="admin">
//                 <AdminMenu />
//               </PrivateRoute>
//             }
//           />

//           {/* ADMIN CATEGORY ITEMS */}
//           <Route
//             path="/admin/menu/:categoryId"
//             element={
//               <PrivateRoute role="admin">
//                 <CategoryItems />
//               </PrivateRoute>
//             }
//           />

//           {/* ADMIN BILLS */}
//           <Route
//             path="/admin/bills"
//             element={
//               <PrivateRoute role="admin">
//                 <AdminBills />
//               </PrivateRoute>
//             }
//           />

//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;