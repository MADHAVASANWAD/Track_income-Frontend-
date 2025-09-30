import { useState, useEffect } from "react";
import Pots from "../../Icons/Pots";
import Twidget from "./Twidget";
import Widget from "./widget";
import "./Overview.css";
import { PieChart, Pie } from "recharts";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router";
import { api } from "../Service/services";
import { toast } from "react-toastify";
import { dologout, islogedin } from "../../auth";

function Overview() {
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState(0);
    const [currentBal, setCurrentBal] = useState(0);
    const [budgets, setBudgets] = useState([]);
    const [pots, setPots] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [bills, setBills] = useState([]);
    const [potsSum, setPotsSum] = useState(0);
    const [billsSum, setBillsSum] = useState(0);
    const [error, setError] = useState(null);
    const [upcoming, setUpcoming] = useState(0);
    const navigate = useNavigate();
    const [totalincome, settotalincome] = useState(0);
    const [islogin, setislogin] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [incomeRes, budgetsRes, potsRes, transactionsRes, billsRes] = await Promise.all([
                    api.get("/api/income"),
                    api.get("/api/budgets"),
                    api.get("/api/pots"),
                    api.get("/api/transactions"),
                    api.get("/api/bills"),
                ]);
                setIncome(incomeRes.data || 0);
                setBudgets(Array.isArray(budgetsRes.data) ? budgetsRes.data : []);
                setPots(Array.isArray(potsRes.data) ? potsRes.data : []);
                setTransactions(Array.isArray(transactionsRes.data) ? transactionsRes.data : []);
                setBills(Array.isArray(billsRes.data) ? billsRes.data : []);
                setError(null);


            } catch (error) {
                console.error("Error fetching data:", error.message);
                setError("Failed to load data. Please try again.");
            }
        };
        fetchData();
        

    }, []);

    useEffect(() => {
        const expensesTotal = transactions
            .filter((t) => t.amount < 0)
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        setExpenses(-expensesTotal);

        const totalIncome = income.reduce((sum, item) => sum + (item.income || 0), 0);
        settotalincome(totalIncome);
        setCurrentBal(totalIncome + expensesTotal);
        console.log("income obj");
        console.log(totalIncome);

    }, [income, transactions]);

    useEffect(() => {
        const potsTotal = pots.reduce((sum, pot) => sum + (pot.moneysaved || 0), 0);
        const billsTotal = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
        const paid = transactions
            .filter((t) => t.recurring === true)
            .reduce((sum, bill) => sum + (bill.amount || 0), 0);
        setPotsSum(potsTotal);
        setBillsSum(paid);
        setUpcoming(billsTotal - paid);
    }, [pots, bills, transactions]);

    const pieData = budgets
        .map((b) => ({
            name: b.category || "N/A",
            value:
                transactions
                    .filter((t) => t.category === b.category && typeof t.amount === "number")
                    .reduce((sum, t) => sum + (-t.amount), 0) || 0,
            fill: b.color || "#cccccc",
        }))
        .filter((item) => item.value !== 0);

    const handlelogout = () => {
        dologout();
        toast.warning("Logout success...");
        navigate("/");
    }

    useEffect(() => {
      setislogin(islogedin());
    }, [islogin])
    

    


    return (
        <div className="container">
            {error && <div className="error">{error}</div>}
            <div className="insidebox">
                <div className="topbar">
                    <h2>Overview</h2>
                    <div className="topbar">
                        <h4>Welcome { }</h4>
                        <button onClick={handlelogout} >
                            <TbLogout2 /> Logout
                        </button>
                    </div>

                </div>
                <div className="div2">
                    <Widget setclass="dark" gettitle="Current Balance" getvalue={currentBal} />
                    <Widget setclass="widget" gettitle="Income" getvalue={totalincome} />
                    <Widget setclass="widget" gettitle="Expenses" getvalue={expenses} />
                </div>
                <div className="div3">
                    <div className="element1">
                        <div className="topbar">
                            <h3>Pots</h3>
                            <h6>See Details</h6>
                        </div>
                        <div className="ediv2">
                            <div className="potswidget">
                                <Pots className="picon" color="#41a384ff" />
                                <Widget gettitle="Pots" getvalue={potsSum} />
                            </div>
                            <div className="collection">
                                {pots
                                    .filter((p) => p.id < 4)
                                    .map((p) => (
                                        <Widget
                                            key={p.id}
                                            setclass="miniwidget"
                                            gettitle={p.potname || "N/A"}
                                            getvalue={p.moneysaved || 0}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="element2">
                        <div className="topbar">
                            <h3>Budgets</h3>
                            <h6>See Details</h6>
                        </div>
                        <div className="budget">
                            <div className="box">
                                {pieData.length > 0 ? (
                                    <PieChart width={350} height={220}>
                                        <Pie
                                            data={pieData}
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
                            </div>
                            <div className="budgetwidgetcontainer">
                                {budgets
                                    .filter((p) => p.id < 5)
                                    .map((p) => (
                                        <Widget
                                            key={p.id}
                                            setclass="bwidget"
                                            gettitle={p.category || "N/A"}
                                            getvalue={
                                                transactions
                                                    .filter((t) => t.category === p.category && typeof t.amount === "number")
                                                    .reduce((sum, t) => sum + (-t.amount), 0) || 0
                                            }
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="element3">
                        <div className="transaction">
                            <div className="topbar">
                                <h3>Transactions</h3>
                                <h6>See Details</h6>
                            </div>
                            {transactions.length > 0 ? (
                                transactions
                                    .filter((p) => p.id < 5)
                                    .map((p) => (
                                        <Twidget
                                            key={p.id}
                                            setclass="twidget"
                                            gettitle={p.transaction || "N/A"}
                                            getvalue={p.amount || 0}
                                            gettimestamp={p.date || "N/A"}
                                        />
                                    ))
                            ) : (
                                <p>
                                   No transactions available
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="element4">
                        <div className="topbar">
                            <h3>Recurring Bills</h3>
                            <h6>See Details</h6>
                        </div>
                        {bills.length > 0 ? (
                            <>
                                <Widget setclass="billwidget" gettitle="Paid Bills" getvalue={billsSum} />
                                <Widget setclass="billwidget" gettitle="Total Upcoming" getvalue={upcoming} />
                                <Widget setclass="billwidget" gettitle="Due Soon" getvalue={0} />
                            </>
                        ) : (
                            <p>
                                No bills available
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;