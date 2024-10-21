import * as THREE from 'three';
import { createCamera } from './camera';
import { createCell } from './cell';
import { create2DBox } from './2dbox';
import { createSodoku } from './sodoku';
import { createAxis } from './axisSlide';

export async function createScene() {
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x111111);

    const camera = createCamera(gameWindow);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
    gameWindow.appendChild(renderer.domElement);

    //
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const mouse = new THREE.Vector2();
    //
    let selectedCell = [];
    //{cellId: string,
    //cordinate
    //}
    //
    // const pointsX = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 0, 0)];
    // const pointsY = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 100, 0)];
    // const pointsZ = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 100)];
    // const materialX = new THREE.LineBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    // const materialY = new THREE.LineBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    // const materialZ = new THREE.LineBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    // const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
    // const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);
    // const geometryZ = new THREE.BufferGeometry().setFromPoints(pointsZ);
    // const lineX = new THREE.Line(geometryX, materialX);
    // const lineY = new THREE.Line(geometryY, materialY);
    // const lineZ = new THREE.Line(geometryZ, materialZ);
    // const box = new THREE.Box3().setFromObject(lineX);
    // const size = new THREE.Vector3();
    // box.getSize(size);
    // console.log('Bounding linex box size:', size);
    //scene.add(...[lineX, lineY, lineZ]);
    // add slider
    const axis = createAxis();
    scene.add(...[axis.axisX, axis.axisY, axis.axisZ]);
    //

    // scene.add(createCell(2, { x: 0, y: 0, z: 0 }).cell);
    // scene.add(createCell(2, { x: 1, y: 0, z: 0 }).cell);
    // scene.add(create2DBox('X').box2d);
    // scene.add(create2DBox('Y').box2d);
    // scene.add(create2DBox('Z').box2d);
    const sodoku = await createSodoku();

    const sodokuObjList = [];

    for (let x = 0; x < 9; x++) {
        const yCol = [];
        for (let y = 0; y < 9; y++) {
            const zCol = [];
            for (let z = 0; z < 9; z++) {
                const cell = createCell(sodoku.sodokuBox[x][y][z].value, sodoku.sodokuBox[x][y][z].cordinate);
                zCol.push(cell);
                scene.add(cell.cell);
            }
            yCol.push(zCol);
        }
        sodokuObjList.push(yCol);
    }

    function draw() {
        renderer.render(scene, camera.camera);
    }

    function start() {
        renderer.setAnimationLoop(draw);
    }

    function stop() {
        renderer.setAnimationLoop(null);
    }

    ////
    function onMouseDown(event) {
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera.camera);

        let intersections = raycaster.intersectObjects(scene.children, true);
        // selecting object
        if (intersections.length > 0 && intersections[0].object && event.button === 0) {
            if (!event.ctrlKey) {
                const AXIS_NAME = ['X', 'Y', 'Z'];
                selectedCell.forEach((item) => {
                    const cellRef = scene.getObjectById(item.cellId);

                    cellRef.children.forEach((group) => {
                        if (group.userData?.type && AXIS_NAME.indexOf(group.userData.type) !== -1) {
                            group.children.map((o) => {
                                if (o.userData.type === 'Selection') {
                                    console.log(o);
                                    o.visible = false;
                                }
                            });
                        }
                    });
                });
                selectedCell = [];
            }
            // box select
            const axisData = axis.getAxisData();
            if (axisData.currentAxisSelected) {
                for (let i = 0; i < intersections.length; i++) {
                    let flag = false;
                    const obj = intersections[i].object;
                    if (obj.userData.cellId) {
                        //console.log(obj);
                        switch (axisData.currentAxisSelected) {
                            case 'X':
                                if (obj.userData.data?.cordinate?.x === axisData.corTrackX) {
                                    obj.parent.children.some((o) => {
                                        if (o.userData.type === 'X') {
                                            o.children.some((t) => {
                                                if (
                                                    t.userData.type === 'Selection' &&
                                                    !selectedCell.some((c) => c.cellId === obj.userData.cellId)
                                                ) {
                                                    t.visible = true;
                                                    selectedCell.push({
                                                        cellId: obj.userData.cellId,
                                                        cordinate: obj.userData.data.cordinate,
                                                    });
                                                    return true;
                                                }
                                            });
                                            return true;
                                        }
                                    });
                                    flag = true;
                                }
                                break;
                            case 'Y':
                                if (obj.userData.data?.cordinate?.y === axisData.corTrackY) {
                                    obj.parent.children.some((o) => {
                                        if (o.userData.type === 'Y') {
                                            o.children.some((t) => {
                                                if (
                                                    t.userData.type === 'Selection' &&
                                                    !selectedCell.some((c) => c.cellId === obj.userData.cellId)
                                                ) {
                                                    t.visible = true;
                                                    selectedCell.push({
                                                        cellId: obj.userData.cellId,
                                                        cordinate: obj.userData.data.cordinate,
                                                    });
                                                    return true;
                                                }
                                            });
                                            return true;
                                        }
                                    });
                                    flag = true;
                                }
                                break;
                            case 'Z':
                                if (obj.userData.data?.cordinate?.z === axisData.corTrackZ) {
                                    obj.parent.children.some((o) => {
                                        if (o.userData.type === 'Z') {
                                            o.children.some((t) => {
                                                if (
                                                    t.userData.type === 'Selection' &&
                                                    !selectedCell.some((c) => c.cellId === obj.userData.cellId)
                                                ) {
                                                    t.visible = true;
                                                    selectedCell.push({
                                                        cellId: obj.userData.cellId,
                                                        cordinate: obj.userData.data.cordinate,
                                                    });
                                                    return true;
                                                }
                                            });
                                            return true;
                                        }
                                    });
                                    flag = true;
                                }
                                break;
                        }
                    }
                    if (flag) {
                        break;
                    }
                }
            }
            if (intersections[0].object.userData.cellId) {
                console.log(intersections[0].object.userData.data.cordinate);
                console.log(intersections[0].object.userData.cellId);
            }
        } else {
            // select nothing
            camera.onMouseDown(event);
        }
        ///
    }

    function onMouseUp(event) {
        camera.onMouseUp(event);
    }

    function onMouseMove(event) {
        camera.onMouseMove(event);

        //
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera.camera);

        let intersections = raycaster.intersectObjects(scene.children, true);
        if (intersections.length > 0) {
            // Nếu trúng object, thay đổi con trỏ thành 'pointer'
            document.body.style.cursor = 'pointer';
        } else {
            // Không trúng object nào, trả con trỏ về mặc định
            document.body.style.cursor = 'default';
        }
        //
    }

    //game update view
    function gameUpdateAxis() {
        const axisData = axis.getAxisData();
        // console.log(axisData);
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                for (let z = 0; z < 9; z++) {
                    switch (axisData.currentAxisSelected) {
                        case 'X':
                            if (x === axisData.corTrackX) {
                                sodokuObjList[x][y][z].switchView(axisData.currentAxisSelected, selectedCell);
                            } else {
                                sodokuObjList[x][y][z].switchView('None');
                            }
                            break;
                        case 'Y':
                            if (y === axisData.corTrackY) {
                                sodokuObjList[x][y][z].switchView(axisData.currentAxisSelected, selectedCell);
                            } else {
                                sodokuObjList[x][y][z].switchView('None');
                            }
                            break;
                        case 'Z':
                            if (z === axisData.corTrackZ) {
                                sodokuObjList[x][y][z].switchView(axisData.currentAxisSelected, selectedCell);
                            } else {
                                sodokuObjList[x][y][z].switchView('None');
                            }
                            break;
                        case undefined:
                            sodokuObjList[x][y][z].switchView('3D');
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    //controll slider
    function onKeyPress(event) {
        console.log(event.key);
        axis.slideAction(event.key.toLowerCase(), gameUpdateAxis);

        try {
            const number = parseInt(event.key);
            if (number === 0 || isNaN(number)) {
                return;
            }
            selectedCell.forEach((cell_) => {
                sodokuObjList[cell_.cordinate.x][cell_.cordinate.y][cell_.cordinate.z].setNumber(
                    number,
                    false ? 'value' : 'clue',
                );
                if (false && sodoku.sodokuBox[cell_.cordinate.x][cell_.cordinate.x][cell_.cordinate.x].value === undefined) {
                    // add only value
                    sodoku.sodokuBox[cell_.cordinate.x][cell_.cordinate.x][cell_.cordinate.x].userValue = number;
                }
            });
        } catch (e) {
            return;
        }
    }

    function onKeyDown(event) {
        console.log(event);
    }

    function onKeyUp(event) {
        // console.log(event.altKey);
    }

    function switchTo3D() {
        const curAxis = axis.getAxisData();
        if (curAxis.currentAxisSelected) {
            axis.resetCurrentSelect(gameUpdateAxis);
        }
        camera.set3DView();
    }

    function switchTo2D() {
        const curAxis = axis.getAxisData();
        if (curAxis.currentAxisSelected) {
            camera.set2DView(curAxis.currentAxisSelected);
        }
    }

    function clearCell() {
        const axisData = axis.getAxisData();
        if (selectedCell.length > 0 && axisData.currentAxisSelected) {
            selectedCell.forEach((_cell) => {
                sodokuObjList[_cell.cordinate.x][_cell.cordinate.y][_cell.cordinate.z].clearNumber();
                if (sodoku.sodokuBox[_cell.cordinate.x][_cell.cordinate.x][_cell.cordinate.x].value === undefined) {
                    // add only value
                    sodoku.sodokuBox[_cell.cordinate.x][_cell.cordinate.x][_cell.cordinate.x].userValue = undefined;
                }
            });
        }
    }

    return {
        start,
        stop,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onKeyPress,
        switchTo3D,
        switchTo2D,
        onKeyDown,
        onKeyUp,
        clearCell,
    };
}
