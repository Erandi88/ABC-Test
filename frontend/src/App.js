import logo from './logo.svg';
import './App.css';
import Test from './components/test';
import { Component } from 'react';
import Customerlist from './components/customerlist';
import ProductList from './components/productlist';
import StoreList from './components/storelist';
import SalesList from './components/saleslist';


class App extends Component {
    render() {
        return (
            <div className="App">
                <Test />
                <SalesList />
            </div >
        );
    }

}

export default App;