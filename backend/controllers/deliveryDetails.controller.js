import DeliveryDetails from '../models/deliveryDetails.model.js';

export const saveDeliveryDetails = async (req, res) => {
    try {
        const { name, contactNumber, address, city, state, country, pincode } = req.body;
        const userId = req.user._id;

        let deliveryDetails = await DeliveryDetails.findOne({ user: userId });

        if (deliveryDetails) {
            // Update existing delivery details
            deliveryDetails = await DeliveryDetails.findOneAndUpdate(
                { user: userId },
                { name, contactNumber, address, city, state, country, pincode },
                { new: true }
            );
        } else {
            // Create new delivery details
            deliveryDetails = new DeliveryDetails({
                user: userId,
                name,
                contactNumber,
                address,
                city,
                state,
                country,
                pincode
            });
            await deliveryDetails.save();
        }

        res.status(200).json(deliveryDetails);
    } catch (error) {
        console.log("Error in saveDeliveryDetails controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getDeliveryDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const deliveryDetails = await DeliveryDetails.findOne({ user: userId });
        res.status(200).json(deliveryDetails || null);
    } catch (error) {
        console.log("Error in getDeliveryDetails controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
