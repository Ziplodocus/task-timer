import { Entry, RunningEntry, createEntry, durationInS, endEntry } from './Entry';
import * as Storage from '../Storage/local';
import { formatSeconds } from '../utilities/timeconversion';

let id = Storage.get('maxID');
export const timers = new Map();

export interface Task {
    id: number;
    name: string;
    currentEntry?: RunningEntry;
    entries: Entry[];
    description?: string;
    duration: number;
    active: boolean;
}

export function create(name: string, description?: string): Task {
    id++;
    Storage.set('maxID', id);
    return {
        id: id,
        active: false,
        name: name || 'Task '+id,
        entries: [],
        duration: 0,
        description
    };
}

export function pause(task: Task) {
    if (!task.currentEntry) return console.log(`${task.name}} is already paused`);
    task.active = false;

    const completedEntry = endEntry(task.currentEntry);
    task.entries.push(completedEntry);
    task.currentEntry = undefined;

    clearInterval(timers.get(task.id));
    timers.delete(task.id);
    task.duration = task.entries.reduce((a, b) => a + durationInS(b), 0);
}

export function play(task: Task) {
    if (task.currentEntry) return console.log(`${task.name} is already started`);
    task.active = true;
    const timer = setInterval(() => {
        task.duration++;
    }, 1000);
    timers.set(task.id, timer);
    task.currentEntry = createEntry();
}

export function clone(task : Task) {
    return { ...task };
}