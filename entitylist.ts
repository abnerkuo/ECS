/**
 * 实体列表
 *
 * Abner.Guo
 */

/**
 * 一个实体包装器 将用来增加到 实体列表中
 */

class EntityNode<T> {
  entity: T;
  prev: any = null;
  next: any = null;
  constructor(entity: T) {
    this.entity = entity;
    this.prev = null;
    this.next = null;
  }
}

interface IEntityId {
  id: number;
}

/**
 *  实体列表的双向链表 允许实体 高效的增加和删除
 *
 */

export default class EntityList<T extends IEntityId> {
  head: any;
  tail: any;
  length: number;
  _entities: { [key: number]: EntityNode<T> } = {};

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this._entities = {};
  }
  /**
   * 向链表中增加一个实体包装器
   * @param entity
   */
  add(entity: T) {
    let node = new EntityNode<T>(entity);
    if (null === this.head) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.length += 1;
    this._entities[entity.id] = node;
  }
  /**
   * 从链表中删除一个实体包装器
   * @param entity
   */
  remove(entity: T) {
    let node = this._entities[entity.id];
    if (!node) {
      return;
    }
    if (node.prev === null) {
      this.head = node.next;
    } else {
      node.prev.next = node.next;
    }

    if (node.next === null) {
      this.tail = node.prev;
    } else {
      node.next.prev = node.prev;
    }

    this.length -= 1;
    this._entities[entity.id] = null;
  }

  /**
   * 检查链表是否有指定的实体包装器
   * @param entity
   */
  has(entity: T): EntityNode<T> {
    return this._entities[entity.id];
  }

  /**
   * 清除链表
   * @param entity
   */
  clear() {
    this.head = this.tail = null;
    this.length = 0;
    this._entities = {};
  }

  /**
   * 返回链表中的所有实体包装器
   * @param entity
   */
  toArray(): Array<any>[] {
    let array: any[] = [];

    for (let node = this.head; node; node = node.next) {
      array.push(node.entity);
    }
    return array;
  }
}
