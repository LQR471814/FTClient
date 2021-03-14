export function executeTransition(element: HTMLElement, callback: (e: TransitionEvent) => void) {
    element.addEventListener("transitionend", (e: TransitionEvent) => {
        callback(e)
    }, {once: true})
}

export function executeTransitionOffset(element: HTMLElement, callback: () => void, offset?: number) {
    const cs = window.getComputedStyle(element)
    let waitTime = parseFloat(cs.transitionDelay) * 1000 + parseFloat(cs.transitionDuration) * 1000

    if (offset) waitTime += offset

    setTimeout(callback, waitTime)
}