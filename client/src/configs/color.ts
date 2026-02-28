export const SELECTED_STROKE_COLOR = "#0e00ff";
export const UNSELECTED_STROKE_COLOR = "#111111";
export const GRID_STROKE_COLOR = "#eeeeee";

// chart colors copied  from index.css
// const PALETTE = ["#f54a00", "#009689", "#104e64", "#ffba00", "#fd9a00"];
const PALETTE = ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];

export function getPaletteColor(index: number) {
    return PALETTE[index % PALETTE.length];
}

export function getNameColor(name: string) {
    // HACK: pick a color based on the name
    let index = 0;
    for (let i = 0; i < name.length; i++) {
        index += name.charCodeAt(i);
    }
    return getPaletteColor(index);
}
