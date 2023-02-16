import { useSelector } from "react-redux";

function useCanvasViewbox(canvasHeight, canvasWidth) {
    const { gridX, gridY, zoom } = useSelector(state => state.editor);
    const svgGridSize = 100, canvasGridSize = zoom * 5;
    const rate = svgGridSize / canvasGridSize;
    let viewbox = [-gridX * rate, -gridY * rate, canvasWidth * rate, canvasHeight * rate];
    return viewbox;
}

export default useCanvasViewbox;