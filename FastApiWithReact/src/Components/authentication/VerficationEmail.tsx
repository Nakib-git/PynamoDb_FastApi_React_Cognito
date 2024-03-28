import { useState } from "react";
import './Auth.css';
import { EmailVerfication, verificationEmail } from "../../Service/userService";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { NotificationProps, notification } from "../notify/Notification";

export const VerficationEmail = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const [formData, setFormData] = useState<EmailVerfication>({ email: email, verficationCode: '' } as EmailVerfication);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await verificationEmail(formData);
        notification({ message: 'Email is verified.', type: 'success' } as NotificationProps)
        navigate('/login');
    }
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <div className="email-container">
            <div className="form-container">
                <div className="userlogin">
                    <h2>Email confirmation</h2>
                    <form onSubmit={handleSubmit}>
                        {/* <input type="hidden" name="id" value={formData.id} /> */}
                        <div>
                            <label>Email:</label>
                            <input readOnly type="email" name="email" value={formData.email} onChange={handleFormChange} />
                        </div>
                        <div>
                            <label>Code:</label>
                            <input type="number" name="verficationCode" value={formData.verficationCode} onChange={handleFormChange} />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>

    );
}
export default VerficationEmail;