import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Employee from "./employee/EmployeeCmp";
import User from "./user/UserList";
import UserAdd from "./user/UserAdd";
import UserEdit from "./user/UserEdit";
import SignUp from "./authentication/SignUp";
import Login from "./authentication/Login";
import Nav from "./nav/Nav";
import VerficationEmail from "./authentication/VerficationEmail";
import Home from "./home/Home";

export const Router = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <div>CDAS V3 HOME</div>,
            errorElement: <div>404 not found</div>
        },
        {
            path: 'employee',
            element: <Employee />,
        },
        {
            path: 'user',
            element: <User />,
            children: [
                {
                    path: 'add-user',
                    element: <UserAdd />
                }
            ]

        }
    ]);
    return (
        <BrowserRouter >
         <Nav />
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='home' element={<Home/>} />
                <Route path='employee' element={<Employee />} />
                <Route path='user' element={<User />} />
                <Route path='user/add' element={<UserAdd />} />
                <Route path='user/edit' element={<UserEdit />} />
                <Route path='register' element={<SignUp />} />
                <Route path='login' element={<Login />} />
                <Route path='varification' element={<VerficationEmail />} />
            </Routes>
        </BrowserRouter >
    );
}
export default Router;