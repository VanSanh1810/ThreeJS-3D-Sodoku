import seedrandom from 'seedrandom';

export function shuffleArray(array, seed) {
    for (let i = array.length - 1; i > 0; i--) {
        // Chọn một chỉ số ngẫu nhiên trong khoảng từ 0 đến i
        const j = Math.floor(seedrandom(seed)() * (i + 1));

        // Hoán đổi các phần tử
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
