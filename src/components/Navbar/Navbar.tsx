import './Navbar.css';
import CreatePost from '../CreatePost/CreatePost';
import Icon from '../Icon/Icon';
import Profiles from './Profiles';


const Navbar: React.FC = () => {

  return (
    <header>
      <div></div>
      <div className="nav-content">
        <div className='flex flex-col gap-1 align-center'>
          <div className='nav-btns'>
            <button>
              <div className="nav-icon">
                <Icon name="home"/>
              </div>
              <span>Home</span>
            </button>
            <button>
              <div className="nav-icon">
                <Icon name="search"/>
              </div>
              <span>Explore</span>
            </button>
            <button>
              <div className="nav-icon">
                <Icon name="notification"/>
              </div>
              <span>Notifications</span>
            </button>
            <button>
              <div className="nav-icon">
                <Icon name="messages"/>
              </div>
              <span>Messages</span>
            </button>
            <button>
              <div className="nav-icon">
                <Icon name="profile"/>
              </div>
              <span>Profile</span>
            </button>
            <button>
              <div className="nav-icon">
                <Icon name="more"/>
              </div>
              <span>More</span>
            </button>
          </div>
          <div className="post">
            <CreatePost />
          </div>
        </div>

        <Profiles/>
      </div>
    </header>
  )
}

export default Navbar;