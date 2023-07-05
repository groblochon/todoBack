<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="todo">
        <h2 class="jh-entity-heading" data-cy="todoDetailsHeading"><span v-text="t$('backApp.todo.detail.title')"></span> {{ todo.id }}</h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="t$('backApp.todo.name')"></span>
          </dt>
          <dd>
            <span>{{ todo.name }}</span>
          </dd>
          <dt>
            <span v-text="t$('backApp.todo.content')"></span>
          </dt>
          <dd>
            <span>{{ todo.content }}</span>
          </dd>
          <dt>
            <span v-text="t$('backApp.todo.done')"></span>
          </dt>
          <dd>
            <span>{{ todo.done }}</span>
          </dd>
          <dt>
            <span v-text="t$('backApp.todo.login')"></span>
          </dt>
          <dd>
            {{ todo.login ? todo.login.id : '' }}
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.back')"></span>
        </button>
        <router-link v-if="todo.id" :to="{ name: 'TodoEdit', params: { todoId: todo.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.edit')"></span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./todo-details.component.ts"></script>
