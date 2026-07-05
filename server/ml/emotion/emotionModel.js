import fs from "fs";

import sharp from "sharp";

import { preprocess } from "./preprocess.js";
import { runEmotion } from "./inference.js";

const labels = JSON.parse(
    fs.readFileSync(
        "./ml/emotion/labels.json",
        "utf8"
    )
);

export async function detectEmotion(faceBuffer) {

    const tensor = await preprocess(faceBuffer);

    const outputs = await runEmotion(tensor);

    const scores =
        outputs["Plus692_Output_0"].data;

    let best = 0;

    for (let i = 1; i < scores.length; i++) {

        if (scores[i] > scores[best])

            best = i;

    }

    return {

        emotion: labels[best],

        confidence: Number(scores[best].toFixed(4)),

        scores: labels.reduce((obj, label, i) => {

            obj[label] = Number(scores[i].toFixed(4));

            return obj;

        }, {})

    };

}