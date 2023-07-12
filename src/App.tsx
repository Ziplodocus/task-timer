import type { Component } from "solid-js";

import styles from "./App.module.css";
import ListItem from "./components/ListItem/ListItem";
import List from "./components/List/List";
import Calendar from "./components/Calendar/Calendar";
import * as Storage from "./Storage/local";
import { createStore } from "solid-js/store";

const App: Component = () => {
  const tasksList = Storage.get('tasks');
  const [tasks, setTasks] = createStore(tasksList);

  const getTasks = () => tasks;
  return (
    <>
      <header>
        <hgroup>
          <h1>Task Timer</h1>
          <p>Time your task to the minute</p>
        </hgroup>
      </header>
      <main class={styles.App}>
        <List></List>
        <Calendar tasks={getTasks}></Calendar>
      </main>
    </>
  );
};

export default App;
