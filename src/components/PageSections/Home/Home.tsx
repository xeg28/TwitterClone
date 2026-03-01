import OptionBar from "../../Layout/OptionBar/OptionBar";
import { useState } from "react";
import Topbar from "../../Layout/Topbar/Topbar";
const Home:React.FC = () => {
  
  const [node, setNode] = useState<number>(0);
  const components = [
    (<div>
      For You
    </div>), 
    (<div>Following</div>)
  ];

  return (
    <div>
      <Topbar navMenu >
        <OptionBar optionTitles={["For you", "Following"]} nodeIndex={node} setNodeIndex={setNode}/>
      </Topbar>
      {components && <>{components[node]}</>}
    </div>
  )
}

export default Home;