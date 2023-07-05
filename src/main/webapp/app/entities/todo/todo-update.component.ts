import { computed, defineComponent, inject, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import UserService from '@/entities/user/user.service';
import { ITodo, Todo } from '@/shared/model/todo.model';
import TodoService from './todo.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TodoUpdate',
  setup() {
    const todoService = inject('todoService', () => new TodoService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const todo: Ref<ITodo> = ref(new Todo());
    const userService = inject('userService', () => new UserService());
    const users: Ref<Array<any>> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'fr'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

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

    const initRelationships = () => {
      userService()
        .retrieve()
        .then(res => {
          users.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      name: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      content: {},
      done: {},
      tags: {},
      login: {},
    };
    const v$ = useVuelidate(validationRules, todo as any);
    v$.value.$validate();

    return {
      todoService,
      alertService,
      todo,
      previousState,
      isSaving,
      currentLanguage,
      users,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.todo.id) {
        this.todoService()
          .update(this.todo)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('backApp.todo.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.todoService()
          .create(this.todo)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('backApp.todo.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
