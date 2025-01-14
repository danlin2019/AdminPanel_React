import loadingImg from "../assets/loading.svg";
const loading = ({loadingText}) =>{
  return (
    <div className="loading">
      <div className="">
        <img src={loadingImg}/>
        {loadingText}
      </div>

    </div>
  )
}

export default loading