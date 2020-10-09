import EntityList from "./entitylist";
import Signal from "./signal";
import Entity from "./entity";


/**
 *  指定组件的实体集合
 * 
 */

export default class Family{

    private _componentNames:string[] = [];
    private _entities:EntityList<Entity>;
    entityAdded:Signal;
    entityRemoved:Signal;

    constructor(componentNames:string[]){
        this._componentNames = componentNames;
        this._entities =new EntityList<Entity>();
        this.entityAdded =  new Signal();
        this.entityRemoved =  new Signal();

        // if(window && (window as any).debugToyOn){
            
        // }

    }
    /**
     * 返回家庭集合中所有实体
     * @return entities
     */
    getEntities():Array<any>[]{
        return this._entities.toArray();
    }
    /**
     * 如果指定实体匹配该家庭集合 那么 加入该家庭集合
     * @param entity 
     */
    addEntityIfMatch(entity:Entity){
        if (!this._entities.has(entity) && this._matchEntity(entity)) {
            this._entities.add(entity);
            this.entityAdded.emit(entity);
        }
    }
    /**
     *  如果指定实体属于这个家庭集合中那么返回true 否则返回false
     * @param entity 
     */
    private _matchEntity(entity:Entity):boolean {
        let componentNames = this._componentNames;

        for(let i=0;i<componentNames.length;i++){
            if (!entity.hasComponent(componentNames[i])) {
                return false;
            }
        }
        return true;
    }
    /**
     * 如果家庭集合中存在指定实体 删除它
     * @param entity 
     */
    removeEntity(entity:Entity) {
        if (this._entities.has(entity)) {
            this._entities.remove(entity);
            this.entityRemoved.emit(entity);
        }
    }

    /**
     * 
     * 当一个组件增加到一个实体时候调用
     * @param entity 
     * @param componentName 
     */
    onComponentAdded(entity:Entity, componentName:string) {
        this.addEntityIfMatch(entity);
    }

    /**
     * 当组件从一个实体中移除时候调用
     * @param entity 
     * @param componentName 
     */
    onComponentRemoved(entity:Entity, componentName:string){

        if(!this._entities.has(entity)){
            return;
        }

        let names = this._componentNames;
        for (let i = 0, len = names.length; i < len; ++i) {
            if (names[i] === componentName) {
                this._entities.remove(entity);
                this.entityRemoved.emit(entity);
            }
        }
    }


    
}