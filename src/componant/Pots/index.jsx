import { useState, useEffect } from "react";
import "./Pots.css";
import axios from "axios";
import { api } from "../Service/services";

const Pots = () => {
  const [pots, setpots] = useState([]);
  const [showbox, setShowbox] = useState(false);
  const [potname, setPotName] = useState("");
  const [target, setPotTarget] = useState("");
  const [addMoney, setAddMoney] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [potaddmoney, setPotAddMoney] = useState("");
  const [potwithdrawmoney, setPotWithdrawMoney] = useState("");
  const [id, setid] = useState(0);

  useEffect(() => {
    const getpots = async () => {
      const res = await api.get("http://localhost:8081/api/pots");
      setpots(res.data);
    };
    getpots();
  }, []);

  const handleadd = () => {
    setShowbox(true);
  };

  const handleawithdrawbtn = () => {
    setWithdraw(true);
  };

  const handleaddmoneybtn = () => {
    setAddMoney(true);
  };

  const handleaddmoney = () => {
    const getpots = async () => {
      api.put(`http://localhost:8081/api/addMoney/${potaddmoney}/${id}`);
    };
    getpots();
  };

  const handlewithdraw = (e) => {
    const getpots = async () => {
      api.put(`http://localhost:8081/api/withdraw/${potwithdrawmoney}/${id}`);
    };
    getpots();
  };

  const handleSubmit = () => {
    const addpot = { potname, target };
    const getpots = async () => {
      api.post("http://localhost:8081/api/addPot", addpot);
    };
    getpots();
  };


  return (
    <div className="container">
      <div className="potspage">
        <div className="topbar">
          <h1>Pots</h1>
          <button onClick={handleadd}>Add New Pot</button>

          {showbox && (
            <div className="blur">
              <div className="addPotBox">
                <h3>Add Pot</h3>
                <form onSubmit={handleSubmit} className="addPotBox">
                  <h6>Pot Name</h6>
                  <input
                    type="text"
                    value={potname}
                    onChange={(e) => setPotName(e.target.value)}
                    required
                  />
                  <h6>Target</h6>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setPotTarget(e.target.value)}
                    required
                  />
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowbox(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}

          {addMoney && (
            <div className="blur">
              <div className="addPotBox">
                <form onSubmit={handleaddmoney} className="addPotBox">
                  <h3>Add Money</h3>
                  <input
                    type="text"
                    placeholder="Add Money"
                    value={potaddmoney}
                    onChange={(e) => setPotAddMoney(e.target.value)}
                    required
                  />
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setAddMoney(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}

          {withdraw && (
            <div className="blur">
              <div className="addPotBox">
                <form onSubmit={handlewithdraw} className="addPotBox">
                  <h3>Withdraw Money</h3>
                  <input
                    type="text"
                    placeholder="Withdraw money"
                    value={potwithdrawmoney}
                    onChange={(e) => setPotWithdrawMoney(e.target.value)}
                    required
                  />
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setWithdraw(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <div className="potscollection">
          {pots.map((p) => {
            return (
              <div className="singlepot" key={p.id} onClick={() => { setid(p.id) }}>
                <div className="topbar">
                  <h4>{p.potname}</h4>
                  <span>...</span>
                </div>
                <div className="topbar">
                  <h6>Total saved</h6>
                  <span>$ {p.moneysaved}</span>
                </div>
                <div className="outerloading">
                  <div className="innerloading" style={{ width: `${p.target > 0 ? Math.min((p.moneysaved / p.target) * 100, 100) : 0}%`,backgroundColor: `${p.color}`}} ></div>
                </div>
                <div className="topbar">
                  <h6>{p.target > 0 ? Math.min((p.moneysaved / p.target) * 100, 100) : 0}%</h6>
                  <h6>Target $ {p.target}</h6>
                </div>

                <div className="topbar">
                  <button
                    className="potsbutton"
                    onClick={handleaddmoneybtn}
                  >
                    + Add Money
                  </button>
                  <button
                    className="potsbutton"
                    onClick={
                      handleawithdrawbtn
                    }
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pots;
