import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Building, Globe, Hash } from 'lucide-react';

const DeliveryDetailsForm = ({ onSuccess }) => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact number is required";
        } else if (!/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Contact number must be of 10 digits";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!formData.country.trim()) {
            newErrors.country = "Country is required";
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Pincode must be of 6 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (!user) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }

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
                if (data) {
                    setFormData(data);
                }
            } catch (error) {
                console.error("Error fetching delivery details:", error);
                toast.error('Failed to load delivery details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeliveryDetails();
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Only allow digits for contact number and pincode
        if (name === 'contactNumber') {
            if (value === '' || /^\d{0,10}$/.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else if (name === 'pincode') {
            if (value === '' || /^\d{0,6}$/.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill all required fields correctly");
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch('/api/delivery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            toast.success("Delivery details saved successfully!");
            if (onSuccess) onSuccess(data);
        } catch (error) {
            console.error("Error saving delivery details:", error);
            toast.error(error.message || "Failed to save delivery details");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="sm:mx-auto sm:w-full sm:max-w-md"
        >
            <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">Delivery Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Full Name</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`block w-full px-3 py-2 pl-10 bg-gray-700 border ${errors.name ? "border-red-500" : "border-gray-600"} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Contact Number</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                                maxLength={10}
                                className={`block w-full px-3 py-2 pl-10 bg-gray-700 border ${errors.contactNumber ? "border-red-500" : "border-gray-600"} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        {errors.contactNumber && <p className='mt-1 text-sm text-red-500'>{errors.contactNumber}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Address</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 pt-2 pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows="3"
                                className={`block w-full px-3 py-2 pl-10 bg-gray-700 border ${errors.address ? "border-red-500" : "border-gray-600"} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                placeholder="123 Main St, Apt 4B"
                            />
                        </div>
                        {errors.address && <p className='mt-1 text-sm text-red-500'>{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">City</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full px-3 py-2 pl-10 bg-gray-700 border ${errors.city ? "border-red-500" : "border-gray-600"} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                    placeholder="New York"
                                />
                            </div>
                            {errors.city && <p className='mt-1 text-sm text-red-500'>{errors.city}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">State</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full px-3 py-2 pl-10 bg-gray-700 border ${errors.state ? "border-red-500" : "border-gray-600"} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                    placeholder="NY"
                                />
                            </div>
                            {errors.state && <p className='mt-1 text-sm text-red-500'>{errors.state}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Country</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    className={`block w-full px-3 py-2 pl-10 bg-gray-700 border ${errors.country ? "border-red-500" : "border-gray-600"} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                    placeholder="United States"
                                />
                            </div>
                            {errors.country && <p className='mt-1 text-sm text-red-500'>{errors.country}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Pincode</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Hash className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                    maxLength={6}
                                    className={`block w-full px-3 py-2 pl-10 bg-gray-700 border ${errors.pincode ? "border-red-500" : "border-gray-600"} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                                    placeholder="10001"
                                />
                            </div>
                            {errors.pincode && <p className='mt-1 text-sm text-red-500'>{errors.pincode}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Delivery Details'
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default DeliveryDetailsForm;
