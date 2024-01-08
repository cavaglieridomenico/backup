var emailRegex = /^[A-z0-9\.\+_-]+@[A-z0-9\._-]+\.[A-z]{2,6}$/;
var nameRegex = /^([a-zA-Z-9äöüÄÖÜß ]){2,30}$/

interface Verifyinterface {
    verifyEmail: Function,
    verifyName: Function,
    verifyCheck: Function
}

const verify: Verifyinterface = {
    verifyEmail: (email: string) => {
        if (emailRegex.test(email))
            return false
        else
            return true
    },
    verifyName: (name: string) => {
        if (nameRegex.test(name)) {
            return false
        }
        return true
    },
    verifyCheck: (privacy: boolean) => {
        if (privacy) {
            return false
        }
        return true
    }

}

export default verify