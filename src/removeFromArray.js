export default function removeFromArray(item, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === item) {
            array.splice(i, 1);
        }
    }
};

