<template>
  <div>
    <b-dropdown-item to="/todo">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.todo')"></span>
    </b-dropdown-item>
    <b-dropdown-item to="/tag">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.tag')"></span>
    </b-dropdown-item>
    <!-- jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here -->
  </div>
</template>

<script lang="ts" src="./entities-menu.component.ts"></script>
