/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, MountingOptions } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { RouteLocation } from 'vue-router';

import TodoDetails from '../../../../../../main/webapp/app/entities/todo/todo-details.vue';
import TodoService from '../../../../../../main/webapp/app/entities/todo/todo.service';
import AlertService from '../../../../../../main/webapp/app/shared/alert/alert.service';

type TodoDetailsComponentType = InstanceType<typeof TodoDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const todoSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Todo Management Detail Component', () => {
    let todoServiceStub: SinonStubbedInstance<TodoService>;
    let mountOptions: MountingOptions<TodoDetailsComponentType>['global'];

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
          'router-link': true,
        },
        provide: {
          alertService,
          todoService: () => todoServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        todoServiceStub.find.resolves(todoSample);
        route = {
          params: {
            todoId: '' + 123,
          },
        };
        const wrapper = shallowMount(TodoDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.todo).toMatchObject(todoSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        todoServiceStub.find.resolves(todoSample);
        const wrapper = shallowMount(TodoDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
