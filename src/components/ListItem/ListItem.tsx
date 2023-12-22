import {
  Component,
  onCleanup,
} from "solid-js";
import {createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import styles from "./index.module.scss";
import {
  getDurationInS,
  pause as pauseTask,
  play as playTask,
  Task,
} from "../../Structs/Task";
import { formatSeconds } from "../../utilities/timeconversion";
import IconPlay from "../../icons/IconPlay";
import IconPause from "../../icons/IconPause";
import IconClose from "../../icons/IconClose";

type ListItemProps = {
  task: Task;
  setTask: (mutator :(task: Task) => void) => void
  onRemove: (task: Task) => void;
  onUpdate: () => void;
  onPlay: (task: Task) => void;
}

const ListItem: Component<ListItemProps> = (props) => {
  const {task, setTask} = props;
  const { onUpdate, onPlay, onRemove } = props;

  onCleanup(() => pauseTask(task));

  setTask(task => {
    task.active = false;
    if (task.currentEntry) {
      task.entries.push(task.currentEntry);
      task.currentEntry = undefined;
    }
  })

  function toggle() {
    task.active ? pause() : play();
  }

  function pause() {
    setTask(pauseTask);
    onUpdate();
   }

  function play() {
    setTask(playTask);
    onPlay(task);
    onUpdate();

    const timer = setInterval(() => {
      setTask(task => {
        if (task.currentEntry) {
          task.currentEntry.end = Date.now();
        } else {
          clearInterval(timer);
        }
      });
      onUpdate();
    }, 1000);
  }

  function updateField(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const el = e.currentTarget;

    if (!(el instanceof HTMLElement)) return;

    setTask(task => {
      task[el.dataset.name] = el.textContent ?? "";
    })

    el.blur();

    onUpdate();
  }

  function resetField(e: Event) {
    const el = e.currentTarget;

    if (!(el instanceof HTMLElement)) return;

    const name = el?.dataset?.name;

    if (!name) return;

    el.textContent = task[name] ?? "";

    onUpdate();
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
              {formatSeconds(getDurationInS(task))}
            </span>
            <span class={styles.id}>ID: {task.id}</span>
            <button aria-label="Toggle active state" onclick={toggle}>
              {
                task.active
                ? <IconPause />
                : <IconPlay />
              }
            </button>
            <button
              aria-label="Delete task"
              onclick={() => onRemove(task)}
            >
              <IconClose />
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
