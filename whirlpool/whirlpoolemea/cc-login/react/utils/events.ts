
function listener(eventName: string, listener: any) {
    document.addEventListener(eventName, listener);
}

function publish(eventName: string, data: any) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
}

export { publish, listener };