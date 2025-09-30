import "./Bills.css";
import Widget from "../Overview/widget";
import RecurringBills from "../../Icons/RecurringBills";
import { useState, useEffect } from "react";
import axios, { all } from "axios";
import { api } from "../Service/services";

const Bills = () => {
  const [search, setSearch] = useState("");
  const [bills, setbills] = useState([]);
  const [dues, setdues] = useState(0);
  const [paid, setpaid] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [all, setall] = useState(0);
  const [upcoming, setupcoming] = useState(0);
  const [filterdrecurring, setfilterdrecurring] = useState([]);

  useEffect(() => {
    const getbills = async () => {
      const res = await api.get("http://localhost:8081/api/bills");
      const all = await api.get("http://localhost:8081/api/transactions");
      setbills(res.data);
      setTransactions(all.data);
      setfilterdrecurring(res.data);
    }
    getbills();
  }, [])



  useEffect(() => {
    const dues = bills.reduce((sum, bill) => sum < (bill.duedate || 0), 0);
    const billsTotal = transactions.filter((f) => f.recurring === true).reduce((sum, bill) => sum + (bill.amount || 0), 0);
    const allt = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
    const upcoming = allt - billsTotal;
    setupcoming(upcoming);
    setall(allt);
    setpaid(billsTotal);
    setdues(dues);
  }, [dues, bills]);


  const handlesearch = (e) => {
    setSearch(() => e.target.value);
  }

  useEffect(() => {
    const getfiltered = () => {
      const showfiltered = bills.filter((m)=> m.title.toLowerCase().includes(search));
      setfilterdrecurring(showfiltered);
    }
    getfiltered();
  }, [search])

  return (
    <div className="container">
      <h1>Recurring Bills</h1>
      <div className="recurringbox">
        <div className="totalbills">
          <RecurringBills color="white" />
          <div>
            <h3>Total Bills</h3>
            <h1>${all}</h1>
          </div>
        </div>
        <div className="records">
          <div className="topbar">
            <input type="text" placeholder="search here" value={search} onChange={handlesearch} />
          </div>

          <div className="biilsrecordcss">
            <span>Bill Title</span>
            <span>Due Date</span>
            <span>Amount</span>
          </div>
          <div className="recordlist">
            {
              filterdrecurring.map((b) => {
                return (
                  <div className="biilsrecordcss" key={b.id}>
                    <h4>{b.title}</h4>
                    <h4>{b.duedate}</h4>
                    <h4>{b.amount}</h4>
                  </div>
                )
              })
            }
          </div>



        </div>
        <div className="recurringsummery">Summery
          <Widget setclass="recurringwidget" gettitle="Paid Bills" getvalue={paid} />
          <Widget setclass="recurringwidget" gettitle="Total Upcoming" getvalue={upcoming} />
          <Widget setclass="recurringwidget" gettitle="Due Soon" getvalue={0} />
        </div>
      </div>

    </div>
  )
}

export default Bills;