/* eslint-disable @typescript-eslint/no-explicit-any */
import TextInput from "../components/FormValidation/TextInput";
import HeaderStyles from "../components/Reuseables/HeaderStyles";
import RegisterUi from "../components/Reuseables/SurfaceUI";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define validation schema using Yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const response = await api.post("/users/login", data);

      const { user, token } = response.data; // Extract user data and token from response
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      navigate("/dashboard/tasks");
      console.log("Logged In..");
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Please try again. An error occurred"
      );
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <RegisterUi>
        <div className=" mb-8">
          <HeaderStyles header_title="Log In" />
        </div>
        <form className=" flex flex-col gap-8">
          <div className=" flex flex-col gap-5">
            <TextInput
              name="email"
              control={control}
              label="Email"
              error={errors.email}
              type="text"
            />
            <TextInput
              name="password"
              control={control}
              label="Password"
              type="password"
              error={errors.password}
            />
          </div>
          <div className=" flex flex-col gap-2">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit(onSubmit)}
            >
              Log In
            </Button>
            <span>
              Don't have an account{" "}
              <span
                onClick={() => navigate("/auth/register")}
                className=" text-blue font-bold cursor-pointer"
              >
                Register
              </span>
            </span>
          </div>
        </form>
      </RegisterUi>
      <ToastContainer />
    </div>
  );
};

export default Login;
