<template>
  <nav id="nav" class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">Quick-LEM</router-link>
    </div>
  </nav>
  <div id="main" class="d-flex flex-row h-100">
    <ul
      id="sidebar"
      class="nav nav-pills bg-light d-flex flex-column justify-content-center align-items-center"
    >
      <li class="nav-item">
        <router-link to="/purchaseorders" class="nav-link">Purchase Orders</router-link>
        <router-link to="/timesheet" class="nav-link">Timesheet</router-link>
        <router-link to="/lems" class="nav-link">LEMs</router-link>
      </li>
    </ul>
    <router-view />
  </div>
</template>

<style>
#sidebar {
  width: 200px;
}
</style>
