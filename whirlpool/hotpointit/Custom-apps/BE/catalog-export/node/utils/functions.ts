export function isValid(field: any): boolean{
  return field!=undefined && field!=null && field!="null" && field!="" && field!=" " && field!="-" && field!="_";
}