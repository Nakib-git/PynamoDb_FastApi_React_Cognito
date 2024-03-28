import { useEffect, useState } from "react";
import './Home.css';
import { getToken } from "../../Service/tokenService";
import { decodeToken } from "../../Utility/common";

export const Home = () => {
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


    return (
        <div className="home-container">
            <div className="form-container">
                <h2>Welcome to CDASS V3 (Demo Project)</h2>
            </div>
        </div>

    );
}
export default Home;