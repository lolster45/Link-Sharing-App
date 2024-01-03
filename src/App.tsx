//REACT...  
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//Components...
import SignUp from './Pages/SignUpFolder/SignUp'
import Preview from './Pages/PreviewFolder/Preview.js'
import Navigation from './components/Navigation/Navigation'
import PhoneLink from './components/PhoneLinksFolder/PhoneLink.js'
import UserInputBlock from './components/UserInputFolder/UserInput'
import UserLinkTree from './Pages/UserLinkTreeFolder/UserLinkTree.js'

//Firebase...
import * as firebase from "./firebase.js";
  // Use type assertions to treat the imported values as 'any'
  const auth = firebase.auth as any;
  const database = firebase.database as any;
  // Now you can use 'auth' and 'database' without type checking
import { useAuthState } from 'react-firebase-hooks/auth'
import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"


//React icons...
import {AiFillLinkedin} from "react-icons/ai"
import {PiGithubLogoFill} from "react-icons/pi"
import {BsCardImage, BsYoutube} from "react-icons/bs"

//Styles...
import "./index.scss"


interface UserLinkBlocks {
  linkType: string,
  URL: string,
  userInput: string
}


interface UserInfoInt {
  firstName: string,
  lastName: string,
  email: string,
  image: string
}

function App() {

  const [loading, setLoading] = useState(true); // Add a loading state
  const [user] = useAuthState(auth)

  //Counts how many userLink blocks the user has added in curretn session...
    const [addedLinks, setAddedLinks] = useState<number>(0);

  //Data on userLinks/userInfo...
    const [userLinks, setUserLinks] = useState<UserLinkBlocks[]>([])
    const [userInfo, setUserInfo] = useState<UserInfoInt>({
      firstName: "",
      lastName: "",
      email: "",
      image: ""
    })

  //Change profile picture...
    const handleProfilePicChange = (e:any) => {
      
      const file = e.target.files[0];
      // Read the file and generate a data URL
      const reader = new FileReader();

      reader.onloadend = () => {

        setUserInfo(prev => ({
          ...prev,
          image: String(reader.result)
        }))

      };
      reader.readAsDataURL(file);
    }

  //Changes user info...
    const handleUserInfoChange = (e:any) => {
      setUserInfo(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }))
    }

  //It adds new block link to front end...
    const addNewLink = () => {
      if(userLinks.length > 2) return;

      setAddedLinks(prev => prev + 1);
      setUserLinks(prev => [...prev, {linkType: "GitHub", URL: "https://github.com/", userInput: ""}])
    }

  //Creates account...
  const createUserInfo = async () => {
    console.log("creating account...")
    await setDoc(doc(database, "userInfo", user?.uid as string), {
        userId: user?.uid,
        username: user?.displayName,
        ...userInfo,
        userLinks: [...userLinks]
    });
    console.log("done creating account...")
  }
  //Check if user previously has made an account...
  const doesUserHaveAccount = async () => {
      try {
          const res = await getDoc(doc(database, "userInfo", user?.uid as string))
          if (!res?.data()) {
              return false;
          }
          return true;
      } catch (error) {
          throw error
      }
  }

  const getData = async () => {
    if (user) {
        const docRef = doc(database, "userInfo", `${user.uid}`)
        const userInfo = await getDoc(docRef)

        if (userInfo.exists()) {
          let base = userInfo.data();
            //const userDataFromFirestore = userInfo.data() as UserLinkLayout[];
            setUserLinks(base.userLinks.map((item: string) => item));
            setUserInfo(prev => ({
              ...prev,
              firstName: base.firstName,
              lastName: base.lastName,
              email: base.email,
              image: base.image
            }))
        } 
    }
    setLoading(false)
  }

  useEffect(() => {
    const check = async () => {
      if (user && user?.uid) {
        let userAccount = await doesUserHaveAccount();
        if (!userAccount) {
          await createUserInfo();
        }
        console.log("Account created or already exists");
      } else {
        console.log("User not yet available");
      }
    };

    getData()


    setTimeout(check, 3000);
  }, [user]);

  //Matches the logo on the users links they added...
  const LogoMatch = (linkType: string) => {
    if(linkType === "GitHub") return <PiGithubLogoFill/>

    if(linkType === "Youtube") return <BsYoutube/>

    if(linkType === "Linkedin") return <AiFillLinkedin/>

    return <></>
  }

  const areArraysEqual = (array1: object, array2: object) => {
    return JSON.stringify(array1) === JSON.stringify(array2);
  };

  //handles saving into firebase and frontend...
    const [showProfDetails, setShowProfDetails] = useState<boolean>(false);

    const [saving, setSaving] = useState(false);
    const saveChanges = async () => { 
      try {
        console.log("started saving")

        setSaving(true)

        const docRef = doc(database, "userInfo", user?.uid as string);
        const userInfoFire = await getDoc(docRef);
        

        if(userInfoFire.exists()) {
          console.log("started")
          
          let firebaseObj = userInfoFire.data();
          console.log("found firebaseObj")
          if(showProfDetails) {
            console.log("entered showprofdetails part")
            if(
              firebaseObj.firstName === userInfo.firstName &&
              firebaseObj.lastName === userInfo.lastName &&
              firebaseObj.image === userInfo.image &&
              firebaseObj.email === userInfo.email 
              ) {
                console.log("found problem")
                return;
              }
            else {
              console.log("entered else part")
              const Obj = {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                image: userInfo.image,
                email: userInfo.email
              };

              await updateDoc(docRef, Obj)
              return;
            }

          }
          console.log("exited main part and went to second part")
          
          if(!showProfDetails) {
            let existingUserInput = userInfoFire.data().userLinks.map((item: any) => item.userInput);
            let currentLinks = userLinks.map(item => item.userInput);

            if (areArraysEqual(existingUserInput, currentLinks)) {
              console.log("they are the same, nothing is saved")
              setSaving(false)
              return false
            }
            else {
              if(addedLinks === 0) {
                await updateDoc(docRef, {
                  userLinks: userLinks
                });
                console.log("updated current block links")
                setSaving(false)
              }
              else {
                let newUserBlocks = [...userLinks].splice(-addedLinks);
    
                await updateDoc(docRef, {
                    userLinks: arrayUnion(...newUserBlocks)
                }) 
                console.log("added new block links")
                setSaving(false)
    
              } 
            }
          }

        }
        else {
          console.error("No document found for the user:", user?.uid);
          // Optionally, update the UI to inform the user
        }

      } 
      catch (error) {
        console.log(error)
      }
    }

    const debouncedSave = debounce(saveChanges, 1000);

 

  return (
    <Router>
      <div className='app'>
          <Routes>
            <Route path='/' element={
              <>
                <Navigation 
                  setShowProfDetails={setShowProfDetails} 
                  showProfDetails={showProfDetails}
                  setUserInfo={setUserInfo}
                  setUserLinks={setUserLinks}
                />
                <section className='main-content-section'>
                <div className='phone-preview'>
                  <div className='image-container'>
                    {user?.uid &&
                    <>
                      <img src={userInfo.image || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"}/>
                      <span>{userInfo.firstName} {userInfo.lastName}</span>
                      <span>{userInfo.email}</span>
                      <div className='link-column'>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            userLinks.map((link: any, i: number) => (
                                <PhoneLink
                                    key={i}
                                    i={i}
                                    item={link}
                                />
                            ))
                        )}
                      </div>
                    </>
                    }
                    {user?.uid === undefined && <h1 id='sign-up-phone-txt'>Pls Sign Up</h1>}
                  </div>
                </div>
                <div className='right-side-wrap'>
                    <div className='user-input-wrap'>
                        {!showProfDetails &&
                        <>
                          <h1>Customize your links</h1>
                          <p>Add/edit/remove links below and then share all your profiles with the world!</p>
                          <button onClick={addNewLink}>+Add new link</button>     
                          <form>
                            {
                              userLinks.map((item, i:number) => (
                                <UserInputBlock 
                                  key={i}
                                  index={i}
                                  linkType={item.linkType} 
                                  URL={item.URL}
                                  userInput={item.userInput}
                                  setUserLinks={setUserLinks}
                                  LogoMatch={LogoMatch}
                                  addedLinks={addedLinks}
                                  setAddedLinks={setAddedLinks}
                                />
                              ))
                            }
                          </form>
                        </>
                        }
                        {showProfDetails && 
                          <>
                            <h2>Profile Details</h2>
                            <p>Add your details to create a personal touch to your profile</p>
                            <section className='profile-change-details'>
                              <div id='first-half'>
                                <span>Profile picture</span>
                                <label htmlFor="file-upload" id='change-photo-link' >
                                  <BsCardImage/>
                                  <span>Change Image</span>
                                  {user &&
                                    <img 
                                      src={userInfo.image || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"} 
                                      alt='user profile picture'
                                    />  
                                  }
                                </label>
                                <input 
                                  id='file-upload' 
                                  type="file" 
                                  accept="image/JPG" 
                                  style={{display: "none"}} 
                                  onChange={handleProfilePicChange}
                                />
                              </div>
                              <div className='input-wrap'>
                                <span>First Name</span>
                                <input 
                                  name='firstName' 
                                  onChange={handleUserInfoChange} 
                                  placeholder={userInfo.firstName}
                                />
                              </div>
                              <div className='input-wrap'>
                                <span>Last Name</span>
                                <input 
                                  name='lastName' 
                                  onChange={handleUserInfoChange} 
                                  placeholder={userInfo.lastName}
                                />
                              </div>
                              <div className='input-wrap'>
                                <span>Email</span>
                                <input 
                                  name='email' 
                                  type='email' 
                                  onChange={handleUserInfoChange} 
                                  placeholder={userInfo.email}
                                />
                              </div>
                            </section>
                          </>
                        }                 
                    </div>
                    {user &&
                      <section className='save-wrap'>
                        <button 
                          onClick={debouncedSave} 
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </section>  
                    }
                </div>                 
                </section>
              </>
            }/>
            <Route path='/preview/:id' element={<Preview/>}/>
            <Route 
              path='/linktree/:id' 
              element={<UserLinkTree/>}
            />
            <Route path='/signUp' element={<SignUp/>}/>
          </Routes>
      </div>
    </Router>
  )
}

export default App


const debounce = (func: any, delay: any) => {
  let timeoutId: any

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};