import { browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export function Login() {
    const navigate = useNavigate();

    
    const googleLogin = async () => {
        
        await setPersistence(auth, browserLocalPersistence);
      
        const provider = new GoogleAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result?.user;
      
          if (user) {
            const res = await axios.post("http://localhost:3000/login", {
              userId: user.uid,
              name: user.displayName,
              email: user.email,
            });
      
            if (res.status === 200) {
              console.log("Login successful");
              navigate("/dashboard");
            } else {
              console.log("Login failed");
            }
          }
        } catch (error: any) {
          console.log("Google Login failed", error);
        }
      };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-900 text-gray-300 px-4">
      <button
        className="px-6 py-3 bg-black text-white text-sm sm:text-lg md:text-2xl rounded-lg shadow-md flex items-center gap-4 hover:bg-slate-950 transition w-full max-w-xs sm:max-w-sm md:max-w-md justify-center"
        onClick={googleLogin}
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
          <path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
          <path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
          <path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
        Continue With Google
      </button>
    </div>
  );
}