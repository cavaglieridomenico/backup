interface applianceDataProps {
    category: string;
    model: any
    label: string
}
interface applianceData extends Array<applianceDataProps>{}

export const applianceData: applianceDataProps[] = [
    {
        category: "DRYING",
        label: "ASCIUGATRICE",
        model: [
            {product_id: "859991633780", commercial_code: "H8 D94WB IT"} 
        ]
    },
    {
        category: "OVEN",
        label: "FORNO",
        model: [
            {product_id: "859991575010", commercial_code: "FI9 P8P2 SH IX HA"}, 
            {product_id: "859991575030", commercial_code: "FI7 S8C1 SH IX HA"}, 
            {product_id: "859991575050", commercial_code: "FI6 S8C1 SH IX HA"}, 
            {product_id: "859991548850", commercial_code: "FA5S 841 J IX HA"}, 
            {product_id: "859991548920", commercial_code: "FA4S 844 P IX HA"} 
        ]
    },
    {
        category: "COMBINED_REFRIGERATOR",
        label: "FRIGORIFERO COMBINATO",
        model: [
            {product_id: "859991632920", commercial_code: "HAC20 T322"}, 
            {product_id: "859991632440", commercial_code: "HAC20 T321"}, 
            {product_id: "859991632900", commercial_code: "HAC18 T563"}, 
            {product_id: "859991632890", commercial_code: "HAC18 T542"}, 
            {product_id: "859991630890", commercial_code: "HAC18 T532"},
            {product_id: "859991599300", commercial_code: "HA70BE 73 XO3"},
            {product_id: "859991599310", commercial_code: "HA70BE 72 X"},
            {product_id: "859991626860", commercial_code: "HAFC9 TT44SX O3 H"},
            {product_id: "859991630160", commercial_code: "HAFC9 TA33SX O3"},
            {product_id: "859991630760", commercial_code: "HAC18 T311"}
        ]
    },
    {
        category: "DISHWASHER",
        label: "LAVASTOVIGLIE",
        model: [
            {product_id: "859991609540", commercial_code: "HFO 3O32 CW X"},
            {product_id: "859991606820", commercial_code: "HFO 3T241 WFG X"},
            {product_id: "859991613630", commercial_code: "HIO 3O41 WFE"},
            {product_id: "859991610630", commercial_code: "HIC 3C41 CW"}
        ]
    },
    {
        category: "WASHING_MACHINE",
        label: "LAVATRICE",
        model: [
            {product_id: "859991624800", commercial_code: "H8 W046WB IT"},
            {product_id: "859991637530", commercial_code: "H8 W946WB IT"}
        ]
    }
]