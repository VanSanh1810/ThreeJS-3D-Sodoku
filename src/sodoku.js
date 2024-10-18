import * as THREE from 'three';

export function createSodoku() {
    const sodokuBox = [];

    for (let x = 0; x < 9; x++) {
        const yCol = [];
        for (let y = 0; y < 9; y++) {
            const zCol = [];
            for (let z = 0; z < 9; z++) {
                const randomNum = Math.floor(Math.random() * 9) + 1;
                zCol.push({
                    cordinate: {
                        x,
                        y,
                        z,
                    },
                    value: Math.random() > 0.9 ? randomNum : undefined,
                });
            }
            yCol.push([...zCol]);
        }
        sodokuBox.push(yCol);
    }

    return {
        sodokuBox,
    };
}
