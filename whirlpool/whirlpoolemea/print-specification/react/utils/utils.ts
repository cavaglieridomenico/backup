export const cleanValue = (param: string) => {
  if (param){
    let newParam = 
    param
      .replace(/[ :'().]/g, "-")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return newParam;
  }
else return
};
