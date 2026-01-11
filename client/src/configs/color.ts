export const SELECTED_STROKE_COLOR = "#0e00ff";
export const UNSELECTED_STROKE_COLOR = "#111111";
export const GRID_STROKE_COLOR = "#eeeeee";

// chart colors copied  from index.css
const PALETTE = ["#f54a00", "#009689", "#104e64", "#ffba00", "#fd9a00"];

export function getPaletteColor(index: number) {
    return PALETTE[index % PALETTE.length];
}
