/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TaskLog {
  id: string;
  task_id: string;
  task_name: string; // Add task_name here
  execution_time: string;
  status: string;
  details: string;
}

const fetchTaskLogs = async (userId: string): Promise<TaskLog[]> => {
  const response = await api.get(`taskslog/${userId}`);
  return response.data.data;
};

const TaskLogs: React.FC = () => {
  const getUserIdFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return userData.id;
    }
    return null;
  };

  const userId = getUserIdFromLocalStorage();

  const {
    data: taskLogs,
    error,
    isLoading,
  } = useQuery<TaskLog[]>({
    queryKey: ["taskLogs", userId],
    queryFn: () => fetchTaskLogs(userId),
    enabled: !!userId,
  });

  if (!userId) {
    toast.error("User ID not found in local storage.");
    return null;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    toast.error(
      (error as any).response?.data?.message ||
        "An error occurred. Please try again."
    );
    return null;
  }

  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        Task Execution Logs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell> {/* Change to Task Name */}
              <TableCell>Execution Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskLogs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.task_name}</TableCell> {/* Display Task Name */}
                <TableCell>
                  {new Date(log.execution_time).toLocaleString()}
                </TableCell>
                <TableCell>{log.status}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TaskLogs;
