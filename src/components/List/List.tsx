import { Component, createSignal, For } from "solid-js";
import * as Storage from "../../Storage/local";
import styles from "./index.module.css";
import ListItem from "../ListItem/ListItem";
import { create, Task } from "../../Structs/Task";

const List: Component = () => {
  const list = Storage.get("tasks") ?? [];

  const [tasks, setTasks] = createSignal<Task[]>(list);
  const [name, setName] = createSignal("");
  const [desc, setDesc] = createSignal("");

  const createItem = () => {
    setTasks((list) => {
      list.unshift(create(name(), desc()));
      return [...list];
    });
    Storage.set("tasks", tasks());
  };

  const deleteItem = (task: Task) => {
    setTasks(tasks().filter((item) => item.id != task.id));
    Storage.set("tasks", tasks());
  };

  const updateItem = (task: Task) => {
    setTasks(old => {
      const i = old.findIndex(item => task.id === item.id);
      old[i] = task;
      return old;
    })
    Storage.set('tasks', tasks());
  }

  return (
    <>
      <div class={styles.inputs}>
        <input
          class="tasklist__namer"
          oninput={(e) => setName(e.currentTarget.value)}
          type="text"
          value={name()}
          placeholder="Task Name"
        />
        <input type="text" class="tasklist__descriptor" placeholder="Description" oninput={(e) => setDesc(e.currentTarget.value)}>
        </input>
        <button class="button" onclick={createItem}>+</button>
      </div>

      <ul class={styles.list}>
        <For each={tasks()}>
          {(task) => <ListItem task={task} remove={deleteItem} update={updateItem}></ListItem>}
        </For>
      </ul>
    </>
  );
};

export default List;
