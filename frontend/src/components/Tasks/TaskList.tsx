/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/TaskList.tsx
import React from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Task {
  id: string;
  name: string;
  description: string;
  execution_time: string;
  execution_type: string;
  cron_expression: string;
  status: string;
}

const TaskList: React.FC = () => {
  const queryClient = useQueryClient();

  const getUserIdFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return userData.id;
    }
    return null;
  };

  const userId = getUserIdFromLocalStorage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", userId],
    queryFn: async () => {
      const response = await api.get(`tasks/user/${userId}`);
      return response.data.data;
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => api.delete(`tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
      toast.success("Task deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    },
  });

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading tasks</Typography>;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Tasks
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Execution Time</TableCell>
              <TableCell>Execution Type</TableCell>
              <TableCell>Cron Expression</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((task: Task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  {task.execution_time &&
                    format(new Date(task.execution_time), "PPpp")}
                </TableCell>
                <TableCell>{task.execution_type}</TableCell>
                <TableCell>{task.cron_expression}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <DeleteIcon className="text-red-500" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TaskList;
