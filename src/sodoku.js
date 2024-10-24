import * as THREE from 'three';
import { shuffleArray } from './helper/shuffleArray';
import { nona2Deca } from './helper/nona2Deca';

export async function createSodoku() {
    const sodokuBox = [];

    //729
    const result = await WebAssembly.instantiateStreaming(fetch('wasm/sodoku.wasm'), {});
    const strPtr = result.instance.exports.getSodoku(123); // Lấy con trỏ đến chuỗi
    const memory = new Uint8Array(result.instance.exports.memory.buffer);

    // Chuyển đổi con trỏ thành chuỗi
    let str = '';
    for (let i = strPtr; memory[i] !== 0; i++) {
        str += String.fromCharCode(memory[i]); // Chuyển đổi từng ký tự thành chuỗi
    }
    // console.log(str);

    // generate the empty grid
    for (let x = 0; x < 9; x++) {
        const yCol = [];
        for (let y = 0; y < 9; y++) {
            const zCol = [];
            for (let z = 0; z < 9; z++) {
                const randNum = Math.random();
                zCol.push({
                    cordinate: {
                        x,
                        y,
                        z,
                    },
                    value: randNum > 0.3 ? undefined : parseInt(str[nona2Deca(x, y, z)]), // fixed value
                    userValue: undefined,
                });
            }
            yCol.push([...zCol]);
        }
        sodokuBox.push(yCol);
    }

    function validateSodokuPuzzel() {
        // Lấy bộ nhớ WebAssembly
        const _memory = result.instance.exports.memory;
        const validatePuzzle = result.instance.exports.validatePuzzle;
        // Chuỗi mà bạn muốn truyền vào WebAssembly
        const inputString = '123123';
        // Chuyển chuỗi từ JavaScript thành byte array và sao chép vào bộ nhớ WebAssembly
        function stringToMemory(str, __memory) {
            const encoder = new TextEncoder(); // Mã hóa chuỗi thành byte (UTF-8)
            const encodedString = encoder.encode(str);
            const buffer = new Uint8Array(__memory.buffer); // Bộ nhớ WebAssembly
            const ptr = 1024; // Địa chỉ bắt đầu của chuỗi trong bộ nhớ (tùy ý chọn)

            // Sao chép byte của chuỗi vào bộ nhớ WebAssembly tại vị trí ptr
            for (let i = 0; i < encodedString.length; i++) {
                buffer[ptr + i] = encodedString[i];
            }

            // Trả về con trỏ (địa chỉ) nơi chuỗi được lưu
            return ptr;
        }
        // Chuyển chuỗi "123123" vào bộ nhớ WebAssembly và lấy con trỏ đến chuỗi
        const strPtr = stringToMemory(inputString, _memory);

        // Gọi hàm validatePuzzle từ WebAssembly với con trỏ đến chuỗi
        const resultValue = validatePuzzle(strPtr);

        console.log(resultValue);

        return resultValue;
    }

    return {
        sodokuBox,
        validateSodokuPuzzel,
    };
}
