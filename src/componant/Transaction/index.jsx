import { useEffect, useState } from "react";
import axios from "axios";
import "./Transaction.css";
import { api } from "../Service/services";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [alltrans, setAlltrans] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [showbox, setShowbox] = useState(false);
  const [transaction, setTransactionName] = useState("");
  const [date, setTransactionDate] = useState("");
  const [amount, setTransactionAmount] = useState("");
  const [recurring, setTransactionRecurring] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [transRes, budgetsRes] = await Promise.all([
          api.get("http://localhost:8081/api/transactions"),
          api.get("http://localhost:8081/api/budgets"),
        ]);
        console.log("Budgets API response:", budgetsRes.data);
        setTransactions(Array.isArray(transRes.data) ? transRes.data : []);
        setAlltrans(Array.isArray(transRes.data) ? transRes.data : []);
        setCategories(Array.isArray(budgetsRes.data) ? budgetsRes.data : []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (f) =>
          (f.transaction &&
            typeof f.transaction === "string" &&
            f.transaction.toLowerCase().includes(search.toLowerCase())) ||
          (f.category &&
            typeof f.category === "string" &&
            f.category.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (f) =>
          f.category &&
          typeof f.category === "string" &&
          f.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort by date
    if (selectedSort) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return selectedSort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    setAlltrans(filtered);
  }, [search, transactions, selectedCategory, selectedSort]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = { transaction, category: selectedCategory, date, amount: Number(amount), recurring };

    try {
      const response = await api.post("http://localhost:8081/api/addTransaction", formdata);
      setTransactions([...transactions, response.data]);
      setAlltrans([...alltrans, response.data]);
      setShowbox(false);
      setTransactionName("");
      setTransactionDate("");
      setTransactionAmount("");
      setSelectedCategory("");
      setTransactionRecurring(false);
    } catch (error) {
      console.error("Error posting transaction:", error);
    }
  };

  return (
    <div className="container">
      <div className="transactiontopbar">
        <h2>Transaction</h2>
        <button onClick={() => setShowbox(!showbox)}>Add Transaction</button>

        {showbox && (
          <div className="blur">
            <div className="addTransactionBox">
              <h3>Add New Transaction</h3>
              <form onSubmit={handleSubmit} className="addTransactionBox">
                <h6>Transaction Name</h6>
                <input
                  type="text"
                  value={transaction}
                  onChange={(e) => setTransactionName(e.target.value)}
                  required
                />
                <h6>Transaction Date</h6>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  required
                />
                <h6>Category</h6>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((t) => (
                      <option key={t.category} value={t.category}>
                        {t.category}
                      </option>
                    ))
                  ) : (
                    <option value="">No categories available</option>
                  )}
                </select>
                <h6>Amount</h6>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  required
                />
                <span>
                  Recurring:{" "}
                  <input
                    type="checkbox"
                    checked={recurring}
                    onChange={(e) => setTransactionRecurring(e.target.checked)}
                  />
                </span>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowbox(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="Tlist">
        <div className="ttopbar">
          <div className="first">
            <input
              type="text"
              placeholder="Search Transaction"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="second">
            <label>Sort by</label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </select>
            <label>Sort by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Transactions</option>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((t) => (
                  <option key={t.category} value={t.category}>
                    {t.category}
                  </option>
                ))
              ) : (
                <option value="">No categories available</option>
              )}
            </select>
          </div>
        </div>
        <div className="Theading">
          <span className="datacolumn">Recipient/Sender</span>
          <span className="datacolumn">Category</span>
          <span className="datacolumn">Transaction Date</span>
          <span className="datacolumn">Amount</span>
        </div>
        <div className="Tdata">
          {alltrans.map((t) => (
            <div className="Theading" key={t.id}>
              <span className="datacolumn">{t.transaction || "N/A"}</span>
              <span className="datacolumn">{t.category || "N/A"}</span>
              <span className="datacolumn">{t.date || "N/A"}</span>
              <span className="datacolumn" style={t.amount > 0 ? {color : "green"} :{color : "red"}  }>$ {t.amount || "N/A"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transaction;