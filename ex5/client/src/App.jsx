import React from 'react';
import Products from './components/Products/Products';
import Payments from './components/Payments/Payments';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>E-commerce Shop</h1>
      </header>
      <main>
        <Products />
        <Payments />
      </main>
    </div>
  );
}

export default App;