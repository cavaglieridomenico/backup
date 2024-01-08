import style from "./style.css"
import React from 'react'

interface ThankYouProps {
    text1: string,
    text2: string,
    text3: string,
    text4: string,
    children: any
}
const ThankYou: StorefrontFunctionComponent<ThankYouProps> = (
    {
        text1,
        text2,
        text3,
        text4,
        children
    }
) => {


    return (
        <main className={style.containerThankYouPage}>
            <div className={style.intoThankYouPage}>
                <p>
                    {text1}
                </p>
                <p>
                    {text2}
                </p>
                <p>
                    {text3}
                </p>
                <p>
                    {text4}
                </p>
                <div className={style.childrenBoxThankYouPage}>
                    {children}
                </div>

            </div>
        </main>
    )
}

ThankYou.schema = {
    title: "ThankYou",
    description: "ThankYou page",
    type: "object",
    properties: {
        text1: {
            title: "text1",
            description: "is the first text",
            default: "",
            type: "string",
        },
        text2: {
            title: "text2",
            description: "is the second text",
            default: "",
            type: "string",
        },
        text3: {
            title: "text3",
            description: "is the third text",
            default: "",
            type: "string",
        },
        text4: {
            title: "text4",
            description: "is the fourth text",
            default: "",
            type: "string",
        }
    }
}

export default ThankYou