/**
 * ces中的 c-> component 组件
 * 
 * Abner.Guo
 */

interface IComponent{
    [key:string]:any
}

export default  class Component implements IComponent{

    readonly name:string = "";

    constructor(name:string){
        this.name = name;
    }
}