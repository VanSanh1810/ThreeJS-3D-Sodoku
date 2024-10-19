export function fillTextMultiline(arr) {
    const countFrag = Math.ceil(arr.length / 3);

    if (countFrag === 0) {
        return [];
    }

    let index = 0;

    const result = [];
    for (let i = 0; i < countFrag; i++) {
        const col = [];
        for (let j = 0; j < 3; j++) {
            if (!arr[index]) {
                break;
            }
            col.push(arr[index]);
            index++;
        }
        result.push(col);
    }

    return result;
}
