import { useState } from "react";
import { User } from "../../Service/userService";
import UserForm from "../user/userForm/UserForm";

export const SignUp = () => {
    const [formData] = useState<User>({ userId: '', name: '', email: '', password: '', createDate: new Date(), organization: null } as User);

    return (
        <>
            <div className="user-container">
                <div className="form-container">
                    <UserForm user={formData} isRegistration={true}/>
                </div>
            </div>
        </>

    );
}
export default SignUp;