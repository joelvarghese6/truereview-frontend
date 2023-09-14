// src/ProfilePage.tsx
import React, { useState, ChangeEvent } from 'react';

interface User {
  name: string;
  nationality: string;
  description: string;
  email: string;
  reviewPoints: number;
  totalReviews: number;
  profilePicture: string;
}

const ProfilePage: React.FC = () => {
  // Example user data, replace with your own data
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    nationality: 'United States',
    description: 'Web Developer and Designer',
    email: 'johndoe@example.com',
    reviewPoints: 1234,
    totalReviews: 56,
    profilePicture: 'path/to/your/profile-picture.jpg',
  });

  // State to track if the profile is being edited
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle profile picture change
  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Implement your logic to change the profile picture here
    // You can use a file input or an external service like Cloudinary
  };

  // Function to save profile changes
  const saveProfileChanges = () => {
    // Implement your logic to save the changes here
    // You can send a request to your backend API
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="bg-white p-8 rounded-lg shadow-md mt-8 w-96">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-red-600"
          />
        </div>
        {/* Change Profile Picture Button */}
        {isEditing && (
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
        {/* User Details */}
        <div className="text-center">
          <h1 className="text-3xl text-red-600 font-bold mb-2">{user.name}</h1>
          <p className="text-gray-600">{user.nationality}</p>
          {/* Description */}
          {isEditing ? (
            <textarea
              value={user.description}
              onChange={(e) => setUser({ ...user, description: e.target.value })}
              rows={4}
              className="w-full p-2 mt-4 border border-gray-300 rounded-md"
            />
          ) : (
            <p className="mt-4 text-gray-600">{user.description}</p>
          )}
          {/* Email Address */}
          <p className="mt-4 text-gray-600">{user.email}</p>
          {/* Review Points */}
          <p className="mt-4 text-gray-600" >
            <span className="text-red-600 font-semibold">{user.reviewPoints}</span> review points
          </p>
          {/* Total Reviews */}
          <p className="mt-2 text-gray-600">{user.totalReviews} total reviews submitted</p>
          {/* Edit Profile Button */}
          {isEditing ? (
            <button
              onClick={saveProfileChanges}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
