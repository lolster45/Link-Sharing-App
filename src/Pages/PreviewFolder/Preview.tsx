//React...
import {useState, useEffect} from "react"
import { Link } from 'react-router-dom';

//components...
import PhoneLink from "../../components/PhoneLinksFolder/PhoneLink.js";

//Firebase...
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth, database} from "../../firebase.js"

//React icons...
import {BsFillShareFill} from "react-icons/bs"

//Styles...
import "./Preview.scss"


interface UserLinkLayout {
    userId: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    image: string,
    userLinks: LinkInfo[]
}

interface LinkInfo{
    URL: string, 
    linkType: string, 
    userInput: string
}

const Preview = () => {
    const [user] = useAuthState(auth);
  
    const [userData, setUserData] = useState<UserLinkLayout | null>(null)
    const [loading, setLoading] = useState(true); // Add a loading state




    const getData = async () => {
            if (user) {
                const docRef = doc(database, "userInfo", `${user.uid}`)
                const userInfo = await getDoc(docRef)
    
                if (userInfo.exists()) {
                    const userDataFromFirestore = userInfo.data() as UserLinkLayout;
                    setUserData(userDataFromFirestore);
                } 
            }
            setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [user])


    return (
        <section id='preview-wrap'>
          <div id='purple-block'>
            <nav>
              <Link className="preview-nav-btns" to="/">Back to editor</Link>
              <Link className="preview-nav-btns" to={`/linktree/${user?.uid}`}>
                <BsFillShareFill/>
              </Link>
            </nav>
          </div>
          {/* <button onClick={() => console.log(userData)} >CLICK ME!!!</button>  */}
          <div className="preview-phone">
            <img 
                src={userData?.image || ""}
                alt="profile picture but in the preview page"
            />
            {userData?.firstName && userData?.lastName && (
                <h3>{userData.firstName} {userData.lastName}</h3>
            )}
            <p>{userData?.email}</p>
            {loading ? (
                <div>Loading...</div>
            ) : (
                userData?.userLinks.map((link: any, i: number) => (
                    <PhoneLink
                        key={i}
                        i={i}
                        item={link}
                    />
                ))
            )}
          </div>
        </section>
    );
};

export default Preview;