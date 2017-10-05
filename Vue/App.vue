<template>
  <div id="#app">
      <div class="alert alert-warning" v-show="this.elems < 9">You need to set 9 images. At the moment you have only {{ this.elems }}.</div>
      <puzzle 
        v-for="(puzzle, key) in puzzles" 
        v-bind:key="key" 
        :path="puzzle.path" 
        :base-url="baseUrl" 
        class="cell"
        :up-disabled="(key == 0) ? true : false"
        :down-disabled="(key == puzzles.length - 1) ? true : false" 
        :url="puzzle.url"
        :title="puzzle.title"
        @destroy="destroy(key)"
        @up="moveUp(key)"
        @down="moveDown(key)"
        @changeImage="openModal(key)"
        @urlChanged="changeUrl(key, $event)"
        @titleChanged="changeTitle(key, $event)"
      >
      </puzzle>
      <button @click="addImage" :disabled="this.elems > 8">Add new image</button>
      <modal v-if="showModal" @keyup.esc="closeModal">
        <images 
          slot="body" 
          ></images>
      </modal>
  </div>  
</template>

<script>
import Puzzle from './components/Puzzle.vue'
import Modal from './components/Modal.vue'
import Images from './components/Images.vue'
import { IS_LOCAL } from './config'
import puzzles from './puzzles.json'
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'puzzles',
  props: ['baseUrl'],
  components: {
    Puzzle,
    Modal,
    Images
  },
  created () {
    if(IS_LOCAL) {
      this.puzzles = puzzles;  
    } else {
      this.getPuzzles();      
    };

    eventBus.$on('close', () => this.closeModal());

    eventBus.$on('selectedImage', (image) => this.swapImage(image));
  },
  data () {
    return {
      puzzles: [],
      showModal: false,
      selectedImage: -1,
    }
  },
  methods: {
    save () {
      axios.post('/api/savePuzzles', {
        "puzzles": this.puzzles
      })
      .then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    getPuzzles () {
      var self = this;
      axios.get('/api/puzzles')
        .then(function (response) {
          self.puzzles = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    destroy (key) {
      this.puzzles.splice(key, 1);
      this.save();
    },
    moveUp (key) {
      this.moveElem(key, key - 1);
    },
    moveDown (key) {
      this.moveElem(key + 1, key);
    },
    moveElem (from, to) {
      this.puzzles.splice(from,0,this.puzzles.splice(to, 1)[0]);      
      this.save();
    },
    openModal (key) {
      this.showModal = true;
      this.selectedImage = key;

    },
    closeModal () {
      this.selectedImage = -1;      
      this.showModal = false;
    },

    swapImage(image) {
      image.url = this.puzzles[this.selectedImage].url;
      this.$set(this.puzzles, this.selectedImage,  image);
      this.save()
    },

    addImage() {
      let lastElement = this.puzzles[this.puzzles.length - 1];
      let newElement = {
        path: lastElement.path,
        image_id: lastElement.image_id,
        url: lastElement.url
      }
      this.puzzles.push(newElement);
      this.save();
    },

    changeUrl(key, newUrl) {
      let toUpdate = this.puzzles[key];
      toUpdate.url = newUrl;
      this.$set(this.puzzles, key, toUpdate);
      this.save()
    },

    changeTitle(key, newTitle) {
      let toUpdate = this.puzzles[key];
      toUpdate.title = newTitle;
      this.$set(this.puzzles, key, toUpdate);
      this.save()
    }
  },

  computed: {
    elems() {
      return this.puzzles.length
    }
  }
}
</script>

<style scoped>

  .cell {
    width: calc(100% / 3 - 20px);
    margin: 10px;
    float: left;
    text-align: center;
    cursor: pointer;
}
.input-group {
    position: relative;
    display: table;
    border-collapse: separate;
    margin: 10px 0px;
}

</style>
