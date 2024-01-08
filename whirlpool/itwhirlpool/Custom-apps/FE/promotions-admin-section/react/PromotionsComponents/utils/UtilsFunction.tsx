export function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}


export function checkDataWithData(key: string, value: any, check: any) {
  if (["beginDate", "endDate"].includes(key)) {
    let truthValue = true;
    check.map((date: any, index: number) => {
      if (isNotUndefinedValueData(date)) {
        if (index == 0) {
          truthValue =
            truthValue && new Date(value).getTime() >= new Date(date).getTime();
        } else {
          truthValue =
            truthValue && new Date(value).getTime() <= new Date(date).getTime();
        }
      }
    });
    return truthValue;
  }
  let splittetValue = value.split(";");
  if (splittetValue.length > 1) {
    return check == "" ? value == check : value.includes(check);
  }
  return value == check;
}

export function updateValues(data: any, key: any, value: any, defaultMessage:string) {
  let newValues: any = {};
  Object.keys(data).map((key_temp: any) => {
    if (key_temp !== key) {
      newValues[key_temp] = data[key_temp];
    } else {
      if (value == "undefined") {
        newValues[key_temp] = { label: defaultMessage, value: "undefined" };
      } else {
        if (["beginDate", "endDate"].includes(key)) {
          newValues[key_temp] = [new Date(value[0]), new Date(value[1])];
        } else {
          newValues[key_temp] = { label: value, value: value };
        }
      }
    }
  });
  return newValues;
}

export function isNotUndefinedValueData(value: any) {
  return (
    new Date(value).toISOString().split("T")[0] !==
    new Date().toISOString().split("T")[0]
  );
}

export function covertDataType(values: any) {
  let from = new Date(values[0]).toISOString().split("T")[0];
  let to = new Date(values[1]).toISOString().split("T")[0];
  let now = new Date().toISOString().split("T")[0];
  let stringAcc = now !== from ? "from:" + from : "";
  stringAcc += now !== to ? ";to:" + to : "";
  return stringAcc;
}

export function getDataType(key: any, value: any) {
  return ["beginDate", "endDate"].includes(key) ? covertDataType(value) : value;
}

export function intervalIsChanged(prevValue: any, value: any, type: "from" | "to") {
  switch (type) {
    case "from":
      return new Date(prevValue).getTime() > new Date(value).getTime();
    case "to":
      return new Date(prevValue).getTime() < new Date(value).getTime();
  }
}

export const suggInitialState = (keys: string[]) => {
  let obj: any = {};
  keys.map((key: any) => {
    obj[key] = [] as string[];
  });
  return obj;
};
export const filterInitialState = (keys: string[]) => {
  let obj: any = {};
  keys.map((key: any) => {
    if (["beginDate", "endDate"].includes(key)) {
      obj[key] = [
        new Date().toISOString().split("T")[0],
        new Date().toISOString().split("T")[0],
      ];
    } else {
      obj[key] = "undefined";
    }
  });
  return obj;
};
export const valueInitialState = (keys: string[], defaultMessage:string) => {
  let obj: any = {};
  keys.map((key: any) => {
    if (["beginDate", "endDate"].includes(key)) {
      obj[key] = [new Date(), new Date()];
    } else {
      obj[key] = { label: defaultMessage, value: "undefined" };
    }
  });
  return obj;
};

export const toISOString = (value:any = '') =>{
  let date: any
  if(value == ''){
    date = new Date()
  }else{
    date = new Date(value)
  }
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
}
