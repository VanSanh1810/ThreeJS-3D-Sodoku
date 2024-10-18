import * as THREE from 'three';

export function createAxis() {
    const HANDLE_SIZE = 0.5;
    const OFFSET = 2;

    //Button controller
    const X_INCREASE = 'w';
    const X_DECREASE = 'q';
    const Y_INCREASE = 's';
    const Y_DECREASE = 'a';
    const Z_INCREASE = 'x';
    const Z_DECREASE = 'z';
    // Track cordinate
    const X_TRACK = [
        [0, 16, -OFFSET],
        [16, 16, -OFFSET],
    ];
    const Y_TRACK = [
        [-OFFSET, 0, -OFFSET],
        [-OFFSET, 16, -OFFSET],
    ];
    const Z_TRACK = [
        [-OFFSET, -OFFSET, 0],
        [-OFFSET, -OFFSET, 16],
    ];
    // Current pos each track
    let corTrackX = 0;
    let corTrackY = 0;
    let corTrackZ = 0;
    // current axis select
    let currentAxisSelected = undefined;
    //

    function getAxisData() {
        return {
            corTrackX,
            corTrackY,
            corTrackZ,
            currentAxisSelected,
        };
    }

    const axisX = createAxisX();
    const axisY = createAxisY();
    const axisZ = createAxisZ();

    function createAxisX() {
        const slider = new THREE.Group();
        //
        const geometryHandle = new THREE.BoxGeometry(HANDLE_SIZE, HANDLE_SIZE, HANDLE_SIZE);
        const materialHandle = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const handle = new THREE.Mesh(geometryHandle, materialHandle);

        handle.position.x = X_TRACK[0][0];
        handle.position.y = X_TRACK[0][1];
        handle.position.z = X_TRACK[0][2];

        const points = [new THREE.Vector3(...X_TRACK[0]), new THREE.Vector3(...X_TRACK[1])];
        const materialTrack = new THREE.LineBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const geometryTrack = new THREE.BufferGeometry().setFromPoints([...points]);
        const track = new THREE.Line(geometryTrack, materialTrack);

        slider.add(...[track, handle]);

        return slider;
    }

    function createAxisY() {
        const slider = new THREE.Group();
        //
        const geometryHandle = new THREE.BoxGeometry(HANDLE_SIZE, HANDLE_SIZE, HANDLE_SIZE);
        const materialHandle = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const handle = new THREE.Mesh(geometryHandle, materialHandle);

        handle.position.x = Y_TRACK[0][0];
        handle.position.y = Y_TRACK[0][1];
        handle.position.z = Y_TRACK[0][2];

        const points = [new THREE.Vector3(...Y_TRACK[0]), new THREE.Vector3(...Y_TRACK[1])];
        const materialTrack = new THREE.LineBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const geometryTrack = new THREE.BufferGeometry().setFromPoints([...points]);
        const track = new THREE.Line(geometryTrack, materialTrack);

        slider.add(...[track, handle]);

        return slider;
    }

    function createAxisZ() {
        const slider = new THREE.Group();
        //
        const geometryHandle = new THREE.BoxGeometry(HANDLE_SIZE, HANDLE_SIZE, HANDLE_SIZE);
        const materialHandle = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const handle = new THREE.Mesh(geometryHandle, materialHandle);

        handle.position.x = Z_TRACK[0][0];
        handle.position.y = Z_TRACK[0][1];
        handle.position.z = Z_TRACK[0][2];

        const points = [new THREE.Vector3(...Z_TRACK[0]), new THREE.Vector3(...Z_TRACK[1])];
        const materialTrack = new THREE.LineBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const geometryTrack = new THREE.BufferGeometry().setFromPoints([...points]);
        const track = new THREE.Line(geometryTrack, materialTrack);

        slider.add(...[track, handle]);

        return slider;
    }

    function slideAction(key, updateGameAxis) {
        // q w : X
        // a s : Y
        // z x : Z
        // console.log(key);
        if (key === X_INCREASE || key === X_DECREASE) {
            axisX.children.forEach((child) => {
                if (child.type === 'Mesh') {
                    if (key === X_INCREASE) {
                        if (child.position.x + 2 <= X_TRACK[1][0]) {
                            child.position.x += 2;
                            corTrackX = corTrackX + 1;
                        }
                    } else {
                        if (child.position.x - 2 >= X_TRACK[0][0]) {
                            corTrackX = corTrackX - 1;
                            child.position.x -= 2;
                        }
                    }
                    currentAxisSelected = 'X';
                }
            });
        } else if (key === Y_INCREASE || key === Y_DECREASE) {
            axisY.children.forEach((child) => {
                if (child.type === 'Mesh') {
                    if (key === Y_INCREASE) {
                        if (child.position.y + 2 <= Y_TRACK[1][1]) {
                            child.position.y += 2;
                            corTrackY = corTrackY + 1;
                        }
                    } else {
                        if (child.position.y - 2 >= Y_TRACK[0][1]) {
                            corTrackY = corTrackY - 1;
                            child.position.y -= 2;
                        }
                    }
                    currentAxisSelected = 'Y';
                }
            });
        } else if (key === Z_INCREASE || key === Z_DECREASE) {
            axisZ.children.forEach((child) => {
                if (child.type === 'Mesh') {
                    if (key === Z_INCREASE) {
                        if (child.position.z + 2 <= Z_TRACK[1][2]) {
                            child.position.z += 2;
                            corTrackZ = corTrackZ + 1;
                        }
                    } else {
                        if (child.position.z - 2 >= Z_TRACK[0][2]) {
                            corTrackZ = corTrackZ - 1;
                            child.position.z -= 2;
                        }
                    }
                    currentAxisSelected = 'Z';
                }
            });
        }

        updateGameAxis();
    }

    function resetCurrentSelect(updateGameAxis) {
        currentAxisSelected = undefined;
        updateGameAxis();
    }

    return {
        axisX,
        axisY,
        axisZ,
        getAxisData,
        resetCurrentSelect,
        slideAction,
    };
}
