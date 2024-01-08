
interface utilsinterface {
    printDots: Function
}

const utils: utilsinterface = {
    printDots: (string: string, numMax: number) => {
        let result = "";
        if (string.length <= numMax) {
            return result = string
        } else {
            for (let x = 0; x < numMax; x++) {
                result += string[x]
            }
            return result += "..."
        }
    }
}

export default utils