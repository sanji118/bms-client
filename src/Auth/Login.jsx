import {  useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hook/useAuth';
import Lottie from 'lottie-react';
import loginAnimation from '../assets/Animation - 1748331899107.json'
import Logo from '../components/Logo';
import WebsiteName from '../components/WebsiteName';
import { saveUserToDB } from '../utils/useUser';

const Login = () => {
    const [users, setUsers] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const {signInWithGoogle,signIn, user} = useAuth();
    const navigate = useNavigate();

  useEffect(()=>{
    if(user){
        navigate('/')
    }
  }, [user])

  const handleLogin = e =>{
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
    .then(result =>{
      const user = result.user;
      navigate('/')
      toast.success('Successfully logged in.')
    })
    .catch(error =>{
      const errorMessage = error.message;
      toast.error(errorMessage);
    //   //console.log(errorMessage);
    })
  }
  
  const googleSignin = async()=>{
    try{
        const result = await signInWithGoogle();
        const loggedInUser = result.user;
        setUsers(loggedInUser);
        await saveUserToDB(loggedInUser);
        toast.success('Successfully registered !')
        navigate('/')
    }
    catch{error =>{
      const errorMessage = error.message;
    //    //console.error(errorMessage, error)
    }}
  }


  return (
    <div className='bg-yellow-50'>
    <div className='flex justify-center gap-2 items-center py-5'>
        <Logo></Logo><WebsiteName></WebsiteName>
    </div>
    <div className='flex items-center w-full px-5 md:px-8'>
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="md:w-120 rounded-xl shadow-lg p-8 space-y-6 bg-white">
                <div className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <div className="rounded-full p-3">
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                <p className="mt-2 text-gray-600">
                    Sign in to your <span className='text-yellow-500'>HomeHaven </span>account
                </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                    type="email"
                    name='email'
                    className="input input-bordered w-full bg-white border border-gray-300 placeholder:text-gray-400"
                    placeholder="user@gmail.com"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        className="input input-bordered w-full text-sm pr-10 bg-white border border-gray-300 placeholder:text-gray-400"
                        placeholder="••••••••"
                    />
                    <span onClick={()=> setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 z-10">
                        {
                        showPassword? <FaEyeSlash/> : <FaEye/>
                        }
                    </span>
                    </div>
                </div>


                <button type="submit" className="btn border-none w-full bg-yellow-500 hover:bg-yellow-300">
                    Sign in
                </button>
                </form>

                <div className="divider">Or continue with</div>

                <button onClick={googleSignin} className="btn bg-white w-full border border-gray-300 text-gray-700 hover:bg-gray-200">
                <FcGoogle className="text-xl mr-2" />
                Sign in with Google
                </button>

                <p className="text-center text-sm text-gray-600">
                Don't have any account?
                <Link to="/register" className="text-yellow-500 font-semibold hover:underline">
                    Sign up
                </Link>
                </p>
            </div>
        </div>
        <Lottie 
            animationData={loginAnimation}
            loop
            style={{width: '40%'}}
        />
    </div></div>
  );
};

export default Login;