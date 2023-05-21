import type { Component } from "solid-js";
import { mergeProps } from "solid-js";

import styles from "./index.module.css";
import { Task } from "../List/List";

const ListItem: Component<{ task: Task; toggle: (t: Task) => void }> = (
  props,
) => {
  const merged = mergeProps({ task: new Task("Default") }, props);

  return (
    <li class={styles.item}>
      <span>{merged.task.name}</span>
      <span>{merged.task.start}</span>
      <span>{merged.task.end}</span>
      <span>{merged.task.duration}</span>
      <button onclick={e => {
        console.log('clicked m8');
        merged.toggle(merged.task);
        console.log(merged.task);
      }}>{merged.task.active ? 'Pause' : 'Play'}</button>
    </li>
  );
};

export default ListItem;
