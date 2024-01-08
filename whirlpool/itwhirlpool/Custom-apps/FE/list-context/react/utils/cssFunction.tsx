export function getCss(root:string, blockClass:any){
    if(Array.isArray(blockClass)){
        let acc = ''
        blockClass.map((item:any) => acc += root+'--'+item+' ')
        return ' '+acc.trim()
    }else{
        return ' '+root+'--'+blockClass
    }
}