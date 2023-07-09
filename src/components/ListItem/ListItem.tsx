import {
  Component,
  createEffect,
  createRenderEffect,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";
import {} from "solid-js";
import { createStore, produce } from "solid-js/store";

import styles from "./index.module.css";
import {
  clone,
  pause as pauseTask,
  play as playTask,
  Task,
} from "../../Structs/Task";
import { formatSeconds } from "../../utilities/timeconversion";

const ListItem: Component<
  {
    task: Task;
    onRemove: (task: Task) => void;
    onUpdate: () => void;
    onPlay: (task: Task) => void;
  }
> = (
  props,
) => {
  const [task, setTask] = createStore(props.task);

  onCleanup(() => pauseTask(task));

  setTask("active", false);
  setTask("currentEntry", undefined);

  function toggle() {
    task.active ? pause() : play();
  }

  function pause() {
    setTask(produce((task) => {
      pauseTask(task);
      return task;
    }));
    props.onUpdate();
  }

  function play() {
    setTask(produce((task) => {
      playTask(task);
      return task;
    }));
    props.onPlay(task);
    props.onUpdate();
  }

  function updateName(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const el = e.currentTarget;
    if (el instanceof HTMLElement) {
      setTask("name", el.textContent ?? "");
      el.blur();
    }
    props.onUpdate();
  }

  function updateDescription(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const el = e.currentTarget;
    if (el instanceof HTMLElement) {
      setTask("description", el.textContent ?? "");
      el.blur();
    }
    props.onUpdate();
  }

  function resetName(e: Event) {
    const el = e.currentTarget;
    if (el instanceof HTMLElement) {
      el.textContent = task.name ?? "";
    }
    props.onUpdate();
  }

  function resetDescription(e: Event) {
    const el = e.currentTarget;
    if (el instanceof HTMLElement) {
      el.textContent = task.description ?? "";
    }
    props.onUpdate();
  }

  return (
    <li>
      <article class={`${styles.item} ${task.active ? styles.activeItem : ''} dimensional`}>
        <div class={styles.header}>
          <span
            contentEditable
            class={styles.name}
            onkeypress={updateName}
            onblur={resetName}
          >
            {task.name}
          </span>

          <div class="spaced">
            <span class={styles.duration}>
              {formatSeconds(task.duration)}
            </span>
            <span class={styles.id}>ID: {task.id}</span>
            <button aria-label="Toggle active state" onclick={toggle}>
              {task.active ? "⏸" : "⏵"}
            </button>
            <button
              aria-label="Delete task"
              onclick={() => props.onRemove(task)}
            >
              X
            </button>
          </div>
        </div>

        <p
          class={styles.description}
          contentEditable
          onkeypress={updateDescription}
          onblur={resetDescription}
        >
          {task.description ?? ""}
        </p>
      </article>
    </li>
  );
};

export default ListItem;
