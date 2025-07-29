import { assets } from "../assets/assets";
import { useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);

  const {setDToken}=useContext(DoctorContext)

  const onSumbitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password})
        console.log("Doctor Login Data:", data);
        if (data.success) {
           console.log("Token:", data.token);
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          console.log(data.token)
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
  toast.error("Something went wrong during login");
    }
  };

  const [login, setLogin] = useState(true);
  const toggleForm = () => {
    setLogin(!login);
  };

  return (
    <div>
      {/*login form */}
      {login ? (
        <form onSubmit={onSumbitHandler}>
          <div className=" h-screen flex flex-col  items-center bg-gradient-to-r from-blue-800 to-blue-300">
            <p className="font-bold text-3xl  text-white text-center sm:mt-32 mt-[120px]">
              {state === "Admin"
                ? "Sign in to continue as Admin"
                : "Sign in to continue as Doctor"}
            </p>

            {/*image and container for login page */}
            <div className="flex  md:w-[55rem] md:h-[26rem] sm:w-[15rem] sm:h-[25rem]  sm:mt-[5px]  justify-center mt-2 h-[25rem] ">
              <img
                src={assets.loginimg}
                className="md:h-[25rem] hidden sm:block rounded-l-xl "
                alt="img"
              />

              {/*container for login-page */}
              <div className="bg-white border-2 border-l-0 p-3 sm:p-0  sm:w-[25rem] sm:h-[25rem] flex sm:rounded-none sm:rounded-r-xl rounded-xl">
                <div className="flex flex-col mt-4 ">
                  <label htmlFor="email" className="text-lg mb-2">
                    Email
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="text-lg mb-2 h-10 w-80 border-2 border-blue-400 rounded p-1"
                    type="email"
                    placeholder="Email"
                    required
                  />

                  <label htmlFor="password" className="mb-2 text-lg">
                    Password
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="password"
                    className="text-lg mb-2 h-10 border-2  border-blue-400 rounded p-1"
                    required
                  />
                  <button className="bg-blue-500  text-white text-lg mt-2 mb-2 h-10 rounded cursor-pointer hover:bg-blue-300 hover">
                    Login
                  </button>
                  <div className="text-center mt-4">
                    {state === "Admin" ? (
                      <p className="text-gray-600 ">
                        Doctor Login?{" "}
                        <span
                          onClick={() => setState("Doctor")}
                          className="text-blue-600 hover:text-blue-400 font-medium underline cursor-pointer transition"
                        >
                          Click here
                        </span>
                      </p>
                    ) : (
                      <p className="text-gray-600 ">
                        Admin Login?{" "}
                        <span
                          onClick={() => setState("Admin")}
                          className="text-blue-600 hover:text-blue-400 font-medium underline cursor-pointer transition"
                        >
                          Click here
                        </span>
                      </p>
                    )}
                    <p className="mt-2">
                      Are You User?
                      <a
                        
                        className="cursor-pointer ml-1 hover:text-blue-300 text-blue-500"
                        href="http://localhost:5173/login"
                      >
                        Login Now
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form>
          <div className=" h-screen flex flex-col  items-center bg-gradient-to-r from-blue-800 to-blue-300">
            <p className="font-bold text-3xl  text-white text-center sm:mt-32 mt-[120px]">
              Signin to your new account
            </p>

            {/*image and container for signin page */}
            <div className="flex  md:w-[55rem] md:h-[26rem] sm:w-[15rem] sm:h-[25rem]  sm:mt-[5px]  justify-center mt-2 h-[25rem] transition-3s ">
              <img
                src={assets.signupimg}
                className="md:h-[25rem] hidden sm:block rounded-l-xl"
                alt="img"
              />

              {/*container for login-page */}
              <div className="bg-white border-2 border-l-0 p-3 sm:p-0  sm:w-[25rem] sm:h-[25rem] flex rounded-xl sm:rounded-none sm:rounded-r-xl ">
                <div className="flex flex-col mt-4 ">
                  <label htmlFor="username" className="text-lg mb-2">
                    Username
                  </label>
                  <input
                    className="text-lg mb-2 h-10 border-2 rounded p-1"
                    type="text"
                    placeholder="username"
                    required
                  />
                  <label htmlFor="email" className="text-lg mb-2">
                    Email
                  </label>
                  <input
                    className="text-lg mb-2 h-10 border-2 rounded p-1"
                    type="email"
                    placeholder="email"
                    required
                  />
                  <label htmlFor="password" className="mb-2 text-lg">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    className="text-lg mb-2 h-10 border-2 rounded p-1"
                    required
                  />
                  <label htmlFor="password" className="mb-2 text-lg">
                    Comform Password
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    className="text-lg mb-2 h-10 border-2 rounded p-1"
                    required
                  />
                  <button className="bg-blue-500 text-white text-lg mt-2 mb-2 h-10 rounded cursor-pointer hover:bg-blue-300">
                    Sign up
                  </button>
                  <p className="mt-2">
                    Already Registered?{" "}
                    <span
                      onClick={toggleForm}
                      className="cursor-pointer hover:text-blue-300 text-blue-500"
                    >
                      Login
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
export default Login;
