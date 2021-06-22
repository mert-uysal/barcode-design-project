<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="position-relative">
          <VueDragResize class="pageClass"
                         :w="sayfaGenisligi" :h="sayfaYuksekligi"
                         :minw="300" :minh="300"
                         :parentW="700" :parentH="620" :parentLimitation="true"
                         @resizing="pageResize" :isDraggable="false">
            <Moveable class="movable"
                      v-bind="movable"
                      @drag="handleDrag"
                      @resize="handleResize"
                      @scale="handleScale"
                      @rotate="handleRotate">
              <div>
              <img :src="barcode" :width="barcodeStats.dijitModuleWidth" :height="barcodeStats.dijitYuksekligi"
                   @click="getSelectedLabelId(101)"/></div>
            </Moveable>
            <Moveable class="movableLabels"
                      v-for="label in labels" :key="label.labelId"
                      v-bind="movable"
                      @drag="handleDrag"
                      @resize="handleResize"
                      @scale="handleScale"
                      @rotate="handleRotate">
              <span @click="getSelectedLabelId(label.labelId)">{{ label.labelName }}</span>
            </Moveable>
            <div class="position-absolute bottom-0 end-0">
              <p>page W : {{ sayfaGenisligi }} - page H : {{ sayfaYuksekligi }}</p>
            </div>
          </VueDragResize>
        </div>
      </div>
      <div class="col">
        <div class="container position-relative">
          <div class="card-2 ms-4">
            <div>
              <input class="form-control" type="text" placeholder="Label Name" v-model="tempLabelName">
              <div>
                <input value="Yatay" class="form-check-input" type="radio" name="flexRadioDefault"
                       id="yatayRadioDefault1">
                <label class="form-check-label me-2" for="yatayRadioDefault1">
                  Yatay
                </label>
                <input value="Dikey" class="form-check-input ms-1" type="radio" name="flexRadioDefault"
                       id="dikeyRadioDefault2" checked>
                <label class="form-check-label" for="dikeyRadioDefault2">
                  Dikey
                </label>
              </div>
              <div>
                <input value="Normal" class="form-check-input" type="radio" name="flexRadioDefault2"
                       id="normalRadioDefault3">
                <label class="form-check-label me-2" for="normalRadioDefault3">
                  Normal
                </label>
                <input value="Kalın" class="form-check-input" type="radio" name="flexRadioDefault2"
                       id="kalinRadioDefault4" checked>
                <label class="form-check-label" for="kalinRadioDefault4">
                  Kalın
                </label>
              </div>
            </div>
            <input class="btn btn-primary mt-2" type="button" value="Ekle" @click="addLabel()">
            <div class="position-absolute bottom-0 end-0 me-2 mb-2">
              <button class="btn btn-primary me-3" @click="getItems()">Get Itemlist</button>
              <!--            <button class="btn btn-primary me-3" @click="save()">Kaydet</button>-->
              <input class="btn btn-primary" type="button" value="Yazdır" @click="createText()">
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Moveable from "vue-moveable";
import VueDragResize from 'vue-drag-resize';
import barcodeimage from "../assets/barcode.png";
import {saveAs} from 'file-saver';

