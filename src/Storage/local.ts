

export function set(key: string, item: any) {
    localStorage.setItem(key, JSON.stringify(item));
}

export function get(key: string): any {
    const value = localStorage.getItem(key);
    if (value === null) return null;
    let obj;
    try {
        obj = JSON.parse(value);
    } catch (e) {
        console.warn('Failed to deserialize saved tasks :(');
        return new Error('Failed to deserialise the stored value: ' + e);
    }
    return obj;
}