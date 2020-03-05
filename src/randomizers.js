export default function getRandomIntInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomIntInRangeExclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomFloatInRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function probability(n) {
    return n > 0 && Math.random() <= n;
}
