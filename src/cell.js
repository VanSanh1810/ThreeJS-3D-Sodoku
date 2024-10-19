import * as THREE from 'three';
import { findNearestCenter } from './helper/findNearestCenter';

export function createCell(number, cordinate) {
    const DEFAULT_NUMBER_POS = [110, 130];
    const DEFAULT_NUMBER_SCALE = [3.8 * 0.85, 2 * 0.85, 1 * 0.85];
    const DEFAULT_NUMBER_FONT = '150px Roboto';
    const DEFAULT_NUMBER_FILL_STYLE = '#FFFFFF';

    ///
    const CLUE_NUMBER_POS = [110, 130];
    const CLUE_NUMBER_SCALE = [3.8 * 0.3, 2 * 0.3, 1 * 0.3];
    const CLUE_NUMBER_FONT = '150px Roboto';
    const CLUE_NUMBER_FILL_STYLE = '#FFFFFF';
    //
    const VALUE_NUMBER_POS = [110, 130];
    const VALUE_NUMBER_SCALE = [3.8 * 0.7, 2 * 0.7, 1 * 0.7];
    const VALUE_NUMBER_FONT = '150px Roboto';
    const VALUE_NUMBER_FILL_STYLE = '#FFFFFF';
    ///
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
            color: 0xffffff,
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

        plane.visible = false;

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
        //create sprite
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = DEFAULT_NUMBER_FONT;
        context.fillStyle = DEFAULT_NUMBER_FILL_STYLE;
        context.fillText(number || '', DEFAULT_NUMBER_POS[0], DEFAULT_NUMBER_POS[1]);
        //
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(DEFAULT_NUMBER_SCALE[0], DEFAULT_NUMBER_SCALE[1], DEFAULT_NUMBER_SCALE[2]); // Điều chỉnh kích thước sprite cho phù hợp
        sprite.userData = {
            type: 'Sprite',
            number: number === undefined ? undefined : number,
            playerNumber:
                number === undefined
                    ? {
                          clue: [],
                          number: undefined,
                      }
                    : undefined,
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
    function switchView(viewType, selectedCell) {
        // X Y Z 3D None
        // console.log(viewType);
        if (viewType === '3D') {
            cell.visible = true;
            const isHaveNumber = cell.children.some(
                (object) =>
                    object.userData.type === 'Sprite' &&
                    (object.userData.number ||
                        object.userData.playerNumber.number ||
                        object.userData.playerNumber.clue.length > 0),
            );
            if (isHaveNumber) {
                cell.children.forEach((object) => {
                    if (object.userData.type === 'Sprite' || object.userData.type === '3D' || object.type === 'Mesh') {
                        object.visible = true;
                    } else {
                        object.visible = false;
                    }
                });
            } else {
                cell.visible = false;
            }
        } else if (viewType === 'None') {
            cell.visible = false;
        } else {
            // X Y Z
            // console.log(cell);
            cell.visible = true;
            cell.children.forEach((object) => {
                if (object.userData.type === viewType) {
                    object.visible = true; // show outline for viewtype

                    // show selection
                    selectedCell.map((cell_) => {
                        if (cell_.cellId === cell.id) {
                            object.children.forEach((c) => {
                                if (c.userData.type === 'Selection') {
                                    c.visible = true;
                                }
                            });
                        }
                    });
                } else {
                    if (object.userData.type === 'Sprite') {
                        object.visible = true;
                    } else {
                        object.visible = false;
                    }
                }
            });
        }
    }

    /**
     * @param {string} number
     * @param {"clue" | "value"} type
     */
    function setNumber(number, type) {
        if (type === 'clue' || type === 'value') {
            cell.children.forEach((child) => {
                if (child.userData.type === 'Sprite' && child.userData.number === undefined) {
                    if (type === 'clue') {
                        if (!child.userData.playerNumber.number) {
                            const currentClue = [...child.userData.playerNumber.clue];

                            // set obj userData
                            const index = currentClue.indexOf(number);
                            if (index === -1) {
                                currentClue.push(number);
                                currentClue.sort((a, b) => a - b);
                            } else {
                                currentClue.splice(index, 1);
                            }
                            child.userData.playerNumber.clue = [...currentClue];
                            //
                            // set obj attribute
                            const canvas = child.material.map.image;
                            const context = canvas.getContext('2d');

                            // Xóa nội dung cũ trên canvas
                            context.clearRect(0, 0, canvas.width, canvas.height);

                            // Vẽ số mới lên canvas
                            context.font = CLUE_NUMBER_FONT;
                            context.fillStyle = CLUE_NUMBER_FILL_STYLE;
                            context.fillText(currentClue.join(''), CLUE_NUMBER_POS[0], CLUE_NUMBER_POS[1]);

                            // Cập nhật texture của sprite để phản ánh thay đổi
                            child.material.map.needsUpdate = true;

                            child.scale.set(CLUE_NUMBER_SCALE[0], CLUE_NUMBER_SCALE[1], CLUE_NUMBER_SCALE[2]);
                        }
                    } else {
                        // set obj userData
                        child.userData.playerNumber.number = number;
                        // set obj attribute
                        const canvas = child.material.map.image;
                        const context = canvas.getContext('2d');

                        context.clearRect(0, 0, canvas.width, canvas.height);

                        context.font = VALUE_NUMBER_FONT;
                        context.fillStyle = VALUE_NUMBER_FILL_STYLE;
                        context.fillText(number, VALUE_NUMBER_POS[0], VALUE_NUMBER_POS[1]);
                        child.scale.set(VALUE_NUMBER_SCALE[0], VALUE_NUMBER_SCALE[1], VALUE_NUMBER_SCALE[2]);

                        child.material.map.needsUpdate = true;
                    }
                }
            });
        } else {
            throw new Error('Invalid type. Type must be either "clue" or "value".');
        }
    }

    /**
     *
     * @param {"clue" | "value"} type
     */
    function getData(type) {
        if (type === 'clue' || type === 'value') {
        } else {
            throw new Error('Invalid type. Type must be either "clue" or "value".');
        }
    }

    function clearNumber() {
        cell.children.forEach((child) => {
            if (child.userData.type === 'Sprite' && child.userData.playerNumber) {
                if (child.userData.playerNumber.number) {
                    child.userData.playerNumber.number = undefined;
                    //
                    const num = [...child.userData.playerNumber.clue];
                    //
                    const canvas = child.material.map.image;
                    const context = canvas.getContext('2d');

                    context.clearRect(0, 0, canvas.width, canvas.height);

                    context.font = CLUE_NUMBER_FONT;
                    context.fillStyle = CLUE_NUMBER_FILL_STYLE;
                    context.fillText(num.join(''), CLUE_NUMBER_POS[0], CLUE_NUMBER_POS[1]);

                    child.material.map.needsUpdate = true;
                } else {
                    child.userData.playerNumber.clue = [];
                    //
                    const canvas = child.material.map.image;
                    const context = canvas.getContext('2d');

                    context.clearRect(0, 0, canvas.width, canvas.height);

                    context.font = DEFAULT_NUMBER_FONT;
                    context.fillStyle = DEFAULT_NUMBER_FILL_STYLE;
                    context.fillText('', DEFAULT_NUMBER_POS[0], DEFAULT_NUMBER_POS[1]);

                    child.material.map.needsUpdate = true;
                    child.visible = false;
                }
            }
        });
    }

    return {
        cell,
        switchView,
        setNumber,
        clearNumber,
    };
}
