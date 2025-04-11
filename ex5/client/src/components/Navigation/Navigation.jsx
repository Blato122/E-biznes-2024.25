import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ cartItemsCount }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">E-Shop</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Products
          </Link>
        </li>
        <li>
          <Link 
            to="/cart" 
            className={location.pathname === '/cart' ? 'active' : ''}
          >
            Cart {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;