import { Component, For } from "solid-js";
import { createStore } from "solid-js/store";
import * as Storage from "../../Storage/local";
import { durationInS } from "../../Structs/Entry";
import { Task } from "../../Structs/Task";
import { formatSeconds } from "../../utilities/timeconversion";
import styles from "./index.module.scss";

import { range } from "../../utilities/range";

const Calendar: Component = () => {
  const list = Storage.get("tasks") ?? [create("Hehe")];
  const [tasks, setTasks] = createStore<Task[]>(list);

  const TimeFrame = {
    start: 0,
    steps: 24,
    stepRange: 3600,
    range() {
      return this.steps * this.stepRange;
    }
  }

  function getStartPosition(startTimeUnix: number) {
    const startSecondInDay = startTimeUnix % (3600 * 24);
    const startPercent = startSecondInDay / TimeFrame.range() * 100;
    return startPercent;
  };

  function getPercentageDuration(durationInSeconds: number) {
    return durationInSeconds / TimeFrame.range() * 100;
  }

  return (
    <section class={styles.calendar}>
      <div class={styles.hours}>
        {
          range(TimeFrame.steps).map(i => {
            const formattedTime = formatSeconds(TimeFrame.start + TimeFrame.stepRange * i);
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
                    <li class={styles.entry} style={{
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
    </section>

  )
}

export default Calendar;