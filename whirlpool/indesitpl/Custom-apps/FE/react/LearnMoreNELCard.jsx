import { useCssHandles } from "vtex.css-handles";

export default function LearnMoreNELCard(props) {
    const CSS_HANDLES = [
        "LearnMoreNEL__cardContainer",
        "LearnMoreNEL__cardTitleContainer",
        "LearnMoreNEL__cardTitle",
        "LearnMoreNEL__cardDescContainer",
        "LearnMoreNEL__cardDesc"
    ];
    const { handles } = useCssHandles(CSS_HANDLES);

    return (
        <>
            <div className={handles.LearnMoreNEL__cardContainer}>
                <div className={handles.LearnMoreNEL__cardTitleContainer}>
                    <span className={handles.LearnMoreNEL__cardTitle}>{props.title}</span>
                </div>
                <div className={handles.LearnMoreNEL__cardDescContainer}>
                    <span className={handles.LearnMoreNEL__cardDesc}>{props.desc}</span>
                </div>
            </div>
        </>
    )
}