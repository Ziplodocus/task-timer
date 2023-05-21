import type { Component } from 'solid-js';

import styles from './App.module.css';
import ListItem from './components/ListItem/ListItem';
import List from './components/List/List';

const App: Component = () => {
  return (
    <main class={styles.App}>
      <List></List>
    </main>
  );
};

export default App;
