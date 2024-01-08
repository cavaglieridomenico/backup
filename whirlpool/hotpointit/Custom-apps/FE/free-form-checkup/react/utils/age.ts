interface ageProps {
    value: string;
}
interface age extends Array<ageProps>{}

export const age: age = [
    {value: ""},
    {value: "18-30"},
    {value: "31-35"},
    {value: "36-40"},
    {value: "41-45"},
    {value: "46-50"},
    {value: "51-55"},
    {value: "56-60"},
    {value: "61-65"},
    {value: "66-70"},
    {value: ">70"}
]