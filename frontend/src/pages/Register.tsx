/* eslint-disable @typescript-eslint/no-explicit-any */
import TextInput from "../components/FormValidation/TextInput";
import HeaderStyles from "../components/Reuseables/HeaderStyles";
import RegisterUi from "../components/Reuseables/SurfaceUI";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api";

// Define validation schema using Yup
const schema = yup.object().shape({
  user_name: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      user_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      await api.post("users/register", data);
      navigate("/auth/login");
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Please try again. An error occurred"
      );
      console.log(error);
    }
  };

  return (
    <div>
      <RegisterUi>
        <div className=" mb-8">
          <HeaderStyles header_title="Register" />
        </div>
        <form className=" flex flex-col gap-8">
          <div className=" flex flex-col gap-5">
            <TextInput
              name="user_name"
              control={control}
              label="Username"
              error={errors.user_name}
              type="text"
            />
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
            <TextInput
              name="confirm_password"
              control={control}
              label="Confirm Password"
              type="password"
              error={errors.confirm_password}
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
              Register
            </Button>
            <span>
              Already have an account{" "}
              <span
                onClick={() => navigate("/auth/login")}
                className=" text-blue font-bold cursor-pointer"
              >
                Log In
              </span>
            </span>
          </div>
        </form>
      </RegisterUi>
      <ToastContainer />
    </div>
  );
};

export default Register;
