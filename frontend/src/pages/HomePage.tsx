import { useNavigate } from "react-router-dom";
import HeaderStyles from "../components/Reuseables/HeaderStyles";
import RegisterUi from "../components/Reuseables/SurfaceUI";
import { Button } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <RegisterUi>
        <HeaderStyles header_title="Welcome To The Ultimate Task Scheduler" />
        <div className=" flex gap-8 mt-20">
          <Button
            type="submit"
            variant="contained"
            startIcon={<ArrowBack />}
            color="primary"
            fullWidth
            onClick={() => navigate("/auth/register")}
          >
            Register
          </Button>

          <Button
            type="submit"
            variant="outlined"
            endIcon={<ArrowForward />}
            color="primary"
            fullWidth
            onClick={() => navigate("/auth/login")}
          >
            Login
          </Button>
        </div>
      </RegisterUi>
    </div>
  );
};

export default HomePage;
