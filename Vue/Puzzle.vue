<template>
  <div>
    <img class="d-flex mr-3" :src="path" @click="$emit('changeImage')">
    <div class="media-body">
        <h5 class="mt-0">Image</h5>
        <div class="input-group">

          <span class="input-group-addon">{{ baseUrl }}</span>
            <input type="text" :value="url" @input="getInput($event.target.value)" class="form-control">
        
        </div>

        <div class="input-group">
          <label class="form-control">Title</label>
          <input type="text" :value="title" @input="getTitle($event.target.value)" class="form-control">
        </div>

        <div class="input-group">
          <button class="btn btn-default btn-40" :disabled="upDisabled" @click="$emit('up')"><i class="fa fa-sort-asc"></i></button>
          <button class="btn btn-default btn-40" :disabled="downDisabled" @click="$emit('down')"><i class="fa fa-sort-desc"></i></button>
          <button class="btn btn-danger btn-40" @click="$emit('destroy')"><i class="fa fa-trash"></i></button>
        </div>
    </div> 
  </div>
</template>

<script>
export default {
  name: 'puzzle',
  props: ['path', 'upDisabled', 'downDisabled', 'baseUrl', 'url', 'title'],
  data () {
    return {
    }
  },
  created() {

  },
  methods: {
    getInput(data) {
      this.$emit('urlChanged', data)
    },
    getTitle(data) {
      this.$emit('titleChanged', data)
    }
  },
}
</script>

<style>
</style>
