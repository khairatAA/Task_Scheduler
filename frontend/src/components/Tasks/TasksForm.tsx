/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
// src/components/TasksForm.tsx
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TasksFormProps {
  open: boolean;
  handleClose: () => void;
}

interface TasksFormInputs {
  name: string;
  description?: string;
  execution_time?: string;
  execution_type: string;
  recurring_interval?: string;
  recurringTime?: string;
  minute?: number;
  hour?: number;
  day_of_week?: number;
  day_of_month?: number;
  month?: number;
}

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Task name is required"),
  description: yup.string(),
  execution_time: yup.string().when("execution_type", {
    is: (val: string) => val === "one-time",
    then: (schema) =>
      schema.required("Execution time is required for one-time tasks"),
  }),
  execution_type: yup.string().required("Execution type is required"),
  recurring_interval: yup.string().when("execution_type", {
    is: (val: string) => val === "recurring",
    then: (schema) => schema.required("Recurring interval is required"),
  }),
  recurringTime: yup.string(),
  day_of_week: yup
    .number()
    .min(0, "Day of week must be between 0 and 6")
    .max(6, "Day of week must be between 0 and 6"),
  minute: yup
    .number()
    .min(2, "Minute must be between 2 and 59")
    .max(59, "Minute must be between 2 and 59"),
  hour: yup
    .number()
    .min(0, "Hour must be between 0 and 23")
    .max(23, "Hour must be between 0 and 23"),
  day_of_month: yup
    .number()
    .min(1, "Day of month must be between 1 and 31")
    .max(31, "Day of month must be between 1 and 31"),
  month: yup
    .number()
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
});

const TasksForm: React.FC<TasksFormProps> = ({ open, handleClose }) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    watch,
    // setValue,
  } = useForm<TasksFormInputs>({
    resolver: yupResolver(schema),
  });

  const executionType = watch("execution_type");
  const recurringInterval = watch("recurring_interval");

  const generateCronExpression = (data: TasksFormInputs) => {
    if (data.execution_type === "recurring") {
      let cronExpression = "";

      switch (data.recurring_interval) {
        case "minute":
          cronExpression = `*/${data.minute || 1} * * * *`;
          break;
        case "hour":
          cronExpression = `0 */${data.hour || 1} * * *`;
          break;
        case "day":
          const [dayHour, dayMinute] = (data.recurringTime || "00:00").split(
            ":"
          );
          cronExpression = `${dayMinute} ${dayHour} * * *`;
          break;
        case "week":
          const [weekHour, weekMinute] = (data.recurringTime || "00:00").split(
            ":"
          );
          cronExpression = `${weekMinute} ${weekHour} * * ${data.day_of_week}`;
          break;
        case "month":
          const [monthHour, monthMinute] = (
            data.recurringTime || "00:00"
          ).split(":");
          cronExpression = `${monthMinute} ${monthHour} ${data.day_of_month} * *`;
          break;
        default:
          cronExpression = "* * * * *";
      }

      return cronExpression;
    }
    return "";
  };

  const getUserIdFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return userData.id;
    }
    return null;
  };

  const userId = getUserIdFromLocalStorage();

  const createTaskMutation = useMutation({
    mutationFn: (newTask: any) => api.post(`tasks/create`, newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
      setMessage("Task created successfully");
      setTimeout(() => (handleClose(), reset()), 1000);
      setMessage("");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    },
  });

  const onSubmit: SubmitHandler<TasksFormInputs> = (data) => {
    const taskData = {
      ...data,
      cron_expression: generateCronExpression(data),
      execution_time: data.execution_time
        ? new Date(data.execution_time).toISOString()
        : null,
      user_id: userId,
    };

    createTaskMutation.mutate(taskData);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below to create a new task.
          </DialogContentText>
          {message && (
            <span className=" text-green-500 font-bold mb-3">{message}</span>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Task Name"
              type="text"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="execution_type_label">Execution Type</InputLabel>
              <Select
                labelId="execution_type_label"
                id="execution_type"
                {...register("execution_type")}
                defaultValue=""
                error={!!errors.execution_type}
              >
                <MenuItem value="one-time">One-time</MenuItem>
                <MenuItem value="recurring">Recurring</MenuItem>
              </Select>
            </FormControl>
            {executionType === "one-time" && (
              <TextField
                margin="dense"
                id="execution_time"
                label="Execution Time"
                type="datetime-local"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("execution_time")}
                error={!!errors.execution_time}
                helperText={errors.execution_time?.message}
              />
            )}
            {executionType === "recurring" && (
              <>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="recurring_interval_label">
                    Recurring Interval
                  </InputLabel>
                  <Select
                    labelId="recurring_interval_label"
                    id="recurring_interval"
                    {...register("recurring_interval")}
                    defaultValue=""
                    error={!!errors.recurring_interval}
                  >
                    <MenuItem value="minute">Minute</MenuItem>
                    <MenuItem value="hour">Hour</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                  </Select>
                </FormControl>
                {recurringInterval === "minute" && (
                  <TextField
                    margin="dense"
                    id="minute"
                    label="Every 2 - 59 Minutes"
                    type="number"
                    fullWidth
                    {...register("minute")}
                    error={!!errors.minute}
                    helperText={errors.minute?.message}
                  />
                )}
                {recurringInterval === "hour" && (
                  <TextField
                    margin="dense"
                    id="hour"
                    label="Every 1 - 24 Hours"
                    type="number"
                    fullWidth
                    {...register("hour")}
                    error={!!errors.hour}
                    helperText={errors.hour?.message}
                  />
                )}
                {(recurringInterval === "day" ||
                  recurringInterval === "week" ||
                  recurringInterval === "month") && (
                  <TextField
                    margin="dense"
                    id="recurringTime"
                    label="Execution Time"
                    type="time"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("recurringTime")}
                    error={!!errors.recurringTime}
                    helperText={errors.recurringTime?.message}
                  />
                )}
                {recurringInterval === "week" && (
                  <TextField
                    margin="dense"
                    id="day_of_week"
                    label="Day of Week (0-6, 0=Sunday)"
                    type="number"
                    fullWidth
                    {...register("day_of_week")}
                    error={!!errors.day_of_week}
                    helperText={errors.day_of_week?.message}
                  />
                )}
                {recurringInterval === "month" && (
                  <TextField
                    margin="dense"
                    id="day_of_month"
                    label="Day of Month (1-31)"
                    type="number"
                    fullWidth
                    {...register("day_of_month")}
                    error={!!errors.day_of_month}
                    helperText={errors.day_of_month?.message}
                  />
                )}
              </>
            )}
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" color="primary">
                Create Task
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default TasksForm;
