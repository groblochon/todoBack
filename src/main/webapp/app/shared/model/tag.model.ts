import { ITodo } from '@/shared/model/todo.model';

export interface ITag {
  id?: number;
  name?: string;
  parent?: ITag | null;
  todo?: ITodo | null;
}

export class Tag implements ITag {
  constructor(public id?: number, public name?: string, public parent?: ITag | null, public todo?: ITodo | null) {}
}
