import Topbar from "../../Layout/Topbar/Topbar";

interface UserNotFoundProps {
  handleBack: () => void;
}

const UserNotFound: React.FC<UserNotFoundProps> = ({handleBack}) => {
  return (
    <div>
    <Topbar handleBack={handleBack} >
      <div className="fs-lg bolder">Profile</div>
    </Topbar>
    <div className='flex m-2 p-2 justify-content-center'>
      <div>
        <div className='fs-xl bolder'>This account doesn't exist.</div>
        <div className="dimm-text">
          Try searching another
        </div>
      </div>
    </div>
  </div>
  )
}

export default UserNotFound;