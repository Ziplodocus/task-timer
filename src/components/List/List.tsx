import { Component, createSignal, For } from "solid-js";

import styles from "./index.module.css";
import ListItem from "../ListItem/ListItem";

const List: Component = () => {
  const [tasks, setTasks] = createSignal<Task[]>([
    new Task("Feed Bob"),
    new Task("Kill Bob"),
  ]);
  console.log(tasks());
  const [name, setName] = createSignal("New Task");
  const [activeTask, setActiveTask] = createSignal<Task | null>(null);

  const createItem = () => {
    setTasks((list) => {
      list.push(new Task(name()));
      return [...list];
    });
  };

  const toggle = (task: Task) => {
    setActiveTask(prevTask => {
      // If the task is active then it should be paused, and there will be no running tasks.
      if (prevTask === task) {
        task.active = false;
        return null;
      }

      if (prevTask !== null) {
        prevTask.pause();
      }

      task.active = true;
      return task;
    })
  }

  return (
    <>
      <div class="wrapper">
        <input
          oninput={(e) => setName((_) => e.currentTarget.value)}
          type="text"
          value={name()}
        />
        <button onclick={createItem}>Add Task</button>
      </div>

      <ul class={styles.List}>
        <For each={tasks()}>
          {(task, idx) => {
            return (
              <ListItem task={task} toggle={toggle}></ListItem>
            );
          }}
        </For>
      </ul>
    </>
  );
};

export default List;

export class Task {
  name: string;
  start: number;
  end: number;
  duration: number;
  active: boolean;

  constructor(name: string) {
    this.active = false;
    this.name = name;
    this.start = Date.now();
    this.end = Date.now();
    this.duration = 0;
  }

  pause() {
    this.active = false;
    this.end = Date.now();
    this.duration = (this.end - this.start) / 60;
  }
}
