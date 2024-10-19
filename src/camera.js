import * as THREE from 'three';

export function createCamera(gameWindow) {
    const DEG2RAD = Math.PI / 180;

    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;

    const MIN_CAMERA_RADIUS = 0;
    const MAX_CAMERA_RADIUS = 2000;
    const MIN_CAMERA_ELEVATION = -90;
    const MAX_CAMERA_ELEVATION = 90;
    const ROTATION_SEN = 0.5;
    const ZOOM_SEN = 3;
    const PAN_SEN = 0.01;
    const Y_AXIS = new THREE.Vector3(0, 1, 0);

    const cameraOrigin = new THREE.Vector3(8, 8, 8);
    let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;
    let cameraAzimuth = -45;
    let cameraElevation = 30;
    let isLeftMouseDown = false;
    let isRightMouseDown = false;
    let isMiddleMouseDown = false;
    let preMouseX = 0;
    let preMouseY = 0;

    const camera = new THREE.PerspectiveCamera(2, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 4000);
    camera.layers.set(0);

    updateCameraPosition();

    function onMouseDown(event) {
        if (event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = true;
        }
        // if (event.button === MIDDLE_MOUSE_BUTTON) {
        //     isMiddleMouseDown = true;
        // }
        if (event.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = true;
        }
    }

    function onMouseUp(event) {
        if (event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = false;
        }
        if (event.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = false;
        }
        if (event.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = false;
        }
    }

    function onMouseMove(event) {
        const deltaX = event.clientX - preMouseX;
        const deltaY = event.clientY - preMouseY;

        ///Rotazion
        if (isLeftMouseDown) {
            cameraAzimuth += -deltaX * ROTATION_SEN;
            cameraElevation += deltaY * ROTATION_SEN;
            cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));

            updateCameraPosition();
        }

        //offset
        if (isMiddleMouseDown) {
            const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            cameraOrigin.add(forward.multiplyScalar(-PAN_SEN * deltaY));
            cameraOrigin.add(left.multiplyScalar(-PAN_SEN * deltaX));
            updateCameraPosition();
        }

        //Zoom
        if (isRightMouseDown) {
            event.preventDefault();
            cameraRadius += deltaY * ZOOM_SEN;
            cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
            updateCameraPosition();
        }

        preMouseX = event.clientX;
        preMouseY = event.clientY;
    }

    function updateCameraPosition() {
        camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.add(cameraOrigin);
        camera.lookAt(cameraOrigin);
        camera.updateMatrix();
    }

    function set2DView(cor) {
        //X Y Z
        switch (cor) {
            case 'X':
                cameraAzimuth = -90;
                cameraElevation = 0;
                break;
            case 'Y':
                cameraAzimuth = 0;
                cameraElevation = 90;
                break;
            case 'Z':
                cameraAzimuth = 0;
                cameraElevation = 0;
                break;
            default:
                break;
        }
        updateCameraPosition();
    }

    function set3DView() {
        cameraAzimuth = -45;
        cameraElevation = 30;
        updateCameraPosition();
    }
    return {
        camera,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        set2DView,
        set3DView,
    };
}
