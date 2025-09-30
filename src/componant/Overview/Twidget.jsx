import "./Overview.css";
import Transactions from "../../Icons/Transactions";

const Twidget = (props) => {
    return (
        <div className={props.setclass}>
            <Transactions color="green" />
            <div style={{width:"75%"}}>{props.gettitle}</div>
            <div className={props.getvalue > 0 ? "twidget2" : "tmini" }>
                <h3>$ {props.getvalue}</h3>
                <h6>{props.gettimestamp}</h6>
            </div>

        </div>
    )
}

export default Twidget;