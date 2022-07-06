import { useContext } from "react";

const DataContext = React.createContext();

export const useData = () => {
    return useContext(DataContext);
}

export const DataHandler = ({children}) => {
    const [user , setUser] = useState({});
    
    ///////////////////////////////////////////
    const getUserData = () => {

    }
    return (
        <DataContext.Provider>
        {children}
        </DataContext.Provider>
    )
}