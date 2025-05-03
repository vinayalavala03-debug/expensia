import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/Layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext.jsx';


const Login = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const {updateUser} = useContext(UserContext)

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if(!validateEmail(email)){
            setError('Please enter a valid email address')
            return
        }
        if(!password || password.length < 8){
            setError('Password must be at least 8 characters long')
            return
        }
        setError('')

        //Login Api call

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password
            })
            const {token,user} = response.data

            if(token){
                localStorage.setItem('token',token)
                localStorage.setItem('user',JSON.stringify(user)) /**extra line added */
                updateUser(user)
                navigate('/dashboard')
            }
        } catch (error) {
            if(error.response && error.response.data.message ){
                setError(error.response.data.message)
            }else{
                setError('Something went wrong. Please try again later')
            }
        }
    }
  return (
    <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
            <h3 className='text-xl font-semibold text-black'>Welcome back</h3>
            <p className='text-xs text-slate-700 mt-[5px] mb-6'>
                Please enter your login details
            </p>

            <form onSubmit={handleLogin}>
            <Input
            value = {email}
            onChange = {({target}) => setEmail(target.value)}
            label= "Email Address"
            type = "email"
            placeholder = "John@gmail.com"
            />

            <Input
            value = {password}
            onChange = {({target}) => setPassword(target.value)}
            label= "Password"
            type = "password"
            placeholder = "Atleast 8 characters"
            />

            {error && <p className='text-red-500 text-sm'>{error}</p>}

            <button type='submit' className='btn-primary'>LOGIN</button>
            <p className='text-[13px] text-slate-800 mt-3'>Don't have an account?{" "}
                <Link to='/signup' className='font-medium text-primary underline'>
                Sign up
                </Link>
            </p>
        </form>
        </div>

    </AuthLayout>
  )
}

export default Login