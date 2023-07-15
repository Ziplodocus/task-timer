import {
  Component,
  onCleanup,
} from "solid-js";
import { } from "solid-js";
import { createStore, produce } from "solid-js/store";
import styles from "./index.module.scss";
import {
  pause as pauseTask,
  play as playTask,
  Task,
} from "../../Structs/Task";
import { formatSeconds } from "../../utilities/timeconversion";

type ListItemProps = {
  task: Task;
  onRemove: (task: Task) => void;
  onUpdate: () => void;
  onPlay: (task: Task) => void;
}

const ListItem: Component<ListItemProps> = (props) => {
  const [task, setTask] = createStore(props.task);
  const { onUpdate, onPlay, onRemove } = props;

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
    onUpdate();
  }

  function play() {
    setTask(produce((task) => {
      playTask(task);
      return task;
    }));
    onPlay(task);
    onUpdate();
  }

  function updateField(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const el = e.currentTarget;

    if (!(el instanceof HTMLElement)) return;

    setTask(el.dataset.name, el.textContent ?? "");
    el.blur();

    onUpdate();
  }

  function resetField(e: Event) {
    const el = e.currentTarget;

    if (!(el instanceof HTMLElement)) return;

    const name = el?.dataset?.name;

    if (!name) return;

    el.textContent = task[name] ?? "";

    props.onUpdate();
  }

  return (
    <li>
      <article class={`${styles.item} ${task.active ? styles.activeItem : ''} dimensional`}>
        <div class={styles.header}>
          <span
            contentEditable
            class={styles.name}
            data-name="name"
            onkeypress={updateField}
            onblur={resetField}
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
              onclick={() => onRemove(task)}
            >
              X
            </button>
          </div>
        </div>

        <p
          class={styles.description}
          contentEditable
          data-name="description"
          onkeypress={updateField}
          onblur={resetField}
        >
          {task.description ?? ""}
        </p>
      </article>
    </li>
  );
};

export default ListItem;
