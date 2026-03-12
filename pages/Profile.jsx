import { useUserStore } from "../stores/useUserStore";
import { User, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

const Profile = () => {
  const { user } = useUserStore();
  
  console.log("Profile page - Current user:", user); // Debug log

  if (!user) {
    return <div className="container mx-auto px-4 pt-20 pb-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-20 pb-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-emerald-400 mb-6">My Profile</h1>
        
        <div className="space-y-6">
          {/* User Info Section */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                <p className="text-gray-300">{user?.role}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <User className="w-5 h-5 mr-2 text-emerald-400" />
                <span>Username: {user?.name}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 mr-2 text-emerald-400" />
                <span>Email: {user?.email}</span>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Order History
            </h3>
            <div className="text-gray-300">
              {/* This section can be expanded later to show actual order history */}
              <p>Your order history will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
