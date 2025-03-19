import  { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "react-firebase-hooks/auth";
import {   auth } from "../firebase"

export function AddMeetingLink() {
  const [user]= useAuthState(auth)
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!link) {
      toast.error("Please enter a meeting link");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("https://phantom-server.hashdev.me/create-bot", {
        meetLink: link,
      },{headers:{
        Authorization: `Bearer ${await user?.getIdToken()}`
      }});

      if (res.status === 200) {
        toast.success("Bot successfully added to the meeting!");
        setLink("");
      }
    } catch (error) {
      toast.error("Failed to add bot to the meeting. Please try again.");
      console.error("Error adding bot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Add Meeting Bot</h2>
          
          <div className="mb-6 p-4 bg-gray-700 rounded-lg text-gray-300 text-sm">
            Enter the meeting link to add the bot. The bot will join the meeting soon. 
            Please remember to let the bot into the meeting when prompted.
          </div>
          
          <div className="mb-6">
            <label htmlFor="meetingLink" className="block text-gray-400 mb-2 font-medium">
              Meeting Link
            </label>
            <input
              id="meetingLink"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Bot...
              </>
            ) : (
              "Add Bot"
            )}
          </button>
        </div>
      </div>
      
      {/* Toast Container with Dark Theme */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}