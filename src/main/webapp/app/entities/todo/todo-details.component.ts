import { defineComponent, inject, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { ITodo } from '@/shared/model/todo.model';
import TodoService from './todo.service';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TodoDetails',
  setup() {
    const todoService = inject('todoService', () => new TodoService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);
    const todo: Ref<ITodo> = ref({});

    const retrieveTodo = async todoId => {
      try {
        const res = await todoService().find(todoId);
        todo.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.todoId) {
      retrieveTodo(route.params.todoId);
    }

    return {
      alertService,
      todo,

      previousState,
      t$: useI18n().t,
    };
  },
});
