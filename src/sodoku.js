import * as THREE from 'three';
import { shuffleArray } from './helper/shuffleArray';
import { findNearestCenter } from './helper/findNearestCenter';

export async function createSodoku() {
    const sodokuBox = [];
    const stack = [];

    // generate the empty grid
    for (let x = 0; x < 9; x++) {
        const yCol = [];
        for (let y = 0; y < 9; y++) {
            const zCol = [];
            for (let z = 0; z < 9; z++) {
                const shuffleNumber = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9], '123');
                //const shuffleNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                zCol.push({
                    cordinate: {
                        x,
                        y,
                        z,
                    },
                    value: undefined, // fixed value
                    userValue: undefined,
                });
                stack.push({
                    cordinate: {
                        x,
                        y,
                        z,
                    },
                    value: undefined,
                    arrNumSelect: [...shuffleNumber],
                    indexArrNumSelect: 0,
                });
            }
            yCol.push([...zCol]);
        }
        sodokuBox.push(yCol);
    }

    function nona2Deca(x, y, z) {
        const deca = x * 9 ** 2 + y * 9 ** 1 + z * 9 ** 0;
        return deca;
    }

    function validateCell(cordinate, number) {
        /*X plane (lock X)*/
        //compare by Y (lock Z)
        for (let y = 0; y < 9; y++) {
            if (y !== cordinate.y) {
                // console.log(nona2Deca(cordinate.x, y, cordinate.z));
                const cpVal = stack[nona2Deca(cordinate.x, y, cordinate.z)].value;
                if (cpVal === number) {
                    return false; // validate fail
                }
            }
        }
        //compare by Z (lock Y)
        for (let z = 0; z < 9; z++) {
            if (z !== cordinate.z) {
                const cpVal = stack[nona2Deca(cordinate.x, cordinate.y, z)].value;
                if (cpVal === number) {
                    return false; // validate fail
                }
            }
        }
        //compare by region
        const centerX = findNearestCenter(cordinate.y, cordinate.z);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (centerX[0] + i !== cordinate.y || centerX[0] + j !== cordinate.z) {
                    const cpVal = stack[nona2Deca(cordinate.x, centerX[0] + i, centerX[1] + j)].value;
                    if (cpVal === number) {
                        return false; // validate fail
                    }
                }
            }
        }
        ///
        ///
        /*Y plane*/
        //compare by X (lock Z)
        for (let x = 0; x < 9; x++) {
            if (x !== cordinate.x) {
                const cpVal = stack[nona2Deca(x, cordinate.y, cordinate.z)].value;
                if (cpVal === number) {
                    return false; // validate fail
                }
            }
        }
        //compare by Z (lock X)
        for (let z = 0; z < 9; z++) {
            if (z !== cordinate.z) {
                const cpVal = stack[nona2Deca(cordinate.x, cordinate.y, z)].value;
                if (cpVal === number) {
                    return false; // validate fail
                }
            }
        }
        //compare by region
        const centerY = findNearestCenter(cordinate.x, cordinate.z);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (centerY[0] + i !== cordinate.x || centerY[0] + j !== cordinate.z) {
                    const cpVal = stack[nona2Deca(centerY[0] + i, cordinate.y, centerY[1] + j)].value;
                    if (cpVal === number) {
                        return false; // validate fail
                    }
                }
            }
        }
        ///
        ///
        /*Z plane*/
        //compare by X (lock Y)
        for (let x = 0; x < 9; x++) {
            if (x !== cordinate.x) {
                const cpVal = stack[nona2Deca(x, cordinate.y, cordinate.z)].value;
                if (cpVal === number) {
                    return false; // validate fail
                }
            }
        }
        //compare by Y (lock X)
        for (let y = 0; y < 9; y++) {
            if (y !== cordinate.y) {
                const cpVal = stack[nona2Deca(cordinate.x, y, cordinate.z)].value;
                if (cpVal === number) {
                    return false; // validate fail
                }
            }
        }
        //compare by region
        const centerZ = findNearestCenter(cordinate.x, cordinate.y);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (centerZ[0] + i !== cordinate.x || centerZ[0] + j !== cordinate.y) {
                    const cpVal = stack[nona2Deca(centerZ[0] + i, centerZ[1] + j, cordinate.z)].value;
                    if (cpVal === number) {
                        return false; // validate fail
                    }
                }
            }
        }

        ///PASS
        return true;
    }

    let _index = 0;

    let count = 0;

    // console.log(shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 'aaaa'));

    // try {
    //     while (true) {
    //         count++;
    //         if (_index === stack.length) {
    //             break;
    //         }
    //         console.log(_index);
    //         // console.log(stack[_index]);
    //         const k = stack[_index].indexArrNumSelect;
    //         if (k === 8) {
    //             stack[_index].value = undefined;
    //             stack[_index].indexArrNumSelect = -1;
    //             _index--;
    //             continue;
    //         }
    //         let isFound = false;
    //         for (let i = k + 1; i < 9; i++) {
    //             if (validateCell(stack[_index].cordinate, stack[_index].arrNumSelect[i])) {
    //                 stack[_index].value = stack[_index].arrNumSelect[i];
    //                 stack[_index].indexArrNumSelect = i;
    //                 isFound = true;
    //                 break;
    //             }
    //         }
    //         if (isFound) {
    //             _index++;
    //         } else {
    //             stack[_index].value = undefined;
    //             stack[_index].indexArrNumSelect = -1;
    //             _index--;
    //         }
    //     }
    // } catch (e) {
    //     console.log(count);
    // }

    //729
    WebAssembly.instantiateStreaming(fetch('wasm/add.wasm'), {}).then((result) => {
        const strPtr = result.instance.exports.getArray(); // Lấy con trỏ đến chuỗi
        const memory = new Uint8Array(result.instance.exports.memory.buffer);

        // Chuyển đổi con trỏ thành chuỗi
        let str = '';
        for (let i = strPtr; memory[i] !== 0; i++) {
            str += String.fromCharCode(memory[i]); // Chuyển đổi từng ký tự thành chuỗi
        }
        console.log(str); // In ra: "Hello, World!"
    });

    return {
        sodokuBox,
    };
}
