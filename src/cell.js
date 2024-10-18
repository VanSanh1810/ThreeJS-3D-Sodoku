import * as THREE from 'three';

export function createCell(number, cordinate) {
    const cubeWidth = 0.7;

    const CUBE_3D_WIDTH = 0.7;
    const SQUARE_2D_WIDTH = 1;

    const cell = createNumberedCube(number);

    //Create 3D frame
    function create3dFrameGroup() {
        const vertices = [
            [-cubeWidth, -cubeWidth, -cubeWidth],
            [cubeWidth, -cubeWidth, -cubeWidth],
            [cubeWidth, cubeWidth, -cubeWidth],
            [-cubeWidth, cubeWidth, -cubeWidth],
            [-cubeWidth, -cubeWidth, cubeWidth],
            [cubeWidth, -cubeWidth, cubeWidth],
            [cubeWidth, cubeWidth, cubeWidth],
            [-cubeWidth, cubeWidth, cubeWidth],
        ];

        const edges = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4],
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],
        ];

        const cube = new THREE.Group();

        edges.forEach((edge) => {
            const [start, end] = edge;

            const points = [new THREE.Vector3(...vertices[start]), new THREE.Vector3(...vertices[end])];
            const material = new THREE.LineBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
            const geometry = new THREE.BufferGeometry().setFromPoints([...points]);
            const line = new THREE.Line(geometry, material);

            cube.add(line);
        });

        cube.userData = {
            type: '3D',
        };

        return cube;
    }

    function create2dFrameGroup(orientation) {
        //Create 2d frame by orientation
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

        cube.userData = {
            type: orientation,
        };

        return cube;
    }

    function createSprite(number) {
        //Tạo một sprite để hiển thị số
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = '150px Roboto';
        context.fillStyle = 'white';
        context.fillText(number || '', 110, 130);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(3.8, 2, 1); // Điều chỉnh kích thước sprite cho phù hợp

        sprite.userData = {
            type: 'Sprite',
            number: number || '',
        };

        return sprite;
    }

    // Tạo khối lập phương và thêm số ở giữa
    function createNumberedCube(number) {
        const cell = new THREE.Group();
        const frame3d = create3dFrameGroup();

        const frame2d_X = create2dFrameGroup('X');
        const frame2d_Y = create2dFrameGroup('Y');
        const frame2d_Z = create2dFrameGroup('Z');

        const sprite = createSprite(number);

        frame2d_X.visible = false;
        frame2d_Y.visible = false;
        frame2d_Z.visible = false;

        if (!number) {
            sprite.visible = false;
            frame3d.visible = false;
        }
        cell.add(...[frame2d_X, frame2d_Y, frame2d_Z, sprite, frame3d]);

        cell.position.x = cordinate.x * 2;
        cell.position.y = cordinate.y * 2;
        cell.position.z = cordinate.z * 2;
        //Raycast cube
        const geometry = new THREE.BoxGeometry(cubeWidth * 2, cubeWidth * 2, cubeWidth * 2);
        const material = new THREE.MeshBasicMaterial({ transparent: false, opacity: 0 }); // Vô hình
        const cubeRaycast = new THREE.Mesh(geometry, material);

        cubeRaycast.userData = {
            cellId: cell.id,
            data: {
                cordinate,
            },
        };
        cell.layers.set(0);
        cubeRaycast.layers.set(1);
        cell.add(cubeRaycast);
        return cell;
    }

    // Switch view
    function switchView(viewType) {
        // X Y Z 3D None
        cell.children.forEach((object, i) => {
            switch (viewType) {
                case 'X':
                    if (object.userData.type === 'X') {
                        object.visible = true;
                    } else {
                        if (object.userData.type === 'Sprite' && object.userData.number) {
                            object.visible = true;
                        } else {
                            object.visible = false;
                        }
                    }
                    break;
                case 'Y':
                    if (object.userData.type === 'Y' && object.type === 'Group') {
                        object.visible = true;
                    } else {
                        if (object.userData.type === 'Sprite' && object.userData.number) {
                            object.visible = true;
                        } else {
                            object.visible = false;
                        }
                    }
                    break;
                case 'Z':
                    if (object.userData.type === 'Z') {
                        object.visible = true;
                    } else {
                        if (object.userData.type === 'Sprite' && object.userData.number) {
                            object.visible = true;
                        } else {
                            object.visible = false;
                        }
                    }
                    break;
                case '3D':
                    //fix hear
                    if (object.userData.type === '3D') {
                        object.visible = true;
                    } else {
                        if (object.userData.type === 'Sprite' && object.userData.number) {
                            object.visible = true;
                        } else {
                            object.visible = false;
                        }
                    }
                    break;
                case 'None':
                    object.visible = false;
                    break;
                default:
                    break;
            }
        });
        // cell.updateMatrix();
    }

    return {
        cell,
        switchView,
    };
}
