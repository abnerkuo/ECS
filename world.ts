/**
 * ces 来管理所有实体，系统的运作
 *
 * Abner.Guo
 */
import Family from "./family";
import EntityList from "./entitylist";
import System from "./system";
import Entity from "./entity";
import Signal from "./signal";
export default class World {
  //用来将拥有相同组件的实体放在一起。方便管理
  private _families: { [key: string]: Family };
  //用组件名作为key，值为拥有该组件的实体列表。这个属性主要做一次缓存
  private _familiesIndex: { [key: string]: Family[] };
  //世界里所有的系统
  private _systems: System[];
  //世界里所有的实体
  private _entities: EntityList<Entity>;

  constructor() {
    this._families = {};
    this._familiesIndex = {};
    this._systems = [];
    this._entities = new EntityList<Entity>();
  }

  /**
   * 向该世界增加一个系统
   * @param system 系统实例
   */
  addSystem(system: System) {
    this._systems.push(system);
    system.addToWorld(this);
  }

  /**
   * 从该世界删除一个系统
   * @param system 系统实例
   */
  removeSystem(system: System) {
    let systems = this._systems;
    for (let i = 0; i < systems.length; i++) {
      if (system[i] === system) {
        systems.splice(i, 1);
        system.removedFromWorld(this);
      }
    }
  }

  /**
   *
   *
   * 返回一个 家庭集合ID 格式为 "$component1.name,component2.name"
   * @param {Array.<String>} components
   * @return {String} The family ID for the passed array of components.
   */
  _getFamilyId(components: string[]): string {
    return "$" + Array.prototype.join.call(components, ",");
  }

  /**
   * 增加一个实体到该世界
   * @param entity 实体实例
   */
  addEntity(entity: Entity) {
    for (let key in entity._components) {
      let component = entity._components[key];
      if (!component) {
        continue;
      }
      //只在搜查实体上有的组件的家庭集合，不需要遍历所有家庭集合
      this._familiesIndex[component.name] =
        this._familiesIndex[component.name] || [];
      let families = this._familiesIndex[component.name];
      for (let i = families.length; i--;) {
        families[i].addEntityIfMatch(entity);
      }
    }
    // 给该实体增加一个信号监听 如果有组件增加到该实体就触发，同时更新家庭集合内的实体列表
    entity.onComponentAdded.add((entity: Entity, component: string) => {
      this._onComponentAdded(entity, component);
    });

    // 给该实体增加一个信号监听 如果有组件从该实体删除就触发，同时更新家庭集合内的实体列表
    entity.onComponentRemoved.add((entity: Entity, component: string) => {
      this._onComponentRemoved(entity, component);
    });

    //将实体增加到实体列表中，方便获取
    this._entities.add(entity);
  }

  /**
   * 获取拥有指定组件的实体
   * @param componentNames
   * @return 实体数组
   */
  getEntities(...componentNames: string[]): Array<any>[] {

    let familyId = this._getFamilyId(componentNames);
    this._ensureFamilyExists(componentNames);

    return this._families[familyId].getEntities();
  }

  /**
   * 遍历该世界中的所有系统，调用其update方法
   * @param dt 每帧刷新时经过的时间秒
   */
  update(dt: number) {
    for (let i = 0; i < this._systems.length; i++) {
      this._systems[i].update(dt);
    }
  }

  /**
   * 返回一个实体增加的信号器实例
   * 该信号器在组件增加到实体的时候会发送给所有监听该信号的回调函数
   * @param componentNames
   */
  entityAdded(componentNames: string | string[]): Signal {
    let components: string[] = [];
    if (typeof componentNames === "string") {
      components.push(componentNames);
    } else {
      components = componentNames;
    }

    let familyId = this._getFamilyId(components);
    this._ensureFamilyExists(components);

    return this._families[familyId].entityAdded;
  }

  /**
   *  返回一个实体删除的信号器实例
   *  该信号器在组件从实体上移除的时候会发送给所有监听该信号的回调函数
   * @param componentNames
   */
  entityRemoved(componentNames: string | string[]): Signal {
    let components: string[] = [];
    if (typeof componentNames === "string") {
      components.push(componentNames);
    } else {
      components = componentNames;
    }

    let familyId = this._getFamilyId(components);
    this._ensureFamilyExists(components);

    return this._families[familyId].entityRemoved;
  }

  /**
   * 从该世界移除指定实体
   * @param entity
   */
  removeEntity(entity: Entity) {
    for (let key in entity._components) {
      let component = entity._components[key];
      if (!component) {
        continue;
      }
      //只在搜查实体上有的组件的家庭集合，不需要遍历所有家庭集合
      this._familiesIndex[component.name] =
        this._familiesIndex[component.name] || [];
      let families = this._familiesIndex[component.name];
      for (let i = families.length; i--;) {
        families[i].removeEntity(entity);
      }
    }
    this._entities.remove(entity);
    entity.removed = true;
  }

  /**
   * 当一个组件增加到一个实体上时候调用
   * 根据组件名搜查家庭集合 如果找到则把该实体加入进去
   * @param entity  实体
   * @param componentName 组件名
   */
  private _onComponentAdded(entity: Entity, componentName: string) {
    this._familiesIndex[componentName] =
      this._familiesIndex[componentName] || [];
    let families = this._familiesIndex[componentName];
    for (let i = 0; i < families.length; i++) {
      families[i].onComponentAdded(entity, componentName);
    }
  }

  /**
   * 当一个组件从一个实体上删除时候调用
   * 根据组件名搜查家庭集合 如果找到则把该实体移除
   * @param entity  实体
   * @param componentName 组件名
   */
  private _onComponentRemoved(entity: Entity, componentName: string) {
    this._familiesIndex[componentName] =
      this._familiesIndex[componentName] || [];
    let families = this._familiesIndex[componentName];
    for (let i = 0; i < families.length; i++) {
      families[i].onComponentRemoved(entity, componentName);
    }
  }

  /**
   * 如果指定的组件数组没有对应的家庭集合那么就创建它！
   * @param componentNames 组价名
   */
  private _ensureFamilyExists(componentNames: string[]) {
    let families = this._families;
    let familyId = this._getFamilyId(componentNames);
    if (!families[familyId]) {
      families[familyId] = new Family(
        Array.prototype.slice.call(componentNames)
      );
      // 缓存 组件映射到家庭集合，返回查询
      for (let i = 0; i < componentNames.length; i++) {
        let key = componentNames[i];
        this._familiesIndex[key] = this._familiesIndex[key] || [];
        this._familiesIndex[key].push(families[familyId]);
      }

      // 检查世界中的实体，如果有匹配该家庭集合的都增加进去
      for (let node = this._entities.head; node; node = node.next) {
        families[familyId].addEntityIfMatch(node.entity);
      }
    }
  }
}
