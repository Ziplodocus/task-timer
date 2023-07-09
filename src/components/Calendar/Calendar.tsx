import { Component, createSignal, For, Index, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import * as Storage from "../../Storage/local";
import { durationInS } from "../../Structs/Entry";
import { Task } from "../../Structs/Task";
import { formatSeconds } from "../../utilities/timeconversion";
import styles from "./index.module.scss";

import { range } from "../../utilities/range";

const Calendar: Component = () => {
  const list = Storage.get("tasks") ?? [create("Hehe")];
  const savedRangeStart = Storage.get('viewRangeStart');
  const savedRangeEnd = Storage.get('viewRangeEnd');

  const [tasks, setTasks] = createStore<Task[]>(list);

  const stepRange = 3600;
  const [getRangeStart, setRangeStart] = createSignal(savedRangeStart || 0);
  const [getRangeEnd, setRangeEnd] = createSignal(savedRangeEnd || 24);
  
  const getRangeSteps = () => {
    return (getRangeEnd() - getRangeStart());
  }

  const getRangeInSeconds = () => {
    return getRangeSteps() * stepRange;
  }

  function getStartPosition(startTimeUnix: number) {
    const taskDate = new Date(startTimeUnix);
    const startOfDay = new Date(taskDate.getUTCFullYear(), taskDate.getUTCMonth(), taskDate.getUTCDate());
    const startSecondInDay = (taskDate.valueOf() - startOfDay.valueOf()) / 1000;
    const startSecondInRange = startSecondInDay - getRangeStart() * 3600;
    const startPercent = startSecondInRange / getRangeInSeconds() * 100;
    return startPercent;
  };

  function getPercentageDuration(durationInSeconds: number) {
    return durationInSeconds / getRangeInSeconds() * 100;
  }

  const onRangeUpdate = (e: InputEvent) => {
    const input = e.currentTarget;
    const name = input.name;
    switch (name) {
      case 'min-time':
        setRangeStart(parseInt(input.value));
        break;
      case 'max-time':
        setRangeEnd(parseInt(input.value));
        break;
    }    
    Storage.set('viewRangeStart', getRangeStart());
    Storage.set('viewRangeEnd', getRangeEnd());
   }

  return (

    <section class={`${styles.calendar} dimensional`}>
      <header class={styles.header}>
        <h2>View</h2>
        <div class="buttons">
          <label>Time Start <input name="min-time" type="number" min="0" max="23" value={getRangeStart()} oninput={onRangeUpdate} size="2" /></label>
          <label>Time End <input name="max-time" type="number" min="1" max="24" value={getRangeEnd()} oninput={onRangeUpdate} size="2" /></label>
        </div>
      </header>

      <div class={styles.main}>
        <div class={styles.hours}>
          {
            range(getRangeSteps() + 1).map(i => {
              const formattedTime = (getRangeStart() + i) % 24 + ':00';
              return (
                <div class={styles.hour} >{formattedTime}</div>
              )
            })
          }
        </div>

        <ul class={styles.tasks}>
          <For each={tasks}>
            {task => {
              return (
                <For each={task.entries}>
                  {entry => {
                    return (
                      <li class={`${styles.entry} dimensional`} style={{
                        "top": `${getStartPosition(entry.start)}%`,
                        "height": `${getPercentageDuration(durationInS(entry))}%`
                      }}>
                        <span class={styles.entryName}>{task.name}</span>
                        <span class={styles.entryDuration}>{formatSeconds(durationInS(entry))}</span>
                      </li>
                    )
                  }}
                </For>
              )
            }}
          </For>
        </ul>
      </div>
    </section>
  )
}

export default Calendar;