import { useState } from "react";
import { User, UserOrganization, addUser, updateUser } from "../../../Service/userService";
import './UserOrganizationForm.css';
import { NotificationProps, notification } from "../../notify/Notification";

interface UserOrganizationFormProps {
    user: User
}
export const UserOrganizationForm = ({ user }: UserOrganizationFormProps) => {
    const [formData, setFormData] = useState<UserOrganization>(user.organization ? user.organization : { orgId: '', orgName: '', orgAddress: '', createDate: new Date() } as UserOrganization);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData) {
            user.organization = formData
            if (!user.organization.orgAddress) {
                user.organization.orgAddress = ''
            }
            await updateUser(user.userId, user.createDate, user);
            if (user.organization.orgId === '') {
                notification({ message: ' User organization added  successfully', type: 'success' } as NotificationProps)
            } else {
                notification({ message: ' User organization update  successfully', type: 'success' } as NotificationProps)
            }
            setFormData(user.organization as UserOrganization);
        }
    }
    const handleFormChange = (e: React.ChangeEvent<any>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <div className="organization">
            <h2>{formData.orgId === '' ? 'Add' : 'Update'} User Organization</h2>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={formData.orgId} />
                <div>
                    <label>Name:</label>
                    <input type="text" name="orgName" value={formData.orgName} onChange={handleFormChange} />
                    <label>Address:</label>
                    <textarea name="orgAddress" value={formData.orgAddress} onChange={handleFormChange}/>
                </div>
                <button type="submit">{formData.orgId === '' ? 'Add' : 'Update'}</button>
            </form>
        </div>
    );
}
export default UserOrganizationForm;