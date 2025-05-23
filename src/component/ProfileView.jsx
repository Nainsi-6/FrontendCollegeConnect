// "use client"

// import { useState, useEffect } from "react"
// import { useParams, Link } from "react-router-dom"
// import { useUser } from "../contexts/UserContext"
// import Navbar from "./Navbar"

// const ProfileView = () => {
//   const { userId } = useParams()
//   const { user: currentUser } = useUser()
//   const [profile, setProfile] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [connectionStatus, setConnectionStatus] = useState("none")
//   const [connectionId, setConnectionId] = useState(null)
//   const [activeTab, setActiveTab] = useState("about")

//   useEffect(() => {
//     const fetchProfileAndConnection = async () => {
//       try {
//         setIsLoading(true)

//         // Fetch profile
//         const profileResponse = await fetch(`http://localhost:5005/api/profiles/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         })

//         if (!profileResponse.ok) {
//           throw new Error("Failed to fetch profile")
//         }

//         const profileData = await profileResponse.json()
//         setProfile(profileData.profile)

//         // Fetch connection status if not viewing own profile
//         if (userId !== currentUser?._id) {
//           const connectionsResponse = await fetch("http://localhost:5005/api/users/connections", {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           })

//           if (!connectionsResponse.ok) {
//             throw new Error("Failed to fetch connections")
//           }

//           const connectionsData = await connectionsResponse.json()
//           const connection = connectionsData.connections.find((c) => c.requester === userId || c.recipient === userId)

//           if (!connection) {
//             setConnectionStatus("none")
//           } else if (connection.status === "pending") {
//             setConnectionStatus("pending")
//             setConnectionId(connection._id)
//           } else if (connection.status === "accepted") {
//             setConnectionStatus("connected")
//             setConnectionId(connection._id)
//           }
//         }

//         setIsLoading(false)
//       } catch (err) {
//         console.error("Error fetching profile:", err)
//         setError(err.message)
//         setIsLoading(false)
//       }
//     }

//     if (userId) {
//       fetchProfileAndConnection()
//     }
//   }, [userId, currentUser])

//   const handleConnect = async () => {
//     try {
//       const response = await fetch(`http://localhost:5005/api/users/connect/${userId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to connect with user")
//       }

//       const data = await response.json()
//       setConnectionStatus("pending")
//       setConnectionId(data.connection._id)
//     } catch (err) {
//       console.error("Error connecting with user:", err)
//       alert(`Failed to send connection request: ${err.message}`)
//     }
//   }

//   const handleCancelRequest = async () => {
//     if (!connectionId) return

//     try {
//       const response = await fetch(`http://localhost:5005/api/users/connections/${connectionId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to cancel connection request")
//       }

//       setConnectionStatus("none")
//       setConnectionId(null)
//     } catch (err) {
//       console.error("Error canceling connection request:", err)
//       alert(`Failed to cancel connection request: ${err.message}`)
//     }
//   }

//   const handleAcceptRequest = async () => {
//     if (!connectionId) return

//     try {
//       const response = await fetch(`http://localhost:5005/api/users/connections/${connectionId}/accept`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to accept connection request")
//       }

//       setConnectionStatus("connected")
//     } catch (err) {
//       console.error("Error accepting connection request:", err)
//       alert(`Failed to accept connection request: ${err.message}`)
//     }
//   }

//   if (isLoading) {
//     return (
//       <>
//         <Navbar />
//         <div className="container mx-auto p-4 max-w-4xl">
//           <div className="bg-gray-100 h-48 rounded-t-lg relative">
//             <div className="absolute -bottom-16 left-8 w-32 h-32 bg-gray-300 rounded-full border-4 border-white animate-pulse"></div>
//           </div>
//           <div className="pt-20 px-8">
//             <div className="h-8 bg-gray-300 w-1/3 mb-2 animate-pulse rounded"></div>
//             <div className="h-4 bg-gray-200 w-1/4 mb-6 animate-pulse rounded"></div>
//             <div className="flex gap-4 mb-8">
//               <div className="h-10 bg-gray-200 w-32 animate-pulse rounded"></div>
//               <div className="h-10 bg-gray-200 w-32 animate-pulse rounded"></div>
//             </div>
//             <div className="h-4 bg-gray-200 w-full mb-2 animate-pulse rounded"></div>
//             <div className="h-4 bg-gray-200 w-full mb-2 animate-pulse rounded"></div>
//             <div className="h-4 bg-gray-200 w-2/3 animate-pulse rounded"></div>
//           </div>
//         </div>
//       </>
//     )
//   }

//   if (error) {
//     return (
//       <>
//         <Navbar />
//         <div className="flex justify-center items-center h-[calc(100vh-64px)]">
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
//             <p className="font-bold">Error</p>
//             <p>{error}</p>
//           </div>
//         </div>
//       </>
//     )
//   }

//   if (!profile) {
//     return (
//       <>
//         <Navbar />
//         <div className="flex justify-center items-center h-[calc(100vh-64px)]">
//           <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
//             <p className="font-bold">Profile Not Found</p>
//             <p>The requested profile could not be found.</p>
//           </div>
//         </div>
//       </>
//     )
//   }

//   const isOwnProfile = userId === currentUser?._id

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto p-4 max-w-4xl">
//         {/* Cover Photo and Profile Photo */}
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48 rounded-t-lg relative">
//           {profile.coverPhotoUrl && (
//             <img
//               src={`http://localhost:5005${profile.coverPhotoUrl}`}
//               alt="Cover"
//               className="w-full h-full object-cover rounded-t-lg"
//             />
//           )}

//           {/* Role badge */}
//           <div className="absolute top-4 right-4 bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
//             {profile.role === "student" && (
//               <>
//                 <i className="fas fa-graduation-cap mr-1"></i> Student
//               </>
//             )}
//             {profile.role === "faculty" && (
//               <>
//                 <i className="fas fa-building mr-1"></i> Faculty
//               </>
//             )}
//             {profile.role === "alumni" && (
//               <>
//                 <i className="fas fa-briefcase mr-1"></i> Alumni
//               </>
//             )}
//           </div>

//           {/* Profile photo */}
//           <div className="absolute -bottom-16 left-8">
//             <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white overflow-hidden">
//               {profile.profilePhotoUrl ? (
//                 <img
//                   src={`http://localhost:5005${profile.profilePhotoUrl}`}
//                   alt={profile.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-blue-600">{profile.name.charAt(0).toUpperCase()}</span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Profile Info */}
//         <div className="bg-white rounded-b-lg shadow-md pt-20 px-8 pb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold">{profile.name}</h1>
//               <p className="text-gray-600 flex items-center mt-1">
//                 <i className="fas fa-envelope mr-2"></i>
//                 {profile.email}
//               </p>
//             </div>

//             <div className="mt-4 md:mt-0 flex gap-2">
//               {!isOwnProfile && (
//                 <>
//                   {connectionStatus === "none" && (
//                     <button
//                       onClick={handleConnect}
//                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
//                     >
//                       <i className="fas fa-user-plus"></i>
//                       Connect
//                     </button>
//                   )}

//                   {connectionStatus === "pending" && (
//                     <button
//                       onClick={handleCancelRequest}
//                       className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
//                     >
//                       Cancel Request
//                     </button>
//                   )}

//                   {connectionStatus === "connected" && (
//                     <button
//                       className="px-4 py-2 border border-gray-300 text-gray-700 rounded cursor-not-allowed flex items-center gap-2"
//                       disabled
//                     >
//                       <i className="fas fa-user-check"></i>
//                       Connected
//                     </button>
//                   )}

//                   <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center gap-2">
//                     <i className="fas fa-comment"></i>
//                     Message
//                   </button>
//                 </>
//               )}

//               {isOwnProfile && (
//                 <Link
//                   to="/edit-profile"
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
//                 >
//                   Edit Profile
//                 </Link>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4 mb-6">
//             <div className="flex-1 min-w-[120px] border rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-blue-600">{profile.stats?.followers || 0}</p>
//               <p className="text-gray-500">Followers</p>
//             </div>

//             <div className="flex-1 min-w-[120px] border rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-blue-600">{profile.stats?.following || 0}</p>
//               <p className="text-gray-500">Following</p>
//             </div>

//             <div className="flex-1 min-w-[120px] border rounded-lg p-4 text-center">
//               <p className="text-2xl font-bold text-blue-600">{profile.stats?.posts || 0}</p>
//               <p className="text-gray-500">Posts</p>
//             </div>
//           </div>

//           <div className="border-b mb-4">
//             <div className="flex">
//               <button
//                 className={`px-4 py-2 font-medium ${activeTab === "about" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("about")}
//               >
//                 About
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium ${activeTab === "skills" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("skills")}
//               >
//                 Skills
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium ${activeTab === "posts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveTab("posts")}
//               >
//                 Posts
//               </button>
//             </div>
//           </div>

//           {activeTab === "about" && (
//             <div className="space-y-4">
//               {profile.about && (
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">About</h3>
//                   <p className="text-gray-700">{profile.about}</p>
//                 </div>
//               )}

//               {/* Role-specific details */}
//               {profile.role === "student" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profile.branch && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-book text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Branch</p>
//                         <p className="text-gray-600">{profile.branch}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.yearOfStudy && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-calendar text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Year of Study</p>
//                         <p className="text-gray-600">{profile.yearOfStudy}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.batch && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-users text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Batch</p>
//                         <p className="text-gray-600">{profile.batch}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.regNumber && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-id-card text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Registration Number</p>
//                         <p className="text-gray-600">{profile.regNumber}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {profile.role === "faculty" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profile.department && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-building text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Department</p>
//                         <p className="text-gray-600">{profile.department}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.designation && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-award text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Designation</p>
//                         <p className="text-gray-600">{profile.designation}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.facultyId && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-id-badge text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Faculty ID</p>
//                         <p className="text-gray-600">{profile.facultyId}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.researchInterests && profile.researchInterests.length > 0 && (
//                     <div className="flex items-start gap-2 col-span-2">
//                       <i className="fas fa-microscope text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Research Interests</p>
//                         <div className="flex flex-wrap gap-2 mt-1">
//                           {profile.researchInterests.map((interest, index) => (
//                             <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
//                               {interest}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {profile.role === "alumni" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {profile.currentJobTitle && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-briefcase text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Current Job</p>
//                         <p className="text-gray-600">{profile.currentJobTitle}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.company && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-building text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Company</p>
//                         <p className="text-gray-600">{profile.company}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.graduationYear && (
//                     <div className="flex items-start gap-2">
//                       <i className="fas fa-graduation-cap text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">Graduation Year</p>
//                         <p className="text-gray-600">{profile.graduationYear}</p>
//                       </div>
//                     </div>
//                   )}

//                   {profile.linkedinProfile && (
//                     <div className="flex items-start gap-2">
//                       <i className="fab fa-linkedin text-blue-500 mt-1"></i>
//                       <div>
//                         <p className="font-medium">LinkedIn</p>
//                         <a
//                           href={profile.linkedinProfile}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:underline"
//                         >
//                           View Profile
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === "skills" && (
//             <div>
//               {profile.skills && profile.skills.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {profile.skills.map((skill, index) => (
//                     <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No skills listed yet.</p>
//               )}
//             </div>
//           )}

//           {activeTab === "posts" && (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Posts will appear here.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default ProfileView


"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import ProfilePhoto from "./ProfilePhoto";

const ProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [connections, setConnections] = useState({ followers: [], following: [] });
  const [connectionStatus, setConnectionStatus] = useState("none"); // none, pending, connected
  const [activeTab, setActiveTab] = useState("followers");
  const [loading, setLoading] = useState({
    profile: true,
    connections: true,
    action: false,
  });

  const API_BASE_URL = "https://finalbackend-vf9e.onrender.com";
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: token,
    },
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const fetchProfile = async () => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }));
      const response = await axios.get(`${API_BASE_URL}/api/profiles/${userId}`, config);
      setProfile(response.data.profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const fetchConnections = async () => {
    try {
      setLoading((prev) => ({ ...prev, connections: true }));
      const response = await axios.get(`${API_BASE_URL}/api/users/connections/${userId}`, config);
      setConnections({
        followers: response.data.followers,
        following: response.data.following,
      });

      // Check if current user is following or has a pending request
      const currentUserId = localStorage.getItem("userId");
      if (currentUserId) {
        const isFollowing = response.data.followers.some(
          (follow) => follow.follower._id === currentUserId && follow.status === "accepted"
        );
        const isPending = response.data.followers.some(
          (follow) => follow.follower._id === currentUserId && follow.status === "pending"
        );
        setConnectionStatus(isFollowing ? "connected" : isPending ? "pending" : "none");
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load connections");
    } finally {
      setLoading((prev) => ({ ...prev, connections: false }));
    }
  };

  const sendConnectionRequest = async () => {
    try {
      setLoading((prev) => ({ ...prev, action: true }));
      await axios.post(`${API_BASE_URL}/api/users/follow/${userId}`, {}, config);
      setConnectionStatus("pending");
      toast.success("Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast.error(error.response?.data?.message || "Failed to send connection request");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const startConversation = async () => {
    try {
      setLoading((prev) => ({ ...prev, action: true }));
      const response = await axios.post(
        `${API_BASE_URL}/api/messages`,
        {
          recipientId: userId,
          content: `Hello ${profile?.name}! I'd like to connect with you.`,
        },
        config
      );

      if (response.data.success) {
        navigate("/messages");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchProfile();
      fetchConnections();
    }
  }, [token, userId]);

  if (loading.profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-10 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-10">
          <div className="text-center py-8">
            <p className="text-xl text-red-500">Profile not found</p>
            <button
              onClick={() => navigate("/connect")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Back to Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-10">
        {/* Cover Photo */}
        <div
          className="h-64 rounded-t-xl bg-gradient-to-r from-indigo-500 to-purple-600 relative"
          style={{
            backgroundImage: profile.coverPhotoUrl ? `url(${API_BASE_URL}${profile.coverPhotoUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Profile Info */}
        <div className="bg-white rounded-b-xl shadow-md px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start -mt-16 md:-mt-20">
              <ProfilePhoto
                src={profile.profilePhotoUrl}
                alt={profile.name}
                size="3xl"
                className="border-4 border-white"
              />
            </div>

            {/* Profile Details */}
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                      {profile.role}
                    </span>

                    {profile.department && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {profile.department}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {userId !== localStorage.getItem("userId") && (
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    {connectionStatus === "none" && (
                      <button
                        onClick={sendConnectionRequest}
                        disabled={loading.action}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        {loading.action ? (
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                        )}
                        Connect
                      </button>
                    )}

                    {connectionStatus === "pending" && (
                      <button
                        disabled
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md bg-gray-50"
                      >
                        Request Pending
                      </button>
                    )}

                    {connectionStatus === "connected" && (
                      <button
                        disabled
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md bg-gray-50 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Connected
                      </button>
                    )}

                    <button
                      onClick={startConversation}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      Message
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex space-x-4 mt-4">
                <div className="text-center">
                  <span className="text-lg font-semibold text-gray-900">{profile.stats?.followers || 0}</span>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-semibold text-gray-900">{profile.stats?.following || 0}</span>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {profile.about && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">About</h2>
              <p className="mt-2 text-gray-600">{profile.about}</p>
            </div>
          )}

          {/* Role-specific details */}
          <div className="mt-6">
            {profile.role === "student" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.batch && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Batch</h3>
                    <p className="mt-1 text-gray-900">{profile.batch}</p>
                  </div>
                )}
                {profile.regNumber && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Registration Number</h3>
                    <p className="mt-1 text-gray-900">{profile.regNumber}</p>
                  </div>
                )}
                {profile.branch && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Branch</h3>
                    <p className="mt-1 text-gray-900">{profile.branch}</p>
                  </div>
                )}
              </div>
            )}

            {profile.role === "faculty" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.facultyId && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Faculty ID</h3>
                    <p className="mt-1 text-gray-900">{profile.facultyId}</p>
                  </div>
                )}
                {profile.department && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Department</h3>
                    <p className="mt-1 text-gray-900">{profile.department}</p>
                  </div>
                )}
                {profile.designation && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Designation</h3>
                    <p className="mt-1 text-gray-900">{profile.designation}</p>
                  </div>
                )}
              </div>
            )}

            {profile.role === "alumni" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.passedOutBatch && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Passed Out Batch</h3>
                    <p className="mt-1 text-gray-900">{profile.passedOutBatch}</p>
                  </div>
                )}
                {profile.company && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Company</h3>
                    <p className="mt-1 text-gray-900">{profile.company}</p>
                  </div>
                )}
                {profile.currentJobTitle && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Job Title</h3>
                    <p className="mt-1 text-gray-900">{profile.currentJobTitle}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Connections */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "followers"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("followers")}
            >
              Followers
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "following"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>

          <div className="mt-4">
            {loading.connections ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : activeTab === "followers" ? (
              connections.followers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connections.followers.map((follow) => (
                    <div key={follow._id} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <ProfilePhoto
                          src={follow.follower.profilePhotoUrl}
                          alt={follow.follower.name}
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => navigate(`/profile/${follow.follower._id}`)}
                        />
                        <div>
                          <h3
                            className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600"
                            onClick={() => navigate(`/profile/${follow.follower._id}`)}
                          >
                            {follow.follower.name}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">{follow.follower.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No followers yet</p>
                </div>
              )
            ) : connections.following.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.following.map((follow) => (
                  <div key={follow._id} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <ProfilePhoto
                        src={follow.following.profilePhotoUrl}
                        alt={follow.following.name}
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => navigate(`/profile/${follow.following._id}`)}
                      />
                      <div>
                        <h3
                          className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600"
                          onClick={() => navigate(`/profile/${follow.following._id}`)}
                        >
                          {follow.following.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{follow.following.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Not following anyone yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;