import { createScene } from './src/scene';
import './style.css';

window.onload = () => {
    const scene = createScene();
    document.addEventListener('mousedown', scene.onMouseDown, false);
    document.addEventListener('mouseup', scene.onMouseUp, false);
    document.addEventListener('mousemove', scene.onMouseMove, false);
    document.addEventListener('keypress', scene.onKeyPress, false);

    document.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Ngăn hành vi mặc định của context menu
    });
    scene.start();
};
