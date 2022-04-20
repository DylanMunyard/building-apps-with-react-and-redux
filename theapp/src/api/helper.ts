export const DisplayBytes = (bytes: number): string => {

    if (bytes >= Kilobytes && bytes < Megabytes) {
        return `${(bytes / Kilobytes).toFixed(2)} kB`;
    }

    if (bytes >= Megabytes && bytes < Gigabytes) {
        return `${(bytes / Megabytes).toFixed(2)} MiB`;
    }

    if (bytes >= Gigabytes) {
        return `${(bytes / Gigabytes).toFixed(2)} GiB`;
    }

    return `${bytes.toString()} B`;
}

const Kilobytes = 1024;
const Megabytes = 1024 * Kilobytes;
const Gigabytes = 1024 * Megabytes;