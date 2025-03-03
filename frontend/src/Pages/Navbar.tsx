
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

export function Navbar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Glass effect container */}
      <div className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo section */}
            <div
            onClick={()=>navigate("/")} className="flex-shrink-0 flex items-center">
              <img 
                src="/phantom.svg" 
                alt="logo" 
                className="h-8 w-auto text-white"
              />
              
            </div>
            
            {/* Button section */}
            <div className="flex items-center space-x-4">
              {user && (
                <button 
                  className="px-4 py-2 rounded-md bg-indigo-600/80 hover:bg-indigo-700 text-white text-sm font-medium transition-colors duration-200 backdrop-blur-sm border border-indigo-500/30 shadow-md"
                  onClick={()=>navigate('/addMeetLink')}
                >
                  Add Meet Link
                </button>
              )}
              {
                user && <button 
                onClick={()=>navigate("/dashboard")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 backdrop-blur-sm shadow-md bg-blue-600 text-white`}
                >
                  Dashboard
                </button>
              }
              
              {user ?<button 
              onClick={()=>signOut(auth)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 backdrop-blur-sm shadow-md bg-blue-600 text-white`}
              >
                Logout
              </button>:
              <button 
              onClick={()=>navigate("/login")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 backdrop-blur-sm shadow-md bg-blue-600 text-white`}
              >
                Login
              </button>
              
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}