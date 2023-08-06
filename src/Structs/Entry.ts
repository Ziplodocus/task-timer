export interface Entry {
    start: number
    end: number
}

export function createEntry() : Entry {
    return {
        start: Date.now(),
        end: Date.now(),
    }
}

export function durationInS(entry: Entry) {
    return (entry.end - entry.start) / 1000;
}