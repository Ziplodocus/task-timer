import {
  Component,
  createEffect,
  createRenderEffect,
  createSignal,
  For,
} from "solid-js";
import * as Storage from "../../Storage/local";
import styles from "./index.module.css";
import ListItem from "../ListItem/ListItem";
import { clone, create, pause, Task } from "../../Structs/Task";
import { createStore, produce, unwrap } from "solid-js/store";

const List: Component = () => {
  const list = Storage.get("tasks") ?? [create("Hehe")];
  const [tasks, setTasks] = createStore<Task[]>(list);
  const [name, setName] = createSignal("");
  const [desc, setDesc] = createSignal("");

  const updateItems = () => {
    Storage.set("tasks", unwrap(tasks));
  };

  const createItem = () => {
    setTasks(produce((list) => {
      list.unshift(create(name(), desc()));
      return list;
    }));
    setName("");
    setDesc("");
    updateItems();
  };

  const deleteItem = (task: Task) => {
    setTasks(tasks.filter((item) => item.id != task.id));
    updateItems();
  };

  const pauseOtherItems = (task: Task) => {
    setTasks(produce((tasks) => {
      tasks.filter((item) => item.id !== task.id).forEach((item) =>
        pause(item)
      );
    }));
    updateItems();
  };

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
        <input
          type="text"
          class="tasklist__descriptor"
          placeholder="Description"
          oninput={(e) => setDesc(e.currentTarget.value)}
        >
        </input>
        <button class="button" onclick={createItem}>+</button>
      </div>

      <ul class={styles.list}>
        <For each={tasks}>
          {(task) => {
            return (
              // @ts-ignore
              <ListItem
                task={task}
                onUpdate={updateItems}
                onRemove={deleteItem}
                onPlay={pauseOtherItems}
              >
              </ListItem>
            );
          }}
        </For>
      </ul>
    </>
  );
};

export default List;
