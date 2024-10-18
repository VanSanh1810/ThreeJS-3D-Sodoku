import * as THREE from 'three';

export function create2DBox(orientation, number, cordinate) {
    const cubeWidth = 1;
    const box2d = createCube(orientation, number, cordinate);

    function createCube(orientation, number, cordinate) {
        let vertices = [];
        switch (orientation) {
            case 'X':
                vertices = [
                    [0, 1, 1],
                    [0, 1, -1],
                    [0, -1, -1],
                    [0, -1, 1],
                ];
                break;
            case 'Y':
                vertices = [
                    [1, 0, 1],
                    [1, 0, -1],
                    [-1, 0, -1],
                    [-1, 0, 1],
                ];
                break;
            case 'Z':
                vertices = [
                    [1, 1, 0],
                    [1, -1, 0],
                    [-1, -1, 0],
                    [-1, 1, 0],
                ];
                break;
        }

        const edges = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
        ];

        const cube = new THREE.Group();

        edges.forEach((edge) => {
            const [start, end] = edge;

            const points = [new THREE.Vector3(...vertices[start]), new THREE.Vector3(...vertices[end])];
            const material = new THREE.LineBasicMaterial({
                color: orientation === 'X' ? 0xff0000 : orientation === 'Y' ? 0x00ff00 : 0x0000ff, // red green blue
            });
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            cube.add(line);
        });

        //Tạo một sprite để hiển thị số
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = '150px Roboto';
        context.fillStyle = 'white';
        context.fillText(number, 110, 130);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(3.8, 2, 1); // Điều chỉnh kích thước sprite cho phù hợp
        //Raycast cube
        const geometry = new THREE.BoxGeometry(cubeWidth * 2, cubeWidth * 2, cubeWidth * 2);
        const material = new THREE.MeshBasicMaterial({ transparent: false, opacity: 0 }); // Vô hình
        const cubeRaycast = new THREE.Mesh(geometry, material);

        cubeRaycast.userData = {
            cellId: cube.id,
            data: {
                cordinate,
            },
        };

        cube.add(sprite); // Thêm sprite vào giữa khối lập phương

        cube.position.x = cordinate.x * 2;
        cube.position.y = cordinate.y * 2;
        cube.position.z = cordinate.z * 2;

        return cube;
    }

    return {
        box2d: box2d,
    };
}
