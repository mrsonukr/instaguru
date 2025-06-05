import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ui/ScrollToTop";
import Home from "./pages/Home";

// Lazy load non-critical routes
const About = lazy(() => import("./pages/About"));
const Purchase = lazy(() => import("./pages/Purchase"));
const Contact = lazy(() => import("./pages/Contact"));
const Products = lazy(() => import("./pages/Products"));
const AddFunds = lazy(() => import("./pages/AddFunds"));
const Payment = lazy(() => import("./pages/Payment"));
const Wallet = lazy(() => import("./pages/Wallet"));
const ReferPage = lazy(() => import("./pages/Refer"));

const Routing = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/refer" element={<ReferPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/purchase/:id" element={<Purchase />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/:slug" element={<Products />} />
        <Route path="/addfund" element={<AddFunds />} />
        <Route path="/payment/:token" element={<Payment />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/refer/:referralId" element={<ReferPage />} />
      </Routes>
    </Router>
  );
};

export default Routing;