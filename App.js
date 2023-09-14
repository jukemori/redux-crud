// Import necessary libraries and components
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
import { Provider } from "react-redux"; // Step 1: Import Redux Provider
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga"; // Step 2: Import Redux Saga
import { call, put, takeEvery } from "redux-saga/effects";
import { connect, useDispatch, useSelector } from "react-redux";

// API Base URL
const API_BASE_URL = "http://localhost:3000/api/v1";

// Redux Actions
const FETCH_TASKS = "FETCH_TASKS";
const SET_TASKS = "SET_TASKS";
const CREATE_TASK = "CREATE_TASK";
const DELETE_TASK = "DELETE_TASK";
const TOGGLE_TASK_STATUS = "TOGGLE_TASK_STATUS";

// Redux Action Creators
const fetchTasks = () => ({ type: FETCH_TASKS });
const setTasks = (tasks) => ({ type: SET_TASKS, tasks });
const createTask = (task) => ({ type: CREATE_TASK, task });
const deleteTask = (taskId) => ({ type: DELETE_TASK, taskId });
const toggleTaskStatus = (taskId, newStatus) => ({
  type: TOGGLE_TASK_STATUS,
  taskId,
  newStatus,
});

// Initial State
const initialState = {
  tasks: [],
};

// Redux Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TASKS:
      return { ...state, tasks: action.tasks };
    default:
      return state;
  }
};

// Redux Saga
function* fetchTasksSaga() {
  try {
    const response = yield call(axios.get, `${API_BASE_URL}/tasks`);
    yield put(setTasks(response.data)); // Step 3: Dispatch SET_TASKS action with fetched data
  } catch (error) {
    console.error("Error:", error);
  }
}

function* createTaskSaga(action) {
  try {
    yield call(axios.post, `${API_BASE_URL}/tasks`, { task: action.task });
    yield put(fetchTasks()); // Step 4: Dispatch FETCH_TASKS action after creating a task
  } catch (error) {
    console.error("Error:", error);
  }
}

function* deleteTaskSaga(action) {
  try {
    yield call(axios.delete, `${API_BASE_URL}/tasks/${action.taskId}`);
    yield put(fetchTasks()); // Step 5: Dispatch FETCH_TASKS action after deleting a task
  } catch (error) {
    console.error("Error:", error);
  }
}

function* toggleTaskStatusSaga(action) {
  try {
    yield call(axios.patch, `${API_BASE_URL}/tasks/${action.taskId}`, {
      done: action.newStatus,
    });
    yield put(fetchTasks()); // Step 6: Dispatch FETCH_TASKS action after toggling task status
  } catch (error) {
    console.error("Error:", error);
  }
}

function* rootSaga() {
  yield takeEvery(FETCH_TASKS, fetchTasksSaga); // Step 7: Watch for FETCH_TASKS action
  yield takeEvery(CREATE_TASK, createTaskSaga); // Step 8: Watch for CREATE_TASK action
  yield takeEvery(DELETE_TASK, deleteTaskSaga); // Step 9: Watch for DELETE_TASK action
  yield takeEvery(TOGGLE_TASK_STATUS, toggleTaskStatusSaga); // Step 10: Watch for TOGGLE_TASK_STATUS action
}

const sagaMiddleware = createSagaMiddleware(); // Step 11: Create Saga Middleware
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware)); // Step 12: Create Redux Store with Middleware
sagaMiddleware.run(rootSaga); // Step 13: Run the Saga Middleware

// Redux-connected component
function TaskApp() {
  const tasks = useSelector((state) => state.tasks); // Step 14: Access tasks from the Redux store
  const dispatch = useDispatch(); // Step 15: Get access to dispatch function

  useEffect(() => {
    dispatch(fetchTasks()); // Step 16: Dispatch FETCH_TASKS action to fetch tasks
  }, []);

  const handleCreateTask = () => {
    dispatch(createTask(newTask)); // Step 17: Dispatch CREATE_TASK action to create a task
    setNewTask({ title: "", description: "", done: false });
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId)); // Step 18: Dispatch DELETE_TASK action to delete a task
  };

  const handleToggleTaskStatus = (taskId, newStatus) => {
    dispatch(toggleTaskStatus(taskId, newStatus)); // Step 19: Dispatch TOGGLE_TASK_STATUS action to toggle task status
  };

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    done: false,
  });

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
              onPress={() => handleToggleTaskStatus(task.id, !task.done)}
            />
            <Button title="Delete" onPress={() => handleDeleteTask(task.id)} />
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
        <Button title="Add Task" onPress={handleCreateTask} />
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

export default function App() {
  return (
    <Provider store={store}>
      {" "}
      {/* Step 20: Wrap the main component with Redux Provider */}
      <TaskApp />
    </Provider>
  );
}
