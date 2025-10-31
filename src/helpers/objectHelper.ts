
export function setValue(key:string, value:any, setValue:React.Dispatch<React.SetStateAction<any>>) {
  setValue((prev:any) => {
    const newData= {...prev};
    newData[key] = value;
    return newData;
  })
}