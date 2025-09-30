
const Widget = (props) => {
  return (
    <div className={props.setclass}>
        <h4>{props.gettitle}</h4>
        <h4>$ {props.getvalue}</h4>
    </div>
  )
}

export default Widget;