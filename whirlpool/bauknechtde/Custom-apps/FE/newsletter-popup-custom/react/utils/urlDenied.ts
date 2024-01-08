var urlDenied: string[] = [
    "/hp-account/newsletter",
    "/pages/ariel-aktion-registrierung",
    "/pages/jetzt-registrieren-und-dichtungssatz-erhalten",
    "/pages/wasserkaraffe-aktion-registrierung",
    "/pages/backform-aktion-registrierung"
]

interface urlDeniedUtilInterface {
    itsUrlDenied: Function,
}

const urlDeniedUtil: urlDeniedUtilInterface = {
    itsUrlDenied: () => urlDenied.includes(window.location.pathname),
}

export default urlDeniedUtil