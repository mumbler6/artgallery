import './Navbar.css';
import { NavLink } from 'react-router-dom';
import logo from './assets/AIC_logo.png';
import { GoSearch } from 'react-icons/go';

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-left"> 
                <img src={logo} alt="Logo" />
            </div>
            <div className='navbar-content'>
                <p> Artworks Collection </p>
                <div className="navbar-right"> 
                    <NavLink to="/" className="nav-button"> Gallery </NavLink>
                    <NavLink to="/list" className="nav-button"> <GoSearch/> </NavLink>
                </div>
            </div>
        </header>
    );
}