export const sendMessage = (ws, object) => {
    try {
        const strObj = JSON.stringify(object)
        ws.send(strObj)
    } catch (error) {
        console.log(error)
    }
}