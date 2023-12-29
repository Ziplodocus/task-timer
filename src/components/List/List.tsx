import {
  Component,
  createEffect,
  createRenderEffect,
  createSignal,
  For,
  splitProps,
} from "solid-js";
import * as Storage from "../../Storage/local";
import styles from "./index.module.css";
import ListItem from "../ListItem/ListItem";
import { clone, create, pause, Task } from "../../Structs/Task";
import { createStore, produce, SetStoreFunction, unwrap } from "solid-js/store";
import IconAdd from "../../icons/IconAdd";

type ListProps = {
  tasks: Task[]
  setTasks: SetStoreFunction<Task[]>
}

const List: Component<ListProps> = (props: ListProps) => {
  const { tasks, setTasks } = props;

  const [name, setName] = createSignal("");
  const [desc, setDesc] = createSignal("");

  const updateItems = () => {
    Storage.set("tasks", unwrap(tasks));
  };

  const createItem = (e : Event) => {
    e.preventDefault();
    setTasks(produce((list) => {
      list.unshift(create(name(), desc()));
      return list;
    }));
    setName("");
    setDesc("");
    updateItems();
  };

  const smoothCreateItem = (e: Event) => {
    e.preventDefault();
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        createItem(e);
      })
    } else {
      createItem(e);
    }
  }

  const deleteItem = (task: Task) => {
    setTasks(tasks.filter((item) => item.id !== task.id));
    updateItems();
  };

  const smoothDeleteItem = (task: Task) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        deleteItem(task);
      })
    } else {
      deleteItem(task);
    }
  }

  const pauseOtherItems = (task: Task) => {
    setTasks(produce((tasks) => {
      tasks.forEach((item) => {
        if (item.id === task.id) return;
        pause(item)
      });
    }));
    updateItems();
  };

  return (
    <>
      <form action="#" class={styles.inputs} onsubmit={smoothCreateItem}>
        <input
          class="tasklist__namer"
          oninput={(e) => setName(e.currentTarget.value)}
          type="text"
          name="name"
          value={name()}
          placeholder="Task Name"
        />
        <input
          type="text"
          class="tasklist__descriptor"
          placeholder="Description"
          name="description"
          value={desc()}
          oninput={(e) => setDesc(e.currentTarget.value)}
        >
        </input>
        <button class="button"><IconAdd /></button>
      </form>

      <ul class={styles.list}>
        <For each={tasks}>
          {(task ) => {
            function setTask(mutator: (task: Task) => void) {
              setTasks(
                the_task => task.id === the_task.id,
                produce(mutator)
              )
            }

            return (
              // @ts-ignore
              <ListItem
                task={task}
                setTask={setTask}
                onUpdate={updateItems}
                onRemove={smoothDeleteItem}
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
