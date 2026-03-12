import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { User, Mail, Phone, MapPin, Building, Globe, Hash, Edit2, ShoppingBag, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
    const { user, logout } = useUserStore();
    const navigate = useNavigate();
    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchDeliveryDetails();
    }, [user, navigate]);

    const fetchDeliveryDetails = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/delivery', {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });
            
            if (!res.ok) {
                throw new Error('Failed to fetch delivery details');
            }
            
            const data = await res.json();
            setDeliveryDetails(data);
        } catch (error) {
            console.error("Error fetching delivery details:", error);
            toast.error('Failed to load delivery details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow"
                >
                    {/* Profile Header */}
                    <div className="p-8 sm:p-10 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-20 w-20 rounded-full bg-emerald-600 flex items-center justify-center">
                                    <User className="h-10 w-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                                    <div className="flex items-center mt-1 text-gray-400">
                                        <Mail className="h-4 w-4 mr-2" />
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Delivery Details Section */}
                    <div className="p-8 sm:p-10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-emerald-400">Delivery Details</h2>
                            <button
                                onClick={() => navigate('/cart')}
                                className="flex items-center text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                            >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit Details
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                            </div>
                        ) : deliveryDetails ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-400">Full Name</p>
                                        <p className="text-base text-gray-200">{deliveryDetails.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-400">Contact</p>
                                        <p className="text-base text-gray-200">{deliveryDetails.contactNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 md:col-span-2">
                                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-400">Address</p>
                                        <p className="text-base text-gray-200">{deliveryDetails.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-400">City</p>
                                        <p className="text-base text-gray-200">{deliveryDetails.city}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-400">State</p>
                                        <p className="text-base text-gray-200">{deliveryDetails.state}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-400">Country</p>
                                        <p className="text-base text-gray-200">{deliveryDetails.country}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-400">Pincode</p>
                                        <p className="text-base text-gray-200">{deliveryDetails.pincode}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-300 mb-4">No delivery details found</p>
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500"
                                >
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Add Delivery Details
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
