import { Authority } from '@/shared/security/authority';
/* tslint:disable */
// prettier-ignore
const Entities = () => import('@/entities/entities.vue');

const Todo = () => import('@/entities/todo/todo.vue');
const TodoUpdate = () => import('@/entities/todo/todo-update.vue');
const TodoDetails = () => import('@/entities/todo/todo-details.vue');

const Tag = () => import('@/entities/tag/tag.vue');
const TagUpdate = () => import('@/entities/tag/tag-update.vue');
const TagDetails = () => import('@/entities/tag/tag-details.vue');

// jhipster-needle-add-entity-to-router-import - JHipster will import entities to the router here

export default {
  path: '/',
  component: Entities,
  children: [
    {
      path: 'todo',
      name: 'Todo',
      component: Todo,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'todo/new',
      name: 'TodoCreate',
      component: TodoUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'todo/:todoId/edit',
      name: 'TodoEdit',
      component: TodoUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'todo/:todoId/view',
      name: 'TodoView',
      component: TodoDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'tag',
      name: 'Tag',
      component: Tag,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'tag/new',
      name: 'TagCreate',
      component: TagUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'tag/:tagId/edit',
      name: 'TagEdit',
      component: TagUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'tag/:tagId/view',
      name: 'TagView',
      component: TagDetails,
      meta: { authorities: [Authority.USER] },
    },
    // jhipster-needle-add-entity-to-router - JHipster will add entities to the router here
  ],
};
