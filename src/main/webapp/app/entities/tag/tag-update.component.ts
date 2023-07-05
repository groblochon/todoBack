import { computed, defineComponent, inject, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import TagService from '@/entities/tag/tag.service';
import { ITag } from '@/shared/model/tag.model';
import TodoService from '@/entities/todo/todo.service';
import { ITodo } from '@/shared/model/todo.model';
import { ITag, Tag } from '@/shared/model/tag.model';
import TagService from './tag.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'TagUpdate',
  setup() {
    const tagService = inject('tagService', () => new TagService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const tag: Ref<ITag> = ref(new Tag());
    const tagService = inject('tagService', () => new TagService());
    const tags: Ref<ITag[]> = ref([]);
    const todoService = inject('todoService', () => new TodoService());
    const todos: Ref<ITodo[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'fr'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveTag = async tagId => {
      try {
        const res = await tagService().find(tagId);
        tag.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.tagId) {
      retrieveTag(route.params.tagId);
    }

    const initRelationships = () => {
      tagService()
        .retrieve()
        .then(res => {
          tags.value = res.data;
        });
      todoService()
        .retrieve()
        .then(res => {
          todos.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      name: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      parent: {},
      todo: {},
    };
    const v$ = useVuelidate(validationRules, tag as any);
    v$.value.$validate();

    return {
      tagService,
      alertService,
      tag,
      previousState,
      isSaving,
      currentLanguage,
      tags,
      todos,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.tag.id) {
        this.tagService()
          .update(this.tag)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('backApp.tag.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.tagService()
          .create(this.tag)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('backApp.tag.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
