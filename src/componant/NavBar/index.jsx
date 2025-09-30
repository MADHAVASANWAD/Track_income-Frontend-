import { useNavigate } from "react-router";
import "./Navbar.css";
import Transaction from "../../Icons/Transactions.jsx";
import Budget from "../../Icons/Budget.jsx";
import HomeIcon from "../../Icons/HomeIcon.jsx";
import Pots from "../../Icons/Pots.jsx";
import RecurringBill from "../../Icons/RecurringBills.jsx";
import { useState } from "react";
import { islogedin } from "../../auth/index.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const [select, setSelected] = useState("");

  return (
    <> {

        islogedin() && 
   
    <nav className="navbar">
      <h1>Track Income</h1>
      <div className="navopt">
        <div
          className={select === "overview" ? "active" : "opt"}
          onClick={() => {
            navigate("/overview");
            setSelected("overview");
          }}
        >
          {" "}
          <HomeIcon color="#b3b3b3" />
          Overview
        </div>
        <div
          className={select === "transaction" ? "active" : "opt"}
          onClick={() => {
            navigate("/transaction");
            setSelected("transaction");
          }}
        >
          <Transaction color="#b3b3b3" /> Transaction
        </div>
        <div
          className={select === "budget" ? "active" : "opt"}
          onClick={() => {
            navigate("/budgets");
            setSelected("budget");
          }}
        >
          <Budget color="#b3b3b3" />
          Budgets
        </div>
        <div
          className={select === "pots" ? "active" : "opt"}
          onClick={() => {
            navigate("/pots");
            setSelected("pots");
          }}
        >
          <Pots color="#b3b3b3" /> Pots
        </div>
        <div
          className={select === "bills" ? "active" : "opt"}
          onClick={() => {
            navigate("/bills");
            setSelected("bills");
          }}
        >
          <RecurringBill color="#b3b3b3" /> Recurring bills
        </div>
      </div>
      <div>Minimize</div>
    </nav>

     }
    
    </>
  );
};

export default Navbar;
