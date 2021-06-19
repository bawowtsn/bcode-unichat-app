//React context is one big object that contains all our data in this case user-data, and wraps all our other components through the provider tag in it so they can have access, the provider handles all our app states


import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
//importing the instance of firebase authentication we created
import { auth } from '../firebase';


//first we create a new context
const AuthContext = React.createContext();
// create a function that we  can use to grab that context
export const useAuth = () => useContext (AuthContext);

//react children renders all the jsx we pass into our provider
export const AuthProvider = ({ children }) => {
    //now lets set-up the loading and user states
    const [loading, setLoading] = useState(true);

    //we set the initial user state to null so that it will only go to /chat route when we have a user
    const [user, setUser] = useState(null);

    //now we call the useHistory hook so that we can navigate somewhere
    const history = useHistory();

    //useEffect is a function that accepts another callback function as its 1st parameter, the second parameter is a dependency array, when things change in this array then the first function will be recalled
    useEffect(() => {
        
        //we are grabbing the user from the firebase authentication
        auth.onAuthStateChanged((user) => {
            
            //set the new user as the state we're in 
            setUser(user);
            setLoading(false);
            //using react-router-dom to take us to the app url 
            if(user) history.push('/chats');
        })
    }, [user, history])

    //you always need a value object when woring with context
    const value = { user };

    return (
        <AuthContext.Provider value = { value }>
            {!loading && children}
        </AuthContext.Provider>
    )
}