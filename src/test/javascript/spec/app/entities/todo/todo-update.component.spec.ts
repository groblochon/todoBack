/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, MountingOptions } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { RouteLocation } from 'vue-router';

import TodoUpdate from '../../../../../../main/webapp/app/entities/todo/todo-update.vue';
import TodoService from '../../../../../../main/webapp/app/entities/todo/todo.service';
import AlertService from '../../../../../../main/webapp/app/shared/alert/alert.service';

import UserService from '../../../../../../main/webapp/app/entities/user/user.service';

type TodoUpdateComponentType = InstanceType<typeof TodoUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const todoSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<TodoUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Todo Management Update Component', () => {
    let comp: TodoUpdateComponentType;
    let todoServiceStub: SinonStubbedInstance<TodoService>;

    beforeEach(() => {
      route = {};
      todoServiceStub = sinon.createStubInstance<TodoService>(TodoService);

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'b-input-group': true,
          'b-input-group-prepend': true,
          'b-form-datepicker': true,
          'b-form-input': true,
        },
        provide: {
          alertService,
          todoService: () => todoServiceStub,

          userService: () =>
            sinon.createStubInstance<UserService>(UserService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      };
    });

    afterEach(() => {
      vitest.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(TodoUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.todo = todoSample;
        todoServiceStub.update.resolves(todoSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(todoServiceStub.update.calledWith(todoSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        todoServiceStub.create.resolves(entity);
        const wrapper = shallowMount(TodoUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.todo = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(todoServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        todoServiceStub.find.resolves(todoSample);
        todoServiceStub.retrieve.resolves([todoSample]);

        // WHEN
        route = {
          params: {
            todoId: '' + todoSample.id,
          },
        };
        const wrapper = shallowMount(TodoUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.todo).toMatchObject(todoSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        todoServiceStub.find.resolves(todoSample);
        const wrapper = shallowMount(TodoUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
