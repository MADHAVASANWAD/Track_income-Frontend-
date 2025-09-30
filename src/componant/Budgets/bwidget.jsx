import { useEffect, useState } from "react";
import axios from "axios";
import Twidget from "../Overview/Twidget";
import Widget from "../Overview/widget";
import "./Budgets.css";
import { api } from "../Service/services";

const Bwidget = ({ setclass, gettitle, getvalue ,getcolor}) => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await api.get("http://localhost:8081/api/budgets");
        const res2 = await api.get("http://localhost:8081/api/transactions");
        setCategories(res.data);
        setTransactions(res2.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load budgets or transactions. Please try again.");
      }
    };

    getCategory();
  }, []);

 

  // Calculate total spent for the given category
  const totalSpent = transactions
    .filter((t) => t.category === gettitle && typeof t.amount === "number")
    .reduce((sum, t) => sum + (-t.amount), 0);

  // Calculate free amount (budget - spent)
  const freeAmount = typeof getvalue === "number" ? getvalue - totalSpent : 0;

  const progressWidth = getvalue > 0 ? Math.min((totalSpent / getvalue) * 100, 100) : 0;

  return (
    <div className={setclass || "default-class"}>
      {error && <div className="error">{error}</div>}
      <div className="category">
        <h3>{gettitle || "N/A"}</h3>
        <span>...</span>
      </div>
      <h6>Maximum of ${getvalue || 0}</h6>
      <div className="outerloading">
        <div className="innerloading" style={{ width: `${progressWidth}%`,backgroundColor: `${getcolor}`}}></div>
      </div>
      <div className="spendigdiv">
        <Widget setclass="sumbox" gettitle="Spent" getvalue={totalSpent} />
        <Widget setclass="sumbox" gettitle="Free" getvalue={freeAmount} />
      </div>
      <div className="latestspending">
        <div className="topbar">
          <span>Latest Spending</span>
          <span>See All</span>
        </div>
        {transactions.length > 0 ? (
          transactions
            .filter((f) => f.category.toLowerCase() === gettitle.toLowerCase())
            .slice(0, 3)
            .map((p) => (
              <Twidget
                key={p.id || Math.random()} // Fallback key if p.id is missing
                setclass="twidgetbudget"
                gettitle={p.transaction || "N/A"}
                getvalue={p.amount || 0}
                gettimestamp={p.date || "N/A"}
              />
            ))
        ) : (
          <p>No transactions available</p>
        )}
      </div>
    </div>
  );
};

export default Bwidget;