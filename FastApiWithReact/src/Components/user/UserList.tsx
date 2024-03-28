import { useEffect, useState } from "react";
import './User.css';
import { User, getAllUser, deleteUser, filterUserByName, filterUserByDateRange } from "../../Service/userService";
import { TableCellDateTime } from "../../Utility/common";
import { useNavigate } from "react-router-dom";
import { NotificationProps, notification } from "../notify/Notification";

export const UserList = () => {
    const [name, setName] = useState<string>()
    const [fromDate, setFromDate] = useState<string>(new Date().toISOString())
    const [toDate, setToDate] = useState<string>(new Date().toISOString())

    const [userList, setUserList] = useState<User[]>([]);
    const navigate = useNavigate();
    const getUsers = async () => {
        const users = await getAllUser();
        setUserList(users as User[]);
    };
    useEffect(() => {
        getUsers();
    }, []);

    const handleEdit = (id: string, date: Date) => {
        navigate(`/user/edit?userId=${id}&createDate=${date}`);
    };

    const handleDelete = async (userId: string, createDate: Date) => {
        await deleteUser(userId, createDate);
        notification({ message: ' User deleted successfully', type: 'delete' } as NotificationProps)
        getUsers();
    };

    const onAddUser = () => {
        navigate('/user/add');
    }
    const onSearch = async () => {
        if (name) {
            const users = await filterUserByName(name);
            setUserList(users as User[]);
        }
    }
    const onReload = () => {
        setName('');
        getUsers();
    }
    const onDateRangeSearch = async () => {
        if (fromDate && toDate) {
            const users = await filterUserByDateRange(fromDate, toDate);
            setUserList(users as User[]);
        }
    }
    return (
        <div className="user-container">
            <div className="list-container">
                <h2>User List</h2>
                <div className='search'>
                    <label >Name:</label>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                    <button className='serach-button' type='button' onClick={onSearch}>Search</button>
                    <button className='reload-button' type='button' onClick={onReload}>Reload</button>
                </div>
                <div className='search'>
                    <label htmlFor="datePicker">From date:</label>
                    <input
                        type='date'
                        id='datePicker'
                        value={fromDate.split('T')[0]}
                        onChange={(e) => setFromDate(new Date(e.target.value).toISOString())}
                    />
                    <label htmlFor="datePicker">To date:</label>
                    <input
                        type='date'
                        id='datePicker'
                        value={toDate.split('T')[0]}
                        onChange={(e) => setToDate(new Date(e.target.value).toISOString())}
                    />
                    <button className='serach-button' type='button' onClick={onDateRangeSearch}>Search</button>
                </div>
                <button className='add-button' onClick={onAddUser} type="button">Add User</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Created Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList?.map(user => (
                            <tr key={user.userId}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <TableCellDateTime datetime={user.createDate} />
                                <td>
                                    <button className='edit-button' type='submit' onClick={() => handleEdit(user.userId, user.createDate)}>Edit</button>
                                    <button className='delete-button' type='button' onClick={() => handleDelete(user.userId, user.createDate)}>Delete</button>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default UserList;