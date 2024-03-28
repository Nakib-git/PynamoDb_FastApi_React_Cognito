import { useState } from "react";
import './Auth.css';
import { Login as LoginModel, loginUser } from "../../Service/userService";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../../Service/tokenService";

export const Login = () => {
    const [formData, setFormData] = useState<LoginModel>({ email: '', password: '' } as LoginModel);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = await loginUser(formData);
        setToken(token);
        navigate('/home');

    }
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <div className="login-container">
            <div className="form-container">
                <div className="userlogin">
                    <h2>Log In</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="id" value={formData.id} />
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleFormChange} />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input type="password" name="password" value={formData.password} onChange={handleFormChange} />
                        </div>
                        <button type="submit">Login</button>
                        <div>
                            <span> Don't have an acount? <Link to={"/register"}>Register</Link></span>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    );
}
export default Login;