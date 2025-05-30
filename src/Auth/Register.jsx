import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../hook/useAuth';
import { Key } from 'lucide-react';
import Logo from '../components/Logo';
import WebsiteName from '../components/WebsiteName';
import { useEffect } from 'react';
import { saveUserToDB } from '../utils/useUser';

const Register = () => {
  const {createUser, signInWithGoogle, user} = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
      if(user){
          navigate('/')
      }
    }, [user])
  const handleRegister = e =>{
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const photo = form.photo.value;

    if(!name || !photo){
      toast.warn('Please enter Your name and Photo!')
    }
    const isValidPassword = () =>{
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasLength = password.length >= 6;
      return hasUpperCase && hasLength && hasLowerCase;
    }
    if(!isValidPassword()){
      toast.warn('Password must be at least 6 characters and an uppercase and a lowercase!');
      return
    }
     createUser(email, password)
      .then(async result => {
        const user = result.user;
        await updateProfile(user, {
          displayName: name,
          photoURL: photo,
        });
        
        await saveUserToDB(user);

        toast.success('Successfully registered!');
        navigate('/');
      })
      .catch(error => {
        const errorMessage = error.message;
        console.error(errorMessage);
        toast.error(errorMessage);
      });
  }

  const googleSignIn = () =>{
    signInWithGoogle()
    .then( async result=>{
      const user = result.user;
      await saveUserToDB(user);
      toast.success('Successfully registered!');
      navigate('/');
    })
    .catch(error =>{
      const errorMessage = error.message;
      console.log(errorMessage)
    })
  }
  return (
    <div className="mx-auto min-h-screen bg-yellow-50 px-4 py-20">
    <div className='flex justify-center gap-2 items-center py-5'>
        <Logo></Logo><WebsiteName></WebsiteName>
    </div>
      <div className="w-full mx-auto max-w-md bg-white rounded-xl shadow-md p-8 space-y-6">

        <h2 className="text-3xl font-bold text-center text-yellow-500 flex gap-3 items-center"><span className='font-bold'><Key /></span>Create your account </h2>
        <p className="text-center text-gray-600">
          Join our community and start sharing your thoughts!
        </p>

        <button onClick={googleSignIn} className="btn bg-white w-full border border-gray-300 text-gray-700 hover:bg-gray-200">
          <FaGoogle className="text-xl mr-2 text-yellow-300" />
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have account?
          <Link to="/login" className="text-yellow-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
        <div className="divider">Or continue with</div>



        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name='name'
              placeholder="Enter Your Name"
              className="input input-bordered w-full bg-white border border-gray-300 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name='email'
              placeholder="user@gmail.com"
              className="input input-bordered w-full bg-white border border-gray-300 placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture URL (Optional)
            </label>
            <input
              type="text"
              name='photo'
              placeholder="https://example.com/avatar.jpg"
              className="input input-bordered w-full bg-white placeholder:text-gray-400 border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name='password'
              placeholder="••••••••"
              className="input w-full text-sm pr-10 bg-white border border-gray-300 placeholder:text-gray-400"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Must contain at least 6 characters, one uppercase and one lowercase letter
            </p>
          </div>

          <button
            type="submit"
            className="btn border-none w-full bg-yellow-500 hover:bg-yellow-300 text-white"
          >
            Sign up
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Register;
