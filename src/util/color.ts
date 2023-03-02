
export const colorPalette = generateColors();

export function generateColors() {
    let data = []
    for (let x = 0; x < 360; x++) {
        let [red, green, blue] = hsv2rgb(x, 1, 1, 255)

        data.push(`#${Math.round(red).toString(16).padStart(2, '0')}${Math.round(green).toString(16).padStart(2, '0')}${Math.round(blue).toString(16).padStart(2, '0')}`)
    }
    return data
}

export function hsv2rgb(hue: number, saturation: number, value: number, scale = 1) {
    let chroma = value * saturation
    let hue1 = hue / 60
    let x = chroma * (1 - Math.abs((hue1 % 2) - 1))
    let r1: number, g1: number, b1: number
    if (hue1 >= 0 && hue1 <= 1) {
        ;[r1, g1, b1] = [chroma, x, 0]
    } else if (hue1 >= 1 && hue1 <= 2) {
        ;[r1, g1, b1] = [x, chroma, 0]
    } else if (hue1 >= 2 && hue1 <= 3) {
        ;[r1, g1, b1] = [0, chroma, x]
    } else if (hue1 >= 3 && hue1 <= 4) {
        ;[r1, g1, b1] = [0, x, chroma]
    } else if (hue1 >= 4 && hue1 <= 5) {
        ;[r1, g1, b1] = [x, 0, chroma]
    } else {
        // (hue1 >= 5 && hue1 <= 6)
        ;[r1, g1, b1] = [chroma, 0, x]
    }

    let m = value - chroma
    let [r, g, b] = [r1 + m, g1 + m, b1 + m]

    return [scale * r, scale * g, scale * b]
}

export function rgb2hsv(r: number, g: number, b: number) {
    let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
    let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
    return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
}


export function parseColor(input: string): [number, number, number] {
    var div = document.createElement('div'), m;
    div.style.color = input;
    m = getComputedStyle(div).color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    div.remove();
    if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
    else throw new Error("Colour " + input + " could not be parsed.");
}