
/**
 * ces中的 s-> system 系统
 * 
 * Abner.Guo
 */
import World from "./world";
import Entity from "./entity";

export default  class System{
    world:World = null;
    constructor(){
        this.world = null;
    }

    /**
     * 把系统加到世界中
     * @param world  world实例
     */
    addToWorld(world:World){
        this.world = world;
    }

    removedFromWorld(world:World){
        this.world = null;
    }
    /**
     * 每一帧更新实体
     * @param dt 每帧刷新时经过的时间秒
     */
    update(dt){
        throw new Error('子类应该重写改方法来实现自己的业务逻辑');
    }

    on(components:string|string[], callback:(ent:Entity)=>any) {
        throw new Error('子类应该重写改方法来实现自己的业务逻辑');
    }

     /**
     * 增加一个监听组件从实体删除行为 
     * @param components 监听的组件列表
     * @param callback 触发监听行为
     */
    onRemove(components:string|string[], callback:(ent:Entity)=>any) {
        throw new Error('子类应该重写改方法来实现自己的业务逻辑');
    }

    /**
     * 增加每一帧执行的行为 如果监听的组件都在实体上 
     * @param components 监听的组件列表
     * @param callback 触发监听行为
     */
    onUpdate(components:string|string[], callback:(dt:number,es:Entity[])=>any) {
        throw new Error('子类应该重写改方法来实现自己的业务逻辑');
    }


}