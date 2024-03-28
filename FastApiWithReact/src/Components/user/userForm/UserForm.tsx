import { useState } from "react";
import { User, addUser, signUpUser, updateUser } from "../../../Service/userService";
import './UserForm.css';
import { NotificationProps, notification } from "../../notify/Notification";
import { useNavigate } from "react-router-dom";

interface UserFormProps {
    user: User,
    isRegistration?: boolean
}
export const UserForm = ({ user, isRegistration = false }: UserFormProps) => {
    const [formData, setFormData] = useState<User>(user);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.userId === '') {
            formData.contactList = [];
            await signUpUser(formData);
            notification({ message: 'User added  successfully', type: 'success' } as NotificationProps)
            if (isRegistration) {
                navigate(`/varification?email=${formData.email}`);
            }
        } else {
            await updateUser(formData.userId, formData.createDate, formData);
            notification({ message: 'User update  successfully', type: 'success' } as NotificationProps)
        }

    }
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <div className="user">
            {isRegistration && (<h2>Registration</h2>)}
            {!isRegistration && (<h2>{formData.userId === '' ? 'Add' : 'Update'} User</h2>)}
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={formData.userId} />
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleFormChange} />
                </div>
                {isRegistration && (<button type="submit">Submit</button>)}
                {!isRegistration && (<button type="submit">{formData.userId === '' ? 'Add' : 'Update'}</button>)}

            </form>
        </div>
    );
}
export default UserForm;