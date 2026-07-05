// import sharp from "sharp";
// import * as ort from "onnxruntime-node";

// const SIZE = 64;

// export async function preprocess(faceBuffer) {

//     const { data } = await sharp(faceBuffer)
//         .resize(SIZE, SIZE)
//         .grayscale()
//         .raw()
//         .toBuffer({ resolveWithObject: true });

//     const input = new Float32Array(SIZE * SIZE);

//     for (let i = 0; i < data.length; i++) {

//         input[i] = (data[i] / 255 - 0.5) / 0.5;

//     }

//     return new ort.Tensor(
//         "float32",
//         input,
//         [1, 1, SIZE, SIZE]
//     );
// }



import sharp from "sharp";
import * as ort from "onnxruntime-node";

const SIZE = 64;

export async function preprocess(faceBuffer) {

    const { data } = await sharp(faceBuffer)
        .resize(SIZE, SIZE)
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    // FER+ expects raw float32 pixel values (0-255), NOT normalized.
    // Matches ml-server/skills/emotion/preprocess.py exactly.
    const input = new Float32Array(SIZE * SIZE);

    for (let i = 0; i < data.length; i++) {
        input[i] = data[i];
    }

    return new ort.Tensor(
        "float32",
        input,
        [1, 1, SIZE, SIZE]
    );
}