//React...
import {Link} from "react-router-dom"

//Firebase...
import {signOut} from "firebase/auth"
import {auth} from "../../firebase.js"
import {useAuthState} from "react-firebase-hooks/auth";

//Logo img...
import Logo from "/Logo(TreeChain).png"

//React icons...
import {BsFillShareFill} from "react-icons/bs"

//Styles...
import "./Navigation.scss"


const Navigation: React.FC<{
    setShowProfDetails: Function;
    showProfDetails: boolean;
    setUserLinks: Function;
    setUserInfo: Function
  }> = ({ setShowProfDetails, showProfDetails, setUserLinks, setUserInfo }) => {

    const [user] = useAuthState(auth)

    const userSignOut = async () => {
        await signOut(auth)
        setUserLinks([])
        setUserInfo({
            firstName: "",
            lastName: "",
            email: "",
            image: ""
        })

    }

    return (
        <nav>
            <div className='logo-wrap'>
                <img src={Logo}/>
            </div>
            <div className='middle-menu'>
                
                <button 
                    className={!showProfDetails ? "active" : ""}
                    onClick={() => setShowProfDetails(false)}
                >
                    Links
                </button>
                <button 
                    className={showProfDetails ? "active" : ""}
                    onClick={() => setShowProfDetails(true)}
                >
                    ProfileDetails
                </button>
            </div>
            <div id="last-block">
                {user?.uid && 
                    <Link id="share-btn" to={`/linktree/${user?.uid}`}>
                        <BsFillShareFill/>
                    </Link>
                }
            
                {user && <button onClick={userSignOut}>Log out</button>}
                {user && <Link to={`/preview/${user.uid}`} className='preview-btn'>Preview</Link>}
                {!user && <Link to="/signUp" className="preview-btn">Sign Up</Link>}
            </div>
        </nav>
    );
};

export default Navigation;