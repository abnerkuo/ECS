/**
 * ces中的 e-> entities 实体
 *
 * Abner.Guo
 */
import Signal from "./signal";
import Component from "./component";

export default class Entity {
  static _id: number;
  id: number;
  removed: boolean;
  _components: { [key: string]: Component } = {};
  onComponentAdded: Signal;
  onComponentRemoved: Signal;

  constructor() {
    this.id = Entity._id++;
    this.removed = false;
    this._components = {};
    this.onComponentAdded = new Signal();
    this.onComponentRemoved = new Signal();
  }
  /**
   * 检查实体上是否有指定的组件
   * @param componentName 组件名
   * @return boolean  true是有指定组件 false是没有
   */
  hasComponent(componentName: string): boolean {
    return !!this._components[componentName];
  }

  /**
   * 获取实体上指定组件
   * @param componentName 组件名
   * @return Component｜any  返回组件信息
   */
  getComponent(componentName: string): Component | any {
    return this._components[componentName];
  }

  /**
   * 向实体新增组件
   * 告诉增加组件事件的监听函数有组件加到实体上
   * @param componentName 组件名
   * @return Component｜any  返回组件信息
   */
  addComponent(component: Component) {
    this._components[component.name] = component;
    this.onComponentAdded.emit(this, component.name);
  }

  /**
   * 从实体删除指定组件
   * 告诉删除组件事件的监听函数有组件从实体上删除
   * @param componentName 组件名
   * @return Component｜any  返回组件信息
   */
  removeComponent(componentName: string) {
    this._components[componentName] = null;
    this.onComponentRemoved.emit(this, componentName);
  }
}

// 实体唯一id  id将随创建的实体增加而增加
Entity._id = 0;
