export function findNearestCenter(x, y) {
    const rowCenter = Math.floor(x / 3) * 3 + 1;
    const colCenter = Math.floor(y / 3) * 3 + 1;

    if (x === rowCenter && y === colCenter) {
        return [x, y];
    }

    // Trả về tọa độ trung tâm gần nhất
    return [rowCenter, colCenter];
}
