import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import sinon from 'sinon';
import Logs from '../../../../../../main/webapp/app/admin/logs/logs.vue';
import LogsService from '../../../../../../main/webapp/app/admin/logs/logs.service';

type LogsComponentType = InstanceType<typeof Logs>;

const axiosStub = {
  get: sinon.stub(axios, 'get'),
  post: sinon.stub(axios, 'post'),
};

describe('Logs Component', () => {
  let logs: LogsComponentType;

  beforeEach(() => {
    axiosStub.get.resolves({});
    const wrapper = shallowMount(Logs);
    logs = wrapper.vm;
  });

  describe('OnInit', () => {
    it('should set all default values correctly', () => {
      expect(logs.filtered).toBe('');
      expect(logs.orderProp).toBe('name');
      expect(logs.reverse).toBe(false);
    });

    it('Should call load all on init', async () => {
      // WHEN
      logs.init();
      await logs.$nextTick();

      // THEN
      expect(axiosStub.get.calledWith('management/loggers')).toBeTruthy();
    });
  });

  describe('change log level', () => {
    it('should change log level correctly', async () => {
      axiosStub.post.resolves({});

      // WHEN
      logs.updateLevel('main', 'ERROR');
      await logs.$nextTick();

      // THEN
      expect(axiosStub.post.calledWith('management/loggers/main', { configuredLevel: 'ERROR' })).toBeTruthy();
      expect(axiosStub.get.calledWith('management/loggers')).toBeTruthy();
    });
  });

  describe('change order', () => {
    it('should change order and invert reverse', () => {
      // WHEN
      logs.changeOrder('dummy-order');

      // THEN
      expect(logs.orderProp).toEqual('dummy-order');
      expect(logs.reverse).toBe(true);
    });
  });
});
