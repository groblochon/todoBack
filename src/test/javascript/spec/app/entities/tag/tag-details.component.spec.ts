/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, MountingOptions } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { RouteLocation } from 'vue-router';

import TagDetails from '../../../../../../main/webapp/app/entities/tag/tag-details.vue';
import TagService from '../../../../../../main/webapp/app/entities/tag/tag.service';
import AlertService from '../../../../../../main/webapp/app/shared/alert/alert.service';

type TagDetailsComponentType = InstanceType<typeof TagDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const tagSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('Tag Management Detail Component', () => {
    let tagServiceStub: SinonStubbedInstance<TagService>;
    let mountOptions: MountingOptions<TagDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      tagServiceStub = sinon.createStubInstance<TagService>(TagService);

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
          tagService: () => tagServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        tagServiceStub.find.resolves(tagSample);
        route = {
          params: {
            tagId: '' + 123,
          },
        };
        const wrapper = shallowMount(TagDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.tag).toMatchObject(tagSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        tagServiceStub.find.resolves(tagSample);
        const wrapper = shallowMount(TagDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
