import { useState } from "react";
import './User.css';
import { User } from "../../Service/userService";
import UserForm from "./userForm/UserForm";
import Breadcrumbs, { Breadcrumb } from "../breadcrumbs/Breadcrumbs";

export const UserAdd = () => {
    const [formData] = useState<User>({ userId: '', name: '', email: '', password: '', createDate: new Date(), organization: null } as User);
    const breadcrumbs = [
        { name: 'UserList', url: '/user' },
        { name: 'Add User', url: '' },
    ] as Breadcrumb[]
    return (
        <>
            <Breadcrumbs paths={breadcrumbs} />
            <div className="user-container">
                <div className="form-container">
                    <UserForm user={formData} />
                </div>
            </div>
        </>

    );
}
export default UserAdd;