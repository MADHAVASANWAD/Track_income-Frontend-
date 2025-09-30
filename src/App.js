import "./App.css";
import Navbar from "./componant/NavBar";
import Overview from "./componant/Overview";
import Pots from "./componant/Pots";
import Bills from "./componant/Recurring_Bills";
import Budgets from "./componant/Budgets";
import Transaction from "./componant/Transaction";
import { Routes ,Route,BrowserRouter } from "react-router";
import Login from "./componant/Login";
import { ToastContainer, toast } from 'react-toastify';



function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/pots" element={<Pots />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/bills" element={<Bills />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
