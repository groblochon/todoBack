import { ITag } from '@/shared/model/tag.model';
import { IUser } from '@/shared/model/user.model';

export interface ITodo {
  id?: number;
  name?: string;
  content?: string | null;
  done?: boolean | null;
  tags?: ITag[] | null;
  login?: IUser | null;
}

export class Todo implements ITodo {
  constructor(
    public id?: number,
    public name?: string,
    public content?: string | null,
    public done?: boolean | null,
    public tags?: ITag[] | null,
    public login?: IUser | null
  ) {
    this.done = this.done ?? false;
  }
}
