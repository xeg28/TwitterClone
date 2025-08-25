import './LoadingScreen.css';


const LoadingScreen: React.FC= () => {

  return (
    <div className="screen">

      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

    </div>
  )
}

export default LoadingScreen;