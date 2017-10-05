import Vue from 'vue'
import App from './App.vue'

Vue.component('puzzles', App);

window.eventBus = new Vue(); 

new Vue({
  el: '#wrapper',
})
