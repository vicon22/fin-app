const divider = 100;

export function getInteger(input: number) {
    return Math.floor(input / divider)
}

export function getFraction(input: number) {
    const int = getInteger(input);

    return input - (int * divider);
}

export function combineParts(integer: number, fraction: number) {
    return (integer * divider) + fraction;
}