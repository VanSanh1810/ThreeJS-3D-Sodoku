import * as THREE from 'three';
import { createCamera } from './camera';
import { createCell } from './cell';
import { create2DBox } from './2dbox';
import { createSodoku } from './sodoku';
import { createAxis } from './axisSlide';

export function createScene() {
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
    let selectedObj = undefined;
    //
    const pointsX = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 0, 0)];
    const pointsY = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 100, 0)];
    const pointsZ = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 100)];
    const materialX = new THREE.LineBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const materialY = new THREE.LineBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const materialZ = new THREE.LineBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
    const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);
    const geometryZ = new THREE.BufferGeometry().setFromPoints(pointsZ);
    const lineX = new THREE.Line(geometryX, materialX);
    const lineY = new THREE.Line(geometryY, materialY);
    const lineZ = new THREE.Line(geometryZ, materialZ);
    const box = new THREE.Box3().setFromObject(lineX);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log('Bounding linex box size:', size);
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
    const sodoku = createSodoku();

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
        if (intersections.length > 0 && intersections[0].object) {
            // box select
            if (intersections[0].object.userData.cellId) {
                console.log(intersections[0].object.userData.data.cordinate);
                console.log(intersections[0].object.userData.cellId);
                // const detectedId = intersections[0].object.userData.cellId;
                // if (selectedObj) {
                //     scene.getObjectById(selectedObj).children.forEach((child) => {
                //         if (child.type === 'Line') {
                //             child.material.color.set(0x555555);
                //         } else {
                //             child.material.color.set(0xffffff);
                //         }
                //     });
                // }
                // console.log(scene.getObjectById(detectedId));
                // selectedObj = detectedId;
                // scene.getObjectById(selectedObj).children.forEach((child) => {
                //     child.material.color.set(0xff0000);
                // });
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
        console.log(axisData);
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                for (let z = 0; z < 9; z++) {
                    // console.log(sodokuObjList[x][y][z].cell);
                    // console.log(axis.getAxisData().currentAxisSelected);
                    // console.log(axis.getAxisData().corTrackX);
                    // console.log(axis.getAxisData().corTrackY);
                    // console.log(axis.getAxisData().corTrackZ);
                    switch (axisData.currentAxisSelected) {
                        case 'X':
                            if (x === axisData.corTrackX) {
                                sodokuObjList[x][y][z].switchView(axisData.currentAxisSelected);
                            } else {
                                sodokuObjList[x][y][z].switchView('None');
                            }
                            break;
                        case 'Y':
                            if (y === axisData.corTrackY) {
                                sodokuObjList[x][y][z].switchView(axisData.currentAxisSelected);
                            } else {
                                sodokuObjList[x][y][z].switchView('None');
                            }
                            break;
                        case 'Z':
                            if (z === axisData.corTrackZ) {
                                sodokuObjList[x][y][z].switchView(axisData.currentAxisSelected);
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
        // console.log(event.key);
        axis.slideAction(event.key.toLowerCase(), gameUpdateAxis);

        // gameUpdateAxis();
    }

    //game update view
    function gameUpdateNumber() {}

    return {
        start,
        stop,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onKeyPress,
    };
}