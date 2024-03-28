import { useEffect, useState } from "react";
import { Tabs, Tab } from "../tab/Tabs";
import './User.css';
import { User, getUserById } from "../../Service/userService";
import UserForm from "./userForm/UserForm";
import UserOrganizationForm from "./userOrganization/UserOrganizationForm";
import { useParams, useSearchParams } from 'react-router-dom';
import Breadcrumbs, { Breadcrumb } from "../breadcrumbs/Breadcrumbs";
export const UserEdit = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const createDate = searchParams.get('createDate');

  const [formData, setFormData] = useState<User | null>(null);
  const getUser = async () => {
    if (userId && createDate) {
      try {
        const userData = await getUserById(userId, createDate);
        if (userData) {
          setFormData(userData);
        }
      } catch (error) {
        // setError(error.message);
      } finally {
        // setLoading(false);
      }
    }

  };
  useEffect(() => {
    if (userId) {
      getUser()
    }
  }, [userId]);

  const breadcrumbs = [
    { name: 'UserList', url: '/user' },
    { name: 'Edit User', url: '' },
  ] as Breadcrumb[]
if(!formData || formData===null)return(<div>...loading</div>)
  return (
    <>
      <Breadcrumbs paths={breadcrumbs} />
      <div className="user-container">
        <div className="form-container">
          <Tabs>
            <Tab title="User">
              <UserForm user={formData ?? {} as User} />
            </Tab>
            <Tab title="Organization">
              <UserOrganizationForm user={formData ?? {} as User} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
}
export default UserEdit;