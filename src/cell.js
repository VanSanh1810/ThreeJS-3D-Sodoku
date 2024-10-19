import * as THREE from 'three';
import { findNearestCenter } from './helper/findNearestCenter';

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
        function setLineWidth(cor1, cor2, center) {
            const _dif1 = cor1 - center[0];
            const _dif2 = cor2 - center[1];

            const boldSideTable = [
                [[1, 2], [1], [0, 1]],
                [[2], [], [0]],
                [[3, 2], [3], [0, 3]],
            ];

            return boldSideTable[_dif2 + 1][_dif1 + 1];
        }
        let boldEdge = [];
        let centerCor = [];
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
                centerCor = findNearestCenter(cordinate.y, cordinate.z);
                boldEdge = setLineWidth(cordinate.y, cordinate.z, centerCor);
                break;
            case 'Y':
                vertices = [
                    [1, 0, 1],
                    [1, 0, -1],
                    [-1, 0, -1],
                    [-1, 0, 1],
                ];
                centerCor = findNearestCenter(cordinate.x, cordinate.z);
                boldEdge = setLineWidth(cordinate.x, cordinate.z, centerCor);
                break;
            case 'Z':
                vertices = [
                    [1, 1, 0],
                    [1, -1, 0],
                    [-1, -1, 0],
                    [-1, 1, 0],
                ];
                centerCor = findNearestCenter(cordinate.x, cordinate.y);
                boldEdge = setLineWidth(cordinate.x, cordinate.y, centerCor);
                break;
        }

        const edges = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
        ];

        const cube = new THREE.Group();

        edges.forEach((edge, i) => {
            const [start, end] = edge;

            const points = [new THREE.Vector3(...vertices[start]), new THREE.Vector3(...vertices[end])];
            const material = new THREE.LineBasicMaterial({
                color: orientation === 'X' ? 0x440000 : orientation === 'Y' ? 0x004400 : 0x000044, // red green blue
                // color: 0,
            });
            if (boldEdge.indexOf(i) !== -1) {
                material.color.set(orientation === 'X' ? 0xff0000 : orientation === 'Y' ? 0x00ff00 : 0x0000ff);
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            cube.add(line);
        });

        cube.userData = {
            type: orientation,
        };

        //plane
        const geometryPlane = new THREE.PlaneGeometry(2, 2);
        const materialPlane = new THREE.MeshBasicMaterial({
            color: 0x777777,
            side: THREE.DoubleSide,
            opacity: 0.2,
            transparent: true,
            depthTest: false,
        });
        const plane = new THREE.Mesh(geometryPlane, materialPlane);
        plane.userData = {
            type: 'Selection',
        };
        cube.add(plane);

        switch (orientation) {
            case 'X':
                plane.rotation.y = Math.PI / 2;
                break;
            case 'Y':
                plane.rotation.x = Math.PI / 2;
                break;
            case 'Z':
                break;
        }

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
