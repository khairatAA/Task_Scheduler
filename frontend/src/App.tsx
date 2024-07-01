import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader/Loader";

const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ResponsiveDrawer = lazy(() => import("./components/SidePanel/Drawer"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const Tasks = lazy(() => import("./pages/Tasks"));
const TaskLog = lazy(() => import("./pages/TaskLog"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />

          <Route path="/dashboard" element={<ResponsiveDrawer />}>
            <Route path="delete-account" element={<DeleteAccount />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="task_logs" element={<TaskLog />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
