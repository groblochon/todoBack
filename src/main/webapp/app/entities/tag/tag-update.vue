<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2 id="backApp.tag.home.createOrEditLabel" data-cy="TagCreateUpdateHeading" v-text="t$('backApp.tag.home.createOrEditLabel')"></h2>
        <div>
          <div class="form-group" v-if="tag.id">
            <label for="id" v-text="t$('global.field.id')"></label>
            <input type="text" class="form-control" id="id" name="id" v-model="tag.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('backApp.tag.name')" for="tag-name"></label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="tag-name"
              data-cy="name"
              :class="{ valid: !v$.name.$invalid, invalid: v$.name.$invalid }"
              v-model="v$.name.$model"
              required
            />
            <div v-if="v$.name.$anyDirty && v$.name.$invalid">
              <small class="form-text text-danger" v-for="error of v$.name.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('backApp.tag.parent')" for="tag-parent"></label>
            <select class="form-control" id="tag-parent" data-cy="parent" name="parent" v-model="tag.parent">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="tag.parent && tagOption.id === tag.parent.id ? tag.parent : tagOption"
                v-for="tagOption in tags"
                :key="tagOption.id"
              >
                {{ tagOption.id }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('backApp.tag.todo')" for="tag-todo"></label>
            <select class="form-control" id="tag-todo" data-cy="todo" name="todo" v-model="tag.todo">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="tag.todo && todoOption.id === tag.todo.id ? tag.todo : todoOption"
                v-for="todoOption in todos"
                :key="todoOption.id"
              >
                {{ todoOption.id }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" data-cy="entityCreateCancelButton" class="btn btn-secondary" v-on:click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.cancel')"></span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="v$.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.save')"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./tag-update.component.ts"></script>
