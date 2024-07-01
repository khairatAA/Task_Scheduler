import { useNavigate } from "react-router-dom";
import HeaderStyles from "../components/Reuseables/HeaderStyles";
import { Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const DeleteAccount = () => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      const user = localStorage.getItem("user");
      const userData = JSON.parse(user || "");
      const id = userData.id;
      await api.delete(`/users/delete-account/${id}`);
      navigate("/");
    } catch (error) {
      toast.error("Error deleting account");
      console.error("Delete account error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-light-gray p-10 my-10 rounded-xl w-[50%] max-md:w-[90%]">
        <HeaderStyles header_title="Delete Account" />
        <div className="flex gap-8 mt-40">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DeleteAccount;
