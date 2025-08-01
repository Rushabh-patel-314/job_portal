import { createContext, useState, useEffect } from "react"
import axios from "axios";
import { useAuth, useUser } from '@clerk/clerk-react'
import { toast } from 'react-toastify'

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const { user } = useUser()
    const { getToken } = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)

    const [companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)

    const [userApplications, setUserApplications] = useState([])

    // Function to fetch jobs
    const fetchJobs = async () => {
        
        try{
            const {data} = await axios.get(backendUrl + '/api/jobs')
            if(data.success){
                setJobs(data.jobs)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    // Function to fetch company data
    const fetchCompanyData = async() => {
        try{
            const {data} = await axios.get(backendUrl + '/api/company/company', {headers: {token: companyToken}})

            if(data.success){
                setCompanyData(data.company)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    // Function to fetch user data
    const fetchUserData = async() => {
        try{
            const token = await getToken()
            const {data} = await axios.get(backendUrl + '/api/user/user', {
                headers: {Authorization: `Bearer ${token}`}
            });

            if(data.success){
                setUserData(data.user)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    // Function to fetch user applied applications data
    const fetchUserApplications = async() => {
        try{
            const token = await getToken()
            const {data} = await axios.get(backendUrl + '/api/user/applications', {
                headers: {Authorization: `Bearer ${token}`}
            })

            if(data.success){
                setUserApplications(data.applications)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')

        if(storedCompanyToken){
            setCompanyToken(storedCompanyToken)
        }

    }, [])
    
    
    useEffect(() => {
        if(companyToken){
            fetchCompanyData()
        }
    }, [companyToken])
    

    useEffect(() => {
        if(user){
            fetchUserData()
            fetchUserApplications()
        }
    }, [user])

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        userData, setUserData,
        userApplications, setUserApplications,
        backendUrl,
        fetchUserData,
        fetchUserApplications
    }

    return (
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )
}