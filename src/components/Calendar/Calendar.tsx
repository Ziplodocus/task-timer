import { Component, For } from "solid-js";
import { createStore } from "solid-js/store";
import * as Storage from "../../Storage/local";
import { Task } from "../../Structs/Task";
import styles from "./index.module.scss";

const Calendar: Component = () => {
  const list = Storage.get("tasks") ?? [create("Hehe")];
  const [tasks, setTasks] = createStore<Task[]>(list);

  return (
    <section class={styles.calendar}>
      <div class={styles.hours}>
        <div class={styles.hour}></div>
        <div class={styles.hour}></div>
        <div class={styles.hour}></div>
        <div class={styles.hour}></div>
        <div class={styles.hour}></div>
        <div class={styles.hour}></div>
        <div class={styles.hour}></div>
        <div class={styles.hour}></div>
        <div class={styles.hour}></div>
        <div class={styles.hour}></div>
      </div>

      <ul class={styles.tasks}>
        <For each={tasks}>
          {task => { 
            return (
              <For each={task.entries}>
                {entry => {
                  return (
                    <div class={styles.entry}>
                      <span class={styles.entryName}>{task.name}</span>
                      <span class={styles.entryDuration}>{}</span>
                    </div>
                  )
                }}
              </For>
            )
          }}
        </For>
      </ul>
    </section>

  )
}

export default Calendar;