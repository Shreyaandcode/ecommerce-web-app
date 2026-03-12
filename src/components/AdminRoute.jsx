import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const AdminRoute = ({ children }) => {
    const { user } = useUserStore();
    
    if (!user || user.role !== "admin") {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AdminRoute; 