<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="container-fluid position-relative">
          <VueDragResize class="pageClass"
                         :w="sayfaGenisligi" :h="sayfaYuksekligi"
                         :minw="300" :minh="300"
                         :parentW="700" :parentH="620" :parentLimitation="true"
                         v-on:resizing="pageResize" :isDraggable="false">
            <VueResizable :width="dijitModuleWidth" :height="dijitYuksekligi"
                          :left="dijitXPozisyonu" :top="dijitYPozisyonu"
                          :max-width="maxW" :max-height="maxH"
                          :min-width="minW" :min-height="minH"
                          :drag-selector="dragArea"
                          @resize:move="dijitDragResize" @drag:move="dijitDragResize">
              <div class="card resizable draggable">
                <div>
                  <img :src="barcode" :width="dijitModuleWidth" :height="dijitYuksekligi"/>
                  <p> X : {{ dijitXPozisyonu }} - Y : {{ dijitYPozisyonu }} </p>
                  <p> W : {{ dijitModuleWidth }} - H : {{ dijitYuksekligi }}</p>
                </div>
              </div>
            </VueResizable>
            <VueResizable v-for="label in labels" :key="label.labelId"
                          :width="label.labelWidth" :height="label.labelHeigth"
                          :left="label.labelX" :top="label.labelY"
                          :max-width="maxW" :max-height="maxH"
                          :min-width="minW" :min-height="minH"
                          :drag-selector="dragArea"
                          @resize:move="labelDragResize" @drag:move="labelDragResize">
              <div class="card draggable resizable" @click="accessSelectedItemId(label.labelId)">
                <p>{{label.labelName}}</p>
                <p> X : {{ label.labelX }} - Y : {{ label.labelY }} </p>
                <p> W : {{ label.labelWidth }} - H : {{ label.labelHeigth }}</p>
                <p>{{label.labelNormalOrKalin}}</p>
                <p>{{label.labelYatayOrDikey}}</p>
              </div>

            </VueResizable>


            <!--            <VueResizable v-for="item in items" :key="item.itemName"
                                      :width="item.itemWidth" :height="item.itemHeight"
                                      :left="item.itemXposition" :top="item.itemYposition"
                                      :max-width="maxW" :max-height="maxH"
                                      :min-width="minW" :min-height="minH"
                                      @resize:end="dragAndResize"
                                      @drag:end="dragAndResize"
                                      :drag-selector="dragArea"
                                      :id="item.itemId">
                          <div class="card draggable resizable" :id="item.itemId" ref="item.itemId"
                               @click.prevent="accessSelectedItemId(item.itemId)">
                            <div class="card-header">
                              <h5>{{ item.itemName }}</h5>
                            </div>
                            <div class="card-body mt-10">
                              <p> X : {{ item.itemXposition }} - Y : {{ item.itemYposition }} </p>
                              <p> W : {{ item.itemWidth }} - H : {{ item.itemHeight }}</p>
                            </div>
                          </div>
                        </VueResizable>-->
            <div class="position-absolute bottom-0 end-0">
              <p>page W : {{ sayfaGenisligi }} - page H : {{ sayfaYuksekligi }}</p>
            </div>
          </VueDragResize>
        </div>
      </div>

      <div class="col">
        <div class="position-relative" style="border: 1px solid #dddddd; width:654px; height: 485px">
          <!--          <VueDragResize :w="654" :h="485"-->
          <!--                         :isDraggable="false"-->
          <!--                         :sticks="['mr', 'br', 'bm', 'tr', 'bl']"-->
          <!--                         :parentW="900" :parentH="620" :parentLimitation="true">-->
          <div>
            <button type="button" class="btn btn-primary mt-2 mb-2" @click="isVisible()">Label oluştur</button>
          </div>
          <div class="card-2 ms-4" v-if="visibility">
            <div>
              <input class="form-control" type="text" placeholder="Label Name" v-model="tempLabelName">
              <div>
                <input value="Yatay" class="form-check-input" type="radio" name="flexRadioDefault"
                       id="yatayRadioDefault1">
                <label class="form-check-label" for="yatayRadioDefault1">
                  Yatay
                </label>
                <input value="Dikey" class="form-check-input" type="radio" name="flexRadioDefault"
                       id="dikeyRadioDefault2" checked>
                <label class="form-check-label" for="dikeyRadioDefault2">
                  Dikey
                </label>
              </div>
              <div>
                <input value="Normal" class="form-check-input" type="radio" name="flexRadioDefault2"
                       id="normalRadioDefault3">
                <label class="form-check-label" for="normalRadioDefault3">
                  Normal
                </label>
                <input value="Kalın" class="form-check-input" type="radio" name="flexRadioDefault2"
                       id="kalınRadioDefault4" checked>
                <label class="form-check-label" for="kalınRadioDefault4">
                  Kalın
                </label>
              </div>

            </div>
            <!--            <VueResizable :width="150" :height="150"
                                      :left="0" :top="0"
                                      :min-height="60" :min-width="130"
                                      :fit-parent="true"
                                      :drag-selector="dragArea"
                                      @resize:move="tempItemResize"
                                      class="draggable">
                          <div class="card resizable">
                            <div class="card-header not-draggable">
                              <label>Nesne ismi</label>
                              <input type="text" class="form-control" v-model="tempItemName">
                            </div>
                            <div class="card-body draggable">
                              <p> W : {{ tempItemWidth }} - H : {{ tempItemHeight }}</p>
                            </div>
                          </div>
                        </VueResizable>-->
          </div>
          <div>
            <input class="btn btn-primary mt-2" type="button" value="Ekle" @click="addItem()">
          </div>
          <div class="position-absolute bottom-0 end-0 me-2 mb-2">
            <button class="btn btn-primary me-3" @click="getItems()">Get Itemlist</button>
            <button class="btn btn-primary me-3" @click="save()">Kaydet</button>
            <input class="btn btn-primary" type="button" value="Yazdır" @click="createText()">
          </div>
          <!--          </VueDragResize>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueResizable from "vue-resizable";
