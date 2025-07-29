import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, setToken,token } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const toggleForm = () => {
    setState(state === 'login' ? 'sign up' : 'login');
    setEmail('');
    setPassword('');
    setName('');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
     
      if (state === 'login') {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
        
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Authentication successful!');
      } else {
        toast.error(data.message || "Something went wrong");
      }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Authentication successful!');
        navigate('/Login');
      } else {
        toast.error(data.message || "Something went wrong");
      }
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(()=>{
    if(token){
     navigate('/')
    }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className="h-screen flex flex-col items-center bg-gradient-to-r from-blue-800 to-blue-300 p-4">
      <p className="font-bold text-3xl text-white text-center mt-24 mb-8">
        {state === 'login' ? 'Login to your account' : 'Sign up for a new account'}
      </p>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        {state === 'login' ? (
          <>
            <label htmlFor="email" className="block text-lg mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email"
              required
              className="w-full h-10 border-2 rounded p-2 mb-4 text-lg"
            />

            <label htmlFor="password" className="block text-lg mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="password"
              required
              className="w-full h-10 border-2 rounded p-2 mb-6 text-lg"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white text-lg py-2 rounded hover:bg-blue-400 transition"
            >
              Login
            </button>
            <p className='mt-5 flex flex-row justify-center items-center'>
              Are you <a  href="http://localhost:5174/login" className="ml-1 text-blue-600 underline">Admin</a>?
             </p>

            <p className="mt-4 text-center text-gray-600">
              Not registered yet?{' '}
              <span
                onClick={toggleForm}
                className="text-blue-500 cursor-pointer hover:text-blue-400"
              >
                Sign up
              </span>
            </p>
          </>
        ) : (
          <>
            <label htmlFor="name" className="block text-lg mb-2">Username</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="username"
              required
              className="w-full h-10 border-2 rounded p-2 mb-4 text-lg"
            />

            <label htmlFor="email" className="block text-lg mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email"
              required
              className="w-full h-10 border-2 rounded p-2 mb-4 text-lg"
            />

            <label htmlFor="password" className="block text-lg mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="password"
              required
              className="w-full h-10 border-2 rounded p-2 mb-6 text-lg"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white text-lg py-2 rounded hover:bg-blue-400 transition"
            >
              Sign up
            </button>
            

            <p className="mt-4 text-center text-gray-600">
              Already registered?{' '}
              <span
                onClick={toggleForm}
                className="text-blue-500 cursor-pointer hover:text-blue-400"
              >
                Login
              </span>
              
            </p>
            
          </>
        )}
      </div>
    </form>
  );
};

export default Login;
