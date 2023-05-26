export interface Entry extends RunningEntry {
    start: number
    end: number
}

export interface RunningEntry {
    start: number
}

export function createEntry() : RunningEntry {
    return {
        start: Date.now(),
    }
}

export function endEntry(entry: RunningEntry): Entry {
    return {
        ...entry,
        end: Date.now()
    }
}

export function durationInS(entry: Entry) {
    return (entry.end - entry.start) / 1000;
}