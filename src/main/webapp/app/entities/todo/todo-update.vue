<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="backApp.todo.home.createOrEditLabel"
          data-cy="TodoCreateUpdateHeading"
          v-text="t$('backApp.todo.home.createOrEditLabel')"
        ></h2>
        <div>
          <div class="form-group" v-if="todo.id">
            <label for="id" v-text="t$('global.field.id')"></label>
            <input type="text" class="form-control" id="id" name="id" v-model="todo.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('backApp.todo.name')" for="todo-name"></label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="todo-name"
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
            <label class="form-control-label" v-text="t$('backApp.todo.content')" for="todo-content"></label>
            <input
              type="text"
              class="form-control"
              name="content"
              id="todo-content"
              data-cy="content"
              :class="{ valid: !v$.content.$invalid, invalid: v$.content.$invalid }"
              v-model="v$.content.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('backApp.todo.done')" for="todo-done"></label>
            <input
              type="checkbox"
              class="form-check"
              name="done"
              id="todo-done"
              data-cy="done"
              :class="{ valid: !v$.done.$invalid, invalid: v$.done.$invalid }"
              v-model="v$.done.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('backApp.todo.login')" for="todo-login"></label>
            <select class="form-control" id="todo-login" data-cy="login" name="login" v-model="todo.login">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="todo.login && userOption.id === todo.login.id ? todo.login : userOption"
                v-for="userOption in users"
                :key="userOption.id"
              >
                {{ userOption.id }}
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
<script lang="ts" src="./todo-update.component.ts"></script>
