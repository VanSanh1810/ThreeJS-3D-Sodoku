import { createScene } from './src/scene';
import './style.css';

window.onload = async () => {
    const scene = await createScene();
    document.addEventListener('mousedown', scene.onMouseDown, false);
    document.addEventListener('mouseup', scene.onMouseUp, false);
    document.addEventListener('mousemove', scene.onMouseMove, false);
    document.addEventListener('keypress', scene.onKeyPress, false);
    document.addEventListener('keydown', scene.onKeyDown, false);
    document.addEventListener('keyup', scene.onKeyUp, false);

    document.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Ngăn hành vi mặc định của context menu
    });
    scene.start();

    const view3DButton = document.getElementById('btn3D');
    const view2DButton = document.getElementById('btn2D');
    const clearCellButton = document.getElementById('btnClear');
    view3DButton.addEventListener('click', scene.switchTo3D, false);
    view2DButton.addEventListener('click', scene.switchTo2D, false);
    clearCellButton.addEventListener('click', scene.clearCell, false);
};
