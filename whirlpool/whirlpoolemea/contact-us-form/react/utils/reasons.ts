interface reasonsInterface { 
  value: string,
  label: string,
  id: string,
  SupportEmail: string
}

export const getCorrectReasonSupportEmail = (reasons:[], choice:any) => {
  let result: reasonsInterface[] = reasons.filter((el:reasonsInterface) => el.label === choice );
  return result[0].SupportEmail || ""
}