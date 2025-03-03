const LandingPage = () => {
    return (
      <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center text-white">
        {/* Hero Section */}
        <section className="w-full max-w-5xl text-center py-24 px-4">
          <h1 className="text-5xl font-bold text-white">
            AI-Powered Meeting Assistant
          </h1>
          <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            MeetBot joins your meetings, records conversations, generates
            transcripts, and provides concise summaries.
          </p>
          <button className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300 font-medium">
            Get Started
          </button>
        </section>
  
        {/* Features Section */}
        <section className="w-full max-w-5xl py-20 px-4 grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Auto Recording", 
              desc: "Seamless meeting recording for future reference." 
            },
            { 
              title: "AI-Powered Summaries", 
              desc: "Get concise insights from long discussions." 
            },
            { 
              title: "Accurate Transcripts", 
              desc: "Turn spoken words into precise text." 
            },
          ].map((feature, index) => (
            <div 
              key={index} 
              className="p-8 bg-gray-800 shadow-lg rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300 mt-3">{feature.desc}</p>
            </div>
          ))}
        </section>
      </div>
    );
  };
  
  export default LandingPage;