
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import DatePicker from "react-native-date-picker";

const App = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const addTask = () => {
    const title = taskTitle.trim();

    if (!title) return;

    const newTask = {
      id: Date.now().toString() + Math.random().toString(),
      title,
      dueDate: null,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskTitle("");
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    if (editingTaskId === id) {
      setEditingTaskId(null);
      setTaskTitle("");
    }

    if (selectedTaskId === id) {
      setSelectedTaskId(null);
      setDatePickerOpen(false);
    }
  };

  const editTask = (task) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
  };

  const saveTask = () => {
    const title = taskTitle.trim();

    if (!title) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTaskId
          ? { ...task, title }
          : task
      )
    );

    setEditingTaskId(null);
    setTaskTitle("");
  };

  const openDatePicker = (taskId) => {
    setSelectedTaskId(taskId);
    setDatePickerOpen(true);
  };

  const confirmDate = (date) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedTaskId
          ? { ...task, dueDate: date }
          : task
      )
    );

    setDatePickerOpen(false);
    setSelectedTaskId(null);
  };

  const cancelDatePicker = () => {
    setDatePickerOpen(false);
    setSelectedTaskId(null);
  };

  const selectedTask = tasks.find(
    (task) => task.id === selectedTaskId
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={editingTaskId ? saveTask : addTask}
        >
          <Text style={styles.buttonText}>
            {editingTaskId ? "Save" : "Add Task"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.taskList}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>
              {item.title}
            </Text>

            <TouchableOpacity
              onPress={() => openDatePicker(item.id)}
              style={styles.dateButton}
            >
              <Text style={styles.dateText}>
                {item.dueDate
                  ? item.dueDate.toLocaleString()
                  : "No Due Date"}
              </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editTask(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <DatePicker
        testID="date-picker"
        modal={true}
        open={datePickerOpen}
        mode="datetime"
        date={selectedTask?.dueDate || new Date()}
        onConfirm={confirmDate}
        onCancel={cancelDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
  },
  dateButton: {
    paddingVertical: 8,
    marginBottom: 10,
  },
  dateText: {
    color: "#555",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
});

export default App;
