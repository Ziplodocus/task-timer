import type { Component } from "solid-js";

import styles from "./App.module.css";
import List from "./components/List/List";
import Calendar from "./components/Calendar/Calendar";
import * as Storage from "./Storage/local";
import { createStore } from "solid-js/store";

const App: Component = () => {
  const tasksList = Storage.get('tasks') ?? [];
  if (tasksList instanceof Error) {
    console.error('The app is broken m8');
  }
  const [tasks, setTasks] = createStore(tasksList);

  return (
    <>
      <header>
        <hgroup>
          <h1>Task Timer</h1>
          <p>Time your task to the minute</p>
        </hgroup>
      </header>
      <main class={styles.App}>
        <List tasks={tasks} setTasks={setTasks}></List>
        <Calendar tasks={tasks}></Calendar>
      </main>
    </>
  );
};

export default App;
