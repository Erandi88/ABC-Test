import { Outlet, Link } from "react-router-dom";
import './menu.css';

const Layout = () => {
    return (
        <>
        <div className="menu">
            <nav>
                <ul>
                    <li>
                        <Link to="/Customer">Customer</Link>
                    </li>
                    <li>
                        <Link to="/Product">Product</Link>
                    </li>
                    <li>
                        <Link to="/Store">Store</Link>
                    </li>
                    <li>
                        <Link to="/Sales">Sales</Link>
                    </li>
                    
                </ul>
                </nav>
            </div>

            <Outlet />
        </>
    )
};

export default Layout;