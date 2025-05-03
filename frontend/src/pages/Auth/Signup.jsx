import React, { useContext } from 'react'
import AuthLayout from '../../components/Layouts/AuthLayout'
import { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';

const Signup = () => {
  const [profilePic,setProfilePic] = useState( null)
  const [fullName,setFullName] = useState('')
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState(false)
  const navigate = useNavigate();
  const {updateUser} = useContext(UserContext)

  const handleSignup = async (e) => {
    e.preventDefault()
    let profileImageUrl = ""
    if(!fullName || !email || !password){
      setError("Please fill all the fields")
      return
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email")
      return
    }
    if(password.length < 8){
      setError("Password must be at least 8 characters")
      return
    }
    setError('')

    //signup api call 
    try {
      //upload image if available 
      if(profilePic){
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";

      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profileImageUrl
      });
      const {token,user} = response.data;

      if(token){
        localStorage.setItem('token',token)
        updateUser(user)
        navigate('/dashboard')
      }
    } catch (error) {
      if(error){
        if(error.response && error.response.data.message){
          setError(error.response.data.message)
        }else{
          setError("Something went Wrong. Please, try again later")
        }
      }
    }
  }
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'>
            Join us today by entering your details below.
          </p>

          <form onSubmit={handleSignup}>

            <ProfilePhotoSelector
              image={profilePic}
              setImage={setProfilePic}
            />
            <div className='grid grid-col-1 md:grid-cols-2 gap-4'>
              <Input
                value={fullName}
                onChange={({target})=>setFullName(target.value)}
                label="full Name"
                placeholder="John Doe"
                type = "text"
              />

            <Input
              value ={email}
              onChange={({target})=>setEmail(target.value)}
              label="Email Address"
              placeholder="john@Example.com"
              type="text"
            />

            <div className='col-span-2'>
            <Input
              value ={password}
              onChange={({target})=>setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />
            </div>
            </div>
            {error && <p className='text-red-500 text-xs pb-2.5 '>{error}</p>}
            
            <button type='submit' className='btn-primary'>SIGN UP</button>

            <p className='text-[13px] text-slate-800 mt-3'>
              Already have an Account?{" "}
              <Link className="font-medium text-primary underline" to="/login">
              Login
              </Link>
            </p>
          </form>
      </div>
    </AuthLayout>
  )
}

export default Signup