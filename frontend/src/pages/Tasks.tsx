import React, { useState } from "react";
import Button from "@mui/material/Button";
import TasksForm from "../components/Tasks/TasksForm";
import { ToastContainer } from "react-toastify";
import TaskList from "../components/Tasks/TaskList";

const Tasks: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className=" mb-16">
        <Button variant="outlined" onClick={handleClickOpen}>
          Add a New Task
        </Button>
      </div>

      <TaskList />
      <TasksForm open={open} handleClose={handleClose} />
      <ToastContainer />
    </div>
  );
};

export default Tasks;
