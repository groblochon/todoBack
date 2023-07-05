import { defineComponent, provide } from 'vue';

import UserService from '@/entities/user/user.service';
import TodoService from './todo/todo.service';
import TagService from './tag/tag.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Entities',
  setup() {
    provide('userService', () => new UserService());
    provide('todoService', () => new TodoService());
    provide('tagService', () => new TagService());
    // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
  },
});
