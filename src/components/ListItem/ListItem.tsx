import { Component, createEffect, createRenderEffect, createSignal, onCleanup, Show } from "solid-js";
import { mergeProps } from "solid-js";

import styles from "./index.module.css";
import { clone, Task, pause as pauseTask, play as playTask } from "../../Structs/Task";
import { formatSeconds } from "../../utilities/timeconversion";

const ListItem: Component<
  {
    task: Task;
    onUpdate: (task: Task) => void;
    onRemove: (task: Task) => void;
  }
> = (
  props,
) => {
  const [get, set] = createSignal(props.task);

  createEffect(() => props.onUpdate(get()));
  onCleanup(() => pauseTask(get()));

  function toggle() {
    get().active ? pause() : play();
  }

  function pause() {
    const task = get();
    pauseTask(task);
    set(clone(task));
  }

  function play() {
    const task = get();
    playTask(task);
    set(clone(task));
  }

  function updateName(e: KeyboardEvent) {
    const el = e.target;
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (el instanceof HTMLElement) {
      const task = get();
      task.name = (el.textContent ?? "");
      el.blur();
      set(clone(task));
    }
  }

  function updateDescription(e: KeyboardEvent) {
    const el = e.target;
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (el instanceof HTMLElement) {
      const task = get();
      task.description = el.textContent ?? "";
      set(clone(task));
      el.blur();
    }
  }

  return (
    <li>
      <article class={styles.item}>
        <div class={styles.header}>
          <span
            contentEditable
            class={styles.name}
            onkeypress={updateName}
          >
            {get().name}
          </span>

          <div class="spaced">
            <span class={styles.duration}>
              {formatSeconds(get().duration)}
            </span>
            <span class={styles.id}>ID: {get().id}</span>
            <button aria-label="Toggle active state" onclick={toggle}>
              {get().active ? "⏸" : "⏵"}
            </button>
            <button
              aria-label="Delete task"
              onclick={() => props.onRemove(get())}
            >
              X
            </button>
          </div>
        </div>

        <p
          class={styles.description}
          contentEditable
          onkeypress={updateDescription}
        >
          {get().description ?? ""}
        </p>
      </article>
    </li>
  );
};

export default ListItem;
