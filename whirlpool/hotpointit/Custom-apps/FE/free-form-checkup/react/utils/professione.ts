interface professioneProps {
  value: string
}


interface professione extends Array<professioneProps>{}

export const professione: professione = [
    {
      value: ""
    },
    {
      value: "DISOCCUPATO/A"
    },
    {
      value: "OPERAIO/A"
    },
    {
      value: "IMPIEGATO/A"
    },
    {
      value: "DIRIGENTE"
    },
    {
      value: "LIBERO/A PROFESSIONISTA"
    },
    {
      value: "PENSIONATO/A"
    },
    {
      value: "CASALINGA/O"
    }    
]