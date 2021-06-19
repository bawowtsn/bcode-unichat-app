import React, { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ChatEngine } from 'react-chat-engine'
import { auth } from '../firebase'

import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const Chats = () => {
    //we call history as a react hook useHistory
    const history = useHistory();

    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    
    const handleLogout = async () => {
        await auth.signOut();

        //we use history to renavigate so users can login again after logout
        history.push('/');
    }
    
    const getFile = async (url) => {
        const response = await fetch(url);
        const data = await response.blob();

        return new File([data], "userPhoto.jpg", { type: 'image/jpeg' })
    }

    useEffect(() => {
        if(!user|| user === null) {
            history.push('/');
            return;
        }

            //this code is calling a chat api to get the already created user, to show us their chat
        axios.get('https://api.chatengine.io/users/me', {
            headers: {
                "project-id": "dbac2952-3a47-4729-a7e1-5a6117f1973d",
                "user-name": user.email,
                "user-secret": user.uid,
            }
        })
        .then(() => {
            setLoading(false);
        })

        //if we do not have an existing user then we use the code below to create them
        .catch(() => {
            let formdata = new FormData();
            formdata.append('email', user.email);
            formdata.append('username', user.email);
            formdata.append('secret', user.uid);
            

            //we are calling an api here to get an image
            getFile(user.photoURL)
                .then((avatar) => {
                    formdata.append('avatar', avatar, avatar.name);

                    // calling a chat engine api to create a user
                    axios.post('https://api.chatengine.io/users/', 
                    formdata,
                    { headers: { "private-key": "6605e35d-293b-450f-9945-90328354c3eb" }}
                    )
                    .then(() => setLoading(false))
                    .catch((error) => console.log(error))

                })
            }
        )
    }, [user, history]);


    if(!user || loading) return 'Loading...'

    return (
       
        <div className="chats-page">
            <div className="nav-bar">
                <div className="logo-tab">
                    b-portfoliochat
                </div>
                <div onClick={handleLogout} className="logout-tab">
                    Logout
                </div>
            </div>

            <ChatEngine 
                height="calc(100vh - 66px)"
                //the project id is gotten from chatengine site
                projectID="dbac2952-3a47-4729-a7e1-5a6117f1973d"
                userName = { user.email }
                userSecret = { user.uid }
            />
        </div>
    )
}

export default Chats;