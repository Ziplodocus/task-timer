import { Entry, RunningEntry, createEntry, durationInS, endEntry } from './Entry';
import * as Storage from '../Storage/local';
import { formatSeconds } from '../utilities/timeconversion';

let id = Storage.get('maxID');
let timers = new Map();

export interface Task {
    id: number;
    name: string;
    currentEntry?: RunningEntry;
    entries: Entry[];
    description?: string;
    duration: number;
    active: boolean;
}

export function toggle(task: Task) {
    task.active ? pause(task) : play(task);
}

export function pause(task: Task) {
    if (!task.currentEntry) return console.log(`Task ${task.id} is already paused`);
    task.active = false;
    task.entries.push(endEntry(task.currentEntry));
    task.currentEntry = undefined;
    task.duration = task.entries.reduce((a, b) => a + durationInS(b), 0);
}

export function play(task: Task) {
    if (task.currentEntry) return console.log(`Task ${task.id} is already playing`);
    task.active = true;
    task.currentEntry = createEntry();
}

export function getMinutes(task: Task): string {
    return (task.duration / 60).toFixed(2);
}

export function getFormattedDuration(task: Task) {
    return formatSeconds(task.duration);
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