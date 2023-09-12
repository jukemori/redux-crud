import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import axios from "axios";

const API_BASE_URL = "http://172.19.252.107:8000";
export default function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const apiUrl = `${API_BASE_URL}/api/tasks`;

    axios
      .get(apiUrl)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <View>
      <ScrollView>
        {tasks.map((task) => (
          <View key={task.id}>
            <Text>{task.title}</Text>
            <Text>yooo</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
