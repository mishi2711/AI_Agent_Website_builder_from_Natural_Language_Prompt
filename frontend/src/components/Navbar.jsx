import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar" id="main-navbar">
            <Link to="/" className="navbar-logo">
                <span className="logo-icon">⚡</span>
                <span>AI Builder</span>
            </Link>
            <div className="navbar-links">
                <Link to="/" className={isActive('/')}>Home</Link>
                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            </div>
        </nav>
    );
}

export default Navbar;
