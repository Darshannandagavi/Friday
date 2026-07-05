import sharp from "sharp";

export async function drawDetection(inputBuffer, detections) {

    const image = sharp(inputBuffer);

    const meta = await image.metadata();

    let svg = `
    <svg width="${meta.width}" height="${meta.height}">
    `;

    for (const face of detections) {

        svg += `
        <rect
            x="${face.box.x1}"
            y="${face.box.y1}"
            width="${face.box.width}"
            height="${face.box.height}"
            fill="none"
            stroke="red"
            stroke-width="3"
        />
        `;

        for (const p of face.landmarks) {

            svg += `
            <circle
                cx="${p.x}"
                cy="${p.y}"
                r="3"
                fill="lime"
            />
            `;
        }
    }

    svg += `</svg>`;

    await image
        .composite([
            {
                input: Buffer.from(svg),
                top: 0,
                left: 0,
            },
        ])
        .toFile("result.jpg");

    console.log("Saved result.jpg");
}