import VueDragResize from 'vue-drag-resize';
import {saveAs} from 'file-saver';
import barcodeimage from "../assets/barcode.png"

export default {
  name: "barcode",
  components: {
    VueDragResize,
    VueResizable,
  },

  data() {
    return {
      barcode: barcodeimage,
      items: [],

      sayfaGenisligi: 500,
      sayfaYuksekligi: 500,
      dijitXPozisyonu: 10,
      dijitYPozisyonu: 7,
      dijitYuksekligi: 50,
      dijitModuleWidth: 800,

      labels: [],
      labelId: 0,
      selectedItemIdVal: 0,

      tempLabelWidth: 50,
      tempLabelHeight: 50,
      tempLabelName: "",
      tempLabelXpos: 0,
      tempLabelYpos: 0,
      tempLabelYatayOrDikey: "",
      tempLabelNormalOrKalin: "",

      maxW: 250,
      maxH: 250,
      minW: 50,
      minH: 50,

      visibility: false,
      event: "",
      dragArea: ".draggable",
      timestamp: "",
    };
  },
  created() {

  },
  watch: {},
  methods: {
    accessSelectedItemId(id) {
      this.selectedItemIdVal = id;
      console.log("item id: " + this.selectedItemIdVal);
    },

    dijitDragResize(newPos) {
      this.dijitYuksekligi = newPos.height;
      this.dijitModuleWidth = newPos.width;
      this.dijitXPozisyonu = newPos.left;
      this.dijitYPozisyonu = newPos.top;
    },

    labelDragResize(newPos) {
      this.labels.forEach((label) => {
        if(this.selectedItemIdVal === label.labelId){
          label.labelWidth = newPos.width;
          label.labelHeigth = newPos.height;
          label.labelX = newPos.left;
          label.labelY = newPos.top;
        }
      })
    },

    /*dragAndResize(newPos) {
      for (let i = 0; i < this.items.length; i += 1) {
        if (this.items[i].itemId === this.selectedItemIdVal) {
          this.items[i].itemWidth = newPos.width;
          this.items[i].itemHeight = newPos.height;
          this.items[i].itemYposition = newPos.top;
          this.items[i].itemXposition = newPos.left;
          this.event = newPos.eventName;
        }
      }
    },*/

    pageResize(newPos) {
      this.sayfaGenisligi = newPos.width;
      this.sayfaYuksekligi = newPos.height;
    },
    tempItemResize(newPos) {
      this.tempItemWidth = newPos.width;
      this.tempItemHeight = newPos.height;
    },

    save() {
      const pageInfo = {
        sayfaGenisligi: this.sayfaGenisligi,
        sayfaYuksekligi: this.sayfaYuksekligi,
      };
      localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('pageInfo', JSON.stringify(pageInfo));
    },

    createText() {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }

      const date = yyyy + '-' + mm + '-' + dd;
      const time = today.getHours() + ":" + today.getMinutes();
      const dateTime = date + ' ' + time;
      this.timestamp = dateTime;

      const itemlist = JSON.parse(localStorage.getItem('items'));
      const pageStats = JSON.parse(localStorage.getItem('pageInfo'));
      itemlist.push(pageStats);
      console.log(itemlist)
      /*var rtm = "";
      rtm += "sayfaGenisligi=" + pageStats.sayfaGenisligi + "\n" +
          "sayfaYüksekligi=" + pageStats.sayfaGenisligi + "\n" +
          "dijitXpozisyonu=" + itemlist[0];*/

      const blob = new Blob([JSON.stringify(itemlist)], {type: "text/plain;charset=utf-8"})
      saveAs(blob, "info.txt");

      // let blobArr = [];
      // let i=1;
      // blobArr[0] = new Blob(["Sayfa Yuksekligi: " + this.sayfaYuksekligi + "\n" +
      // "Sayfa Genisligi: " + this.sayfaGenisligi + "\n"], {type: "text/plain;charset=utf-8"});
      // this.items.forEach((item) => {
      //       blobArr[i] = new Blob([
      //         "Item Name:" + item.itemName + "\n" +
      //         "Item X pos:" + item.itemXpozisyonu + "\n" +
      //         "Item Y pos:" + item.itemYpozisyonu + "\n" +
      //         "Item Yuksekligi:" + item.itemHeight + "\n" +
      //         "Item Genisligi:" + item.itemWidth + "\n" +
      //         "Basim zamani:" + this.timestamp], {type: "text/plain;charset=utf-8"});
      //         i+=1;
      //     }
      // );
      // saveAs(blobArr, "info.txt");
    },

    isVisible() {
      this.visibility = true;
    },

    addItem() {
      if (document.getElementById('yatayRadioDefault1').checked) {
        this.tempLabelYatayOrDikey = document.getElementById('yatayRadioDefault1').value;
      } else {
        this.tempLabelYatayOrDikey = document.getElementById('dikeyRadioDefault2').value;
      }
      if (document.getElementById('normalRadioDefault3').checked) {
        this.tempLabelNormalOrKalin = document.getElementById('normalRadioDefault3').value;
      } else {
        this.tempLabelNormalOrKalin = document.getElementById('kalınRadioDefault4').value;
      }
      this.labels.push({
        labelId: 0,
        labelName: this.tempLabelName,
        labelX: this.tempLabelXpos,
        labelY: this.tempLabelYpos,
        labelHeigth: this.tempLabelHeight,
        labelWidth: this.tempLabelWidth,
        labelYatayOrDikey: this.tempLabelYatayOrDikey,
        labelNormalOrKalin: this.tempLabelNormalOrKalin,
      })
    },
  }
}
</script>

<style scoped>
.card {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: inline-block;
}

.card-2 {
  width: 608px;
  height: 365px;
  border: 1px solid #dddddd;
}

.draggable {
  cursor: crosshair;
}

.not-draggable {
  cursor: initial;
}

.resizable {
  border: 1px solid #003eff;
}

.pageClass {
  border: 1px solid red;
}

/*.container {*/
/*  width: 590px;*/
/*  height: 365px;*/
/*  border: 1px solid #dddddd;*/
/*  display: inline-block;*/
/*  background: #ffffff;*/
/*  color: #333333;*/
/*  float: left;*/
/*  margin: 10px;*/
/*}*/
</style>
