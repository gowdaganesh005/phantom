import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function Summary() {
    const [searchParams] = useSearchParams();
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("summary");
    
    const videoId = searchParams.get("videoId");

    async function fetch() {
        const res = await axios.post("http://localhost:3000/getVideo", {
            videoId: videoId
        });
        setVideoInfo(res.data.data);
    }

    useEffect(() => {
        fetch();
    }, []);

    const parseXML = (xmlString:string) => {
        const headingRegex = /<heading>(.*?)<\/heading>/gs;
        const textRegex = /<text>(.*?)<\/text>/gs;
        const pointRegex = /<point>(.*?)<\/point>/gs;
        const todoRegex = /<todo>(.*?)<\/todo>/gs;
    
        const sections:any[] = [];
        const matches = xmlString.match(/<summary>(.*?)<\/summary>/gs);
        
        if (matches) {
            matches.forEach((match) => {
                const heading = (headingRegex.exec(match) || [])[1] || "";
                const text = [...match.matchAll(textRegex)].map(m => m[1]);
                const points = [...match.matchAll(pointRegex)].map(m => m[1]);
                sections.push({ heading, text, points });
            });
        }
    
        const todos = [...xmlString.matchAll(todoRegex)].map(m => m[1]);
    
        return { sections, todos };
    };

    if (!videoInfo) return <p>Loading...</p>;

    const { sections, todos } = parseXML(videoInfo.summary);

    return (
        <div className="p-4 max-w-3xl mx-auto border rounded-lg shadow-md m-10 bg-slate-900 text-white">
            <div>Meeting {videoInfo.videoId}</div>
            <div className="mb-4 text-center">
                <video controls className="w-full mt-4 rounded-md">
                    <source src={videoInfo?.videoLink} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="flex justify-center mb-4 border-b">
                <button className={`p-2 ${activeTab === "summary" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("summary")}>Summary</button>
                <button className={`p-2 mx-4 ${activeTab === "transcript" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("transcript")}>Transcript</button>
                <button className={`p-2 ${activeTab === "details" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("details")}>Details</button>
            </div>
            
            {activeTab === "summary" && (
                <div>
                    {sections.map((section, index) => (
                        <div key={index} className="mb-4">
                            <h2 className="text-xl font-bold mb-2">{section.heading}</h2>
                            {section.text.map((t:any, i:any) => (
                                <p key={i} className="text-gray-200 mb-2">{t}</p>
                            ))}
                            {section.points.map((p:any, i:any) => (
                                <p key={i} className="font-medium text-gray-200">{p}</p>
                            ))}
                        </div>
                    ))}
                    {todos.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold mt-4">To-Do List</h3>
                            <ul className="mt-2 list-disc list-inside">
                                {todos.map((todo, index) => (
                                    <li key={index} className="text-gray-400">{todo}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === "transcript" && (
                <div>
                    <h3 className="text-lg font-bold mb-2">Transcript</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{videoInfo.transcript}</p>
                </div>
            )}
            
            {activeTab === "details" && (
                <div>
                    <h3 className="text-lg font-bold mb-2">Video Details</h3>
                    <p><strong>Created At:</strong> {new Date(videoInfo.created_at).toLocaleString()}</p>
                    <p><strong>Last Updated At:</strong> {new Date(videoInfo.updated_at).toLocaleString()}</p>
                    <p><strong>Video ID:</strong> {videoInfo.videoId}</p>
                    <p><strong>User ID:</strong> {videoInfo.userId}</p>
                </div>
            )}
        </div>
    );
}
