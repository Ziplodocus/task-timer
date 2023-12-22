import { Entry, createEntry, durationInS } from './Entry';
import * as Storage from '../Storage/local';

let id = Storage.get('maxID');

export interface Task {
  id: number;
  name: string;
  currentEntry?: Entry;
  entries: Entry[];
  description?: string;
  active: boolean;
}

export function create(name: string, description?: string): Task {
  id++;
  Storage.set('maxID', id);
  return {
    id: id,
    active: false,
    name: name || 'Task ' + id,
    entries: [],
    description
  };
}

export function pause(task: Task) {
  if (!task.currentEntry) return;
  task.active = false;

  task.currentEntry.end = Date.now();
  task.entries.push(task.currentEntry);
  task.currentEntry = undefined;
}

export function play(task: Task) {
  if (task.currentEntry) return;
  task.active = true;
  task.currentEntry = createEntry();
}

export function clone(task: Task) {
  return { ...task };
}


export function getDurationInS(task: Task) {
  const currentEntryDur = task.currentEntry ? durationInS(task.currentEntry) : 0;
  return task.entries.reduce((a,b) => {
    return a + durationInS(b);
  }, 0) + currentEntryDur;
}