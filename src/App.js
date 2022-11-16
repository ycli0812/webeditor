import './App.css';

// Components
import Canvas from './components/Canvas';
import ElementMenu from './components/ElementMenu';

class PointerContext {
  isWiring = false;
  isDraggingElement = false;
  isDraggingCanvas = false;
  isAddingComponent = false;
  isMultiSelecting = false;
  isDraggingWire = false;

  init() {
    this.isWiring = false;
    this.isDraggingElement = false;
    this.isDraggingCanvas = false;
    this.isAddingComponent = false;
    this.isMultiSelecting = false;
    this.isDraggingWire = false;
  }

  setPointerStyle() {}
  startWiring() {}
  startAddingComponent() {}
  startDraggingCanvas() {}
  startDraggingComponent() {}
  startDraggingWire() {}
}

function App() {
  /**
   * 向元件列表中添加一个元件
   *
   * @param {*} id 元件id，可以传入null，函数会自动选择
   * @param {*} detail 元件信息，示例：{x: 1, y: 1, type: 'resistor', selected: false, active: true}
   * @return {*} 成功添加返回0，id已存在返回1
   */
  function addElement(id, detail) {}

  /**
   * 从元件列表中移除一个元件
   *
   * @param {*} id 元件id
   * @return {*} 成功删除返回0，元件不存在返回1
   */
  function removeElement(id) {}
  return (
    <div className="App">
      <Canvas
        canvasWidth={300}
        canvasHeight={300}
        elementSet={{}}
        addElement={addElement}
        removeElement={removeElement}
      />
      <ElementMenu />
    </div>
  );
}

export default App;
