import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Customer from "./components/customerlist";
import Product from "./components/productlist";
import Store from "./components/storelist";
import Sales from "./components/saleslist";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Customer />} />
                    <Route path="Customer" element={<Customer />} />
                    <Route path="Product" element={<Product />} />
                    <Route path="Store" element={<Store />} />
                    <Route path="Sales" element={<Sales />} />
                    
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);