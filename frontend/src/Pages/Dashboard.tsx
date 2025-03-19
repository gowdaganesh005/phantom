import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useEffect, useState } from "react";
import { Search, Calendar, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoData {
  videoId: string;
  thumbnailUrl: string;
  created_at: string;
}

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState<VideoData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate()

  async function fetchUserVideos() {
    if (!user) return; // Ensure user exists before fetching

    try {
      setRefreshing(true);
      const token = await user.getIdToken();
      const response = await axios.get("https://phantom-server.hashdev.me/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) setData(response.data.data);
    } catch (err) {
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchUserVideos();
  }, [user]); // Run only when user is available

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter and sort videos
  const filteredAndSortedVideos = data
    ? [...data]
        .filter((video) =>
          video.videoId.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return sortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        })
    : [];

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4 md:mb-0">
            User Meetings
          </h1>
          <button
            onClick={() => fetchUserVideos()}
            disabled={refreshing || loading}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Search and sort controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by meeting link..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <span>Sort by date:</span>
            <button
              onClick={() => setSortOrder("desc")}
              className={`px-3 py-1 rounded ${
                sortOrder === "desc"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder("asc")}
              className={`px-3 py-1 rounded ${
                sortOrder === "asc"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              Oldest
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-500 font-medium">Error</p>
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchUserVideos}
                className="mt-2 text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredAndSortedVideos.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg shadow-sm">
            <div className="text-gray-300 mb-2">No videos found</div>
            {searchQuery ? (
              <p className="text-gray-500">Try adjusting your search criteria</p>
            ) : (
              <p className="text-gray-500">Your library is empty</p>
            )}
          </div>
        )}

        {/* Video grid */}
        {!loading && !error && filteredAndSortedVideos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAndSortedVideos.map((video) => (
              <div
                key={video.videoId}
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer transform hover:scale-105 transition-transform"
                onClick={()=>navigate(`/summary?videoId=${video.videoId}`)}
              >
                <div className="relative aspect-square">
                  <img
                    src={video.thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for broken images
                      (e.target as HTMLImageElement).src = "/api/placeholder/400/400";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <div className="text-xs text-gray-300 truncate">
                      {video.videoId.split("/").pop()}
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-center text-xs text-gray-400 mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(video.created_at)}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatTime(video.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;