export default {
  name: 'Test',
  components: {
    Moveable,
    VueDragResize,
  },

  data() {
    return {
      barcode: barcodeimage,
      sayfaGenisligi: 500,
      sayfaYuksekligi: 500,
      movable: {
        draggable: true,
        scalable: true,
        resizable: true,
        throttleScale: 0.01,
        rotatable: true,
        throttleRotate: 0.2,
        origin: false,
        keepRatio: false,
        snappable: true,
      },
      barcodeId: 101,
      barcodeStats: {
        dijitXPozisyonu: 0,
        dijitYPozisyonu: 0,
        dijitYuksekligi: 200,
        dijitModuleWidth: 300,
      },
      selectedLabelId: 999,
      labels: [],
      labelId: 0,
      tempLabelWidth: 50,
      tempLabelHeight: 500,
      tempLabelName: "",
      tempLabelXpos: 0,
      tempLabelYpos: 0,
      tempLabelYatayOrDikey: "",
      tempLabelNormalOrKalin: "",
    }
  },

  methods: {
    pageResize(newPos) {
      this.sayfaGenisligi = newPos.width;
      this.sayfaYuksekligi = newPos.height;
    },
    handleDrag(newTransformedObj,) { // x - y
      if (this.selectedLabelId === 101) {
        this.barcodeStats.dijitXPozisyonu = newTransformedObj.left;
        this.barcodeStats.dijitYPozisyonu = newTransformedObj.top;
      }
      else {
        for(let i=0;i<this.labels.length;i+=1){
          if(this.selectedLabelId === this.labels[i].labelId){
            this.labels[i].labelX = newTransformedObj.left;
            this.labels[i].labelY = newTransformedObj.top;
          }
        }
      }
      newTransformedObj.target.style.transform = newTransformedObj.transform;
    },
    handleResize(newTransformedObj) { //w - h
      if (this.selectedLabelId === 101) {
        this.barcodeStats.dijitModuleWidth = newTransformedObj.width;
        this.barcodeStats.dijitYuksekligi = newTransformedObj.height;
      }
      else {
        for(let i=0;i<this.labels.length;i+=1){
          if(this.selectedLabelId === this.labels[i].labelId){
            this.labels[i].labelWidth = newTransformedObj.width;
            this.labels[i].labelHeight = newTransformedObj.height;
          }
        }
      }
      newTransformedObj.target.style.width = `${newTransformedObj.width}px`;
      newTransformedObj.target.style.height = `${newTransformedObj.height}px`;
    },
    handleScale(newTransformedObj) {
      console.log(newTransformedObj)
      newTransformedObj.target.style.transform = newTransformedObj.transform;
    },
    handleRotate(newTransformedObj) {
      newTransformedObj.target.style.transform = newTransformedObj.transform;
    },

    addLabel() {
      if (document.getElementById('yatayRadioDefault1').checked) {
        this.tempLabelYatayOrDikey = "Y";
      } else {
        this.tempLabelYatayOrDikey = "D";
      }
      if (document.getElementById('normalRadioDefault3').checked) {
        this.tempLabelNormalOrKalin = "N";
      } else {
        this.tempLabelNormalOrKalin = "Y";
      }
      this.labels.push({
        labelId: this.labelId,
        labelName: this.tempLabelName,
        labelX: this.tempLabelXpos,
        labelY: this.tempLabelYpos,
        labelHeight: this.tempLabelHeight,
        labelWidth: this.tempLabelWidth,
        labelYatayOrDikey: this.tempLabelYatayOrDikey,
        labelNormalOrKalin: this.tempLabelNormalOrKalin,
      })
      this.labelId += 1;
    },
    getItems() {
      console.log(this.labels);
    },
    getSelectedLabelId(id) {
      this.selectedLabelId = id;
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

      var rtm = "sayfaGenisligi=" + this.sayfaGenisligi + "\n" +
          "sayfaYüksekligi=" + this.sayfaGenisligi + "\n" +
          "dijitXpozisyonu=" + this.barcodeStats.dijitXPozisyonu + "\n" +
          "dijitYpozisyonu=" + this.barcodeStats.dijitYPozisyonu + "\n" +
          "dijitYuksekligi=" + this.barcodeStats.dijitYuksekligi + "\n" +
          "dijitModuleWidth=" + this.barcodeStats.dijitModuleWidth + "\n";
      this.labels.forEach((label) => {
        rtm += label.labelName + "=" + label.labelX + "|" + label.labelY + "|" + label.labelHeight + "|" + label.labelYatayOrDikey + "|" + label.labelNormalOrKalin + "\n";
      });
      rtm += "basimZamani=" + "Basım Zamanı:" + dateTime;

      const blob = new Blob([rtm], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "info.txt");
    }
  }
}
</script>

<style scoped>
.container {
  border: 1px solid #dddddd;
  width: 654px;
  height: 485px;
}

.pageClass {
  border: 1px solid red;
}

.movable {
  position: relative;
  width: 300px;
  height: 200px;
}

.movableLabels {
  font-family: "Roboto", sans-serif;
  width: 150px;
  height: 150px;
  font-size: 40px;
  margin: auto;
  text-align: center;
  /*position: relative;
  text-align: center;
  font-weight: 100;
  letter-spacing: 1px;*/
}

.draggable {
  cursor: crosshair;
}

.resizable {
  border: 1px solid #003eff;
}
</style>
