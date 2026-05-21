import OptionBar from "../../Layout/OptionBar/OptionBar";
import Topbar from "../../Layout/Topbar/Topbar";
const Home:React.FC = () => {
  
  const components = [
    (<div>
      For You
    </div>), 
    (<div>Following</div>)
  ];

  return (
    <div>
      <Topbar navMenu >
        <OptionBar optionTitles={["For you", "Following"]} components={components}/>
      </Topbar>
    </div>
  )
}

export default Home;