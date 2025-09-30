import { useState, useEffect } from "react";
import axios from "axios";
import Widget from "../Overview/widget";
import Bwidget from "./bwidget";
import "./Budgets.css";
import { PieChart, Pie } from "recharts";
import { api} from "../Service/services";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [data01, setData01] = useState([]);
  const [showbudget, setshowbudget] = useState(false);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const [budgetsRes, transactionsRes] = await Promise.all([
          api.get("http://localhost:8081/api/budgets"),
          api.get("http://localhost:8081/api/transactions"),
        ]);
        setBudgets(budgetsRes.data);
        setTransactions(transactionsRes.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load budgets or transactions. Please try again.");
      }
    };
    getCategory();
  }, []);

  useEffect(() => {
    const piedata = budgets.map((b) => ({
      name: b.category || "N/A",
      value:
        transactions
          .filter((t) => t.category === b.category && typeof t.amount === "number")
          .reduce((sum, t) => sum + (-t.amount), 0) || 0,
      fill: b.color || "#cccccc",
    }));
    setData01(piedata);
  }, [budgets, transactions]);

  const summaryData = budgets.slice(0, 4).map((budget) => {
    const spent = transactions
      .filter((t) => t.category === budget.category && typeof t.amount === "number")
      .reduce((sum, t) => sum + (-t.amount), 0);
    return {
      category: budget.category,
      spent,
      remaining: (budget.limit || 0) - spent,
    };
  });

  const totalspent = summaryData.reduce((sum, item) => sum + item.spent, 0);

  return (
    <div className="container">
      {error && <div className="error">{error}</div>}
      <div className="transactiontopbar">
        <h2>Budgets</h2>
        <button>Add New Budget</button>


      </div>
      <div className="budgetbox">
        <div className="summarybox">
          <div className="chartb">
            {data01.length > 0 ? (
              <PieChart width={350} height={220}>
                <Pie
                  data={data01}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label
                />
              </PieChart>
            ) : (
              <p>No budget data available</p>
            )}
            <span>Total Spent : {totalspent}</span>
          </div>
          <div className="summaryb">
            {summaryData.length > 0 ? (
              summaryData.map((item, index) => (
                <Widget
                  key={item.category || index}
                  setclass="sumbox"
                  gettitle={item.category || "N/A"}
                  getvalue={item.spent}
                />
              ))
            ) : (
              <p>No summary data available</p>
            )}
          </div>
        </div>
        <div className="divbbox">
          {budgets.map((b) => (
            <Bwidget
              key={b.id || b.category}
              setclass="bbox"
              gettitle={b.category || "N/A"}
              getvalue={b.limit || 0} 
              getcolor={b.color || "#cccccc"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Budgets;