import { useLocation, useNavigate } from 'react-router-dom';
import './Nav.css';
import { getToken, removeToken } from '../../Service/tokenService';
import { useEffect, useState } from 'react';
import { decodeToken } from '../../Utility/common';

export const Nav = () => {
    const location = useLocation();
    // Define paths where the navbar should not be shown
    const hideNavOnPaths = ['/login', '/register', '/varification'];
    // Check if the current path is in the list of paths to hide the navbar
    const showNav = !hideNavOnPaths.includes(location.pathname);
    const isAuth = getToken() ? true : false;
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>();
    const token = getToken();
    useEffect(() => {
        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken) {
                setUserName(decodedToken.username);
            }
        }
    }, [token]);
    const onLogOut = () => {
        removeToken();
        navigate("/login");
    }
    return (
        <>
            {showNav && (
                <nav className="navbar">
                    <div className="navbar__brand">CDAS V3 - ({userName})</div>
                    <ul className="navbar__list">
                        <li className="navbar__item"><a href="/">Home</a></li>
                        <li className="navbar__item"><a href="/Employee">Employee</a></li>
                        <li className="navbar__item"><a href="/user">User</a></li>
                        {!isAuth && (<li className="navbar__item"><a href="/login">LogIn</a></li>)}
                        {isAuth && (<li onClick={onLogOut} className="navbar__item"><a href="">LogOut</a></li>)}
                    </ul>
                </nav>
            )}
        </>
    );
};

export default Nav;

