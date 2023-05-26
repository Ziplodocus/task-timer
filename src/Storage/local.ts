

export function set(key: string, item: any) {
    localStorage.setItem(key, JSON.stringify(item));
}

export function get(key: string): any {
    const value = localStorage.getItem(key);
    if (value === null) return null;
    return JSON.parse(value);
}