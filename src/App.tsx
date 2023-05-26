import type { Component } from "solid-js";

import styles from "./App.module.css";
import ListItem from "./components/ListItem/ListItem";
import List from "./components/List/List";

const App: Component = () => {
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
      </main>
    </>
  );
};

export default App;
