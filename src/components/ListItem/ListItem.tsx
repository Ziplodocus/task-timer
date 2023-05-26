import { Component, createSignal, Show } from "solid-js";
import { mergeProps } from "solid-js";

import styles from "./index.module.css";
import { Task, toggle } from "../../Structs/Task";
import { formatSeconds } from "../../utilities/timeconversion";

const ListItem: Component<
  { task: Task; remove: (task: Task) => void; update: (task: Task) => void }
> = (
  props,
) => {
  const merged = mergeProps(props);
  const [curTask, setCurTask] = createSignal<Task>(merged.task);

  return (
    <li>
      <article class={styles.item}>
        <div class={styles.header}>
          <span
            contentEditable
            class={styles.name}
            onkeypress={(e) => {
              const el = e.target;
              if (e.key !== "Enter") return;
              e.preventDefault();
              setCurTask((old) => {
                old.name = el.textContent ?? "";
                return { ...old };
              });
              merged.update(curTask());
              if (el instanceof HTMLElement) {
                el.blur();
              }
            }}
            onblur={(e) => {
              e.target.textContent = curTask().name;
            }}
          >
            {curTask().name}
          </span>
          <div class="spaced">
            <span class={styles.duration}>
              {formatSeconds(curTask().duration)}
            </span>
            <span class={styles.id}>ID: {curTask().id}</span>
            <button
              onclick={() => {
                toggle(curTask());
                setCurTask((old) => {
                  return { ...old };
                });
                merged.update(curTask());
              }}
            >
              {curTask().active ? "⏸" : "⏵"}
            </button>
            <button
              aria-label="Delete task"
              onclick={() => merged.remove(curTask())}
            >
              X
            </button>
          </div>
        </div>

        <p
          class={styles.description}
          contentEditable
          onkeypress={(e) => {
            const el = e.target;
            if (e.key !== "Enter") return;
            e.preventDefault();
            setCurTask((old) => {
              old.description = el.textContent ?? "";
              return { ...old };
            });
            merged.update(curTask());
            if (el instanceof HTMLElement) {
              el.blur();
            }
          }}
          onblur={(e) => {
            e.target.textContent = curTask().description ?? "";
          }}
        >
          {curTask().description ?? ""}
        </p>
      </article>
    </li>
  );
};

export default ListItem;
