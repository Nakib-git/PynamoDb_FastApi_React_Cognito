import { ToastContainer } from 'react-toastify';
import './App.css';
import Router from './Components/Router';
import Nav from './Components/nav/Nav';

function App() {

  return (
    <div>
      <ToastContainer />
      <Router />
    </div>
  );
}

export default App;
