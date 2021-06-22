<template>
  <div>
    <h2>Hello this is for refs man!</h2>
    <p>You have counted {{ this.counter }} times</p>
    <input type="text" ref="input">
    <button @click="submit">Add 1 to counter</button>
    <div class="container-fluid mt-3 mb-5" style="border: 1px solid #dddddd; width:500px; height:500px">
      <VueResizable :width="item[0].itemWidth" :height="item[0].itemHeight"
                    :left="item[0].itemXpos" :top="item[0].itemYpos"
                    :max-width="250" :max-height="250"
                    :min-width="100" :min-height="100"
                    @resize:move="dragAndResize"
                    @drag:move="dragAndResize"
                    :drag-selector="dragArea" :fit-parent="true"
                    :id="item[0].itemId" :ref="item[0].itemId">
        <div class="card draggable resizable">
          <div class="card-header">
            <h5>{{ item[0].itemName }}</h5>
          </div>
          <div class="card-body">
            <p> X : {{ item[0].itemXpos }} - Y : {{ item[0].itemYpos }} </p>
            <p> W : {{ item[0].itemWidth }} - H : {{ item[0].itemHeight }}</p>
          </div>
        </div>
      </VueResizable>
    </div>
    <button class="btn btn-primary" @click="getRef"></button>
  </div>
</template>

<script>
import VueResizable from 'vue-resizable';

export default {
  name: 'Test',
  components: {
    VueResizable
  },
  data() {
    return {
      counter: 0,
      item: [
        {
          itemWidth: 150,
          itemHeight: 150,
          itemXpos: 0,
          itemYpos: 0,
          itemId: 1,
          itemName: "deneme",
        }
      ],
      event: "",
      dragArea: ".draggable",
    }
  },
  methods: {
    submit() {
      this.counter++;
      console.log(this.$refs)
    },

    dragAndResize(newPos) {
      this.item[0].itemWidth = newPos.width;
      this.item[0].itemHeight = newPos.height;
      this.item[0].itemXpos = newPos.left;
      this.item[0].itemYpos = newPos.top;
      this.event = newPos.event;
    },

    getRef() {
      //const refname=this.item[0].itemId;
    }
  }
}
</script>

<style scoped>
.card {
  height: 100%;
  width: 100%;
  background-color: aqua;
  justify-content: center;
  align-items: center;
  display: inline-block;
}

.draggable {
  cursor: crosshair;
}

.resizable {
  border: 1px solid #003eff;
}

</style>
