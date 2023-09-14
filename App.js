import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  TextInput,
  StyleSheet,
} from "react-native";
import { Card } from "react-native-elements";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    done: false,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get(`${API_BASE_URL}/tasks`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const createTask = () => {
    axios
      .post(`${API_BASE_URL}/tasks`, { task: newTask })
      .then(() => {
        fetchTasks();
        setNewTask({ title: "", description: "", done: false });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`${API_BASE_URL}/tasks/${taskId}`)
      .then(() => {
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const toggleTaskStatus = (taskId, newStatus) => {
    axios
      .patch(`${API_BASE_URL}/tasks/${taskId}`, { done: newStatus })
      .then(() => {
        fetchTasks();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {tasks.map((task) => (
          <Card key={task.id}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.description}>{task.description}</Text>
            <Text style={styles.done}>{task.done ? "Done" : "Not Done"}</Text>
            <Button
              title={task.done ? "Mark as Not Done" : "Mark as Done"}
              onPress={() => toggleTaskStatus(task.id, !task.done)}
            />
            <Button title="Delete" onPress={() => deleteTask(task.id)} />
          </Card>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
          value={newTask.title}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          onChangeText={(text) => setNewTask({ ...newTask, description: text })}
          value={newTask.description}
        />
        <Button title="Add Task" onPress={createTask} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  done: {
    fontSize: 16,
    color: "green",
  },
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});
