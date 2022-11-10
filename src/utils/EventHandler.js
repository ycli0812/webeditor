class EventHandler {}

class MouseEventHandler extends EventHandler {
    handleClick(e) {
        console.log('Handler: event:', e, 'this:', this);
    }
}

export {MouseEventHandler};