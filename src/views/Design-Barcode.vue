<template>
  <div class="page container-fluid">
    <div class="row">
      <div class="col">
        <div class="position-relative">
          <VueDragResize class="pageClass"
                         :w="sayfaGenisligi" :h="sayfaYuksekligi"
                         :minw="300" :minh="300"
                         :parentW="700" :parentH="620" :parentLimitation="true"
                         @resizing="pageResize" :isDraggable="false" style="border: 1px solid red; position: absolute">
            <Moveable class="movable"
                      v-bind="movable"
                      @drag="handleDrag"
                      @resize="handleResize"
                      @scale="handleScale"
                      @rotate="handleRotate"
                      @click="handleClick">
                <img v-if="isBarcode" :src="barcode" :width="barcodeStats.dijitModuleWidth"
                     :height="barcodeStats.dijitYuksekligi" @click="getSelectedLabelId(101)"/>
                <img v-if="!isBarcode" :src="qrcode" :width="barcodeStats.dijitModuleWidth"
                     :height="barcodeStats.dijitYuksekligi" @click="getSelectedLabelId(101)"/>
            </Moveable>
            <div v-for="(label, labelIndex) in labels" :key="label.label"
                 :width="label.labelWidth" :height="label.labelHeight" class="movable"  v-bind:id="`${label.labelId}`">
              <Moveable class="movable"
                        v-bind:class="{vertical90: isVertical90, vertical270: isVertical270,
                        boldFont: !isNormal, normalFont: isNormal}"
                        v-bind="movable"
                        @drag="handleDrag"
                        @resize="handleResize"
                        @scale="handleScale"
                        @rotate="handleRotate"
                        @click="handleClick"
                       >
                <div class="position-relative mt-1" @click="getSelectedLabelId(label.labelId)"
                     style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                  <div>{{ label.labelName }}</div>
                  <div v-bind:class="{boldFont: !isNormal, normalFont: isNormal}">{{ label.labelContent }}</div>
                  <a href="#" class="action-button text-danger" @click.prevent="deleteLabel(labelIndex)">
                    <span class="fa fa-trash"></span>
                  </a>
                </div>
              </Moveable>
            </div>
            <div class="position-absolute bottom-0 end-0">
              <p>barcode label W : {{ sayfaGenisligi }} - barcode label H : {{ sayfaYuksekligi }}</p>
            </div>
          </VueDragResize>
        </div>
      </div>
      <div class="col">
        <div class="container position-relative" style="border: 1px solid #dddddd;">
          <div class="card-2 ms-4">
            <div>
              <input class="form-control mb-2 mt-2" type="text" placeholder="Label Name" v-model="tempLabelName">
              <input class="form-control" type="text" placeholder="Label Content" v-model="tempLabelContent">
              <div>
                <input value="Yatay" class="form-check-input" type="radio" name="flexRadioDefault"
                       id="yatayRadioDefault1">
                <label class="form-check-label me-2" for="yatayRadioDefault1">
                  Yatay
                </label>
                <input value="Dikey" class="form-check-input ms-1" type="radio" name="flexRadioDefault"
                       id="dikeyRadioDefault90" checked>
                <label class="form-check-label" for="dikeyRadioDefault90">
                  Dikey 90°
                </label>
                <input value="Dikey" class="form-check-input ms-1" type="radio" name="flexRadioDefault"
                       id="dikeyRadioDefault270" checked>
                <label class="form-check-label" for="dikeyRadioDefault270">
                  Dikey 270°
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
            <input class="btn btn-primary mt-2 mb-2" type="button" value="Ekle" @click="addLabel()">
            <div class="position-absolute bottom-0 end-1 me-2 mb-2">
              <button class="btn btn-primary me-3" @click="changeDigitType()">Use Barcode/QR</button>
            </div>
            <div class="position-absolute bottom-0 end-0 me-2 mb-2">
              <button class="btn btn-primary me-3" @click="getItems()">Get Itemlist</button>
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
import qrcode from "../assets/qrcode.png";
import {saveAs} from 'file-saver';

export default {
  name: 'Design-Barcode',
  components: {
    Moveable,
    VueDragResize,
  },

  data() {
    return {
      barcode: barcodeimage,
      qrcode: qrcode,
      sayfaGenisligi: 500,
      sayfaYuksekligi: 500,
      movable: {
        draggable: true,
        scalable: false,
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
        dijitType: "Barcode",
        dijitXPozisyonu: 0,
        dijitYPozisyonu: 0,
        dijitYuksekligi: 200,
        dijitModuleWidth: 300,
      },
      tempDigitType: "",
      selectedLabelId: 999,
      labels: [],
      labelId: 1,
      tempLabelWidth: 100,
      tempLabelHeight: 100,
      tempLabelName: "",
      tempLabelContent: "",
      tempLabelXpos: 0,
      tempLabelYpos: 0,
      tempLabelYatayOrDikey: "undefined",
      tempLabelNormalOrKalin: "undefined",
      isBarcode: true,
      isVertical90: true,
      isVertical270: true,
      isNormal: true,
    }
  },
  watch: {
    watchSelectedDigitType() {
      if (this.isBarcode) {
        this.barcodeStats.dijitType = "Barcode";
      } else {
        this.barcodeStats.dijitType = "QRCode";
      }
    }
  },
  methods: {
    pageResize(newPos) {
      this.sayfaGenisligi = newPos.width;
      this.sayfaYuksekligi = newPos.height;
    },
    changeDigitType() {
      this.isBarcode = !this.isBarcode;
      if (this.isBarcode) {
        this.barcodeStats.dijitType = "Barcode";
      } else {
        this.barcodeStats.dijitType = "QRCode";
      }
    },
    handleClick(obj) {
      obj.target.style.transform = obj.transform;
    },
    handleDrag(newTransformedObj,) { // x - y
      if (this.selectedLabelId === 101) {
        this.barcodeStats.dijitXPozisyonu = newTransformedObj.left;
        this.barcodeStats.dijitYPozisyonu = newTransformedObj.top;
      } else {
        for (let i = 0; i < this.labels.length; i += 1) {
          if (this.selectedLabelId === this.labels[i].labelId) {
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
      } else {
        for (let i = 0; i < this.labels.length; i += 1) {
          if (this.selectedLabelId === this.labels[i].labelId) {
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
        this.tempLabelNormalOrKalin = "K";
      }
      this.labels.push({
        labelId: this.labelId,
        labelName: this.tempLabelName,
        labelContent: this.tempLabelContent,
        labelX: this.tempLabelXpos,
        labelY: this.tempLabelYpos,
        labelHeight: this.tempLabelHeight,
        labelWidth: this.tempLabelWidth,
        labelYatayOrDikey: this.tempLabelYatayOrDikey,
        labelNormalOrKalin: this.tempLabelNormalOrKalin,
      })
      this.labelId += 1;
      this.checkLabelProperties();
    },
    deleteLabel(labelIndex) {
      this.labels.splice(labelIndex,1);
    },

    checkLabelProperties() {
      if (this.tempLabelYatayOrDikey === "D") {
        if (document.getElementById('dikeyRadioDefault90').checked) {
          this.isVertical90 = true;
          this.isVertical270 = false;
        } else {
          this.isVertical270 = true;
          this.isVertical90 = false;
        }
      } else {
        this.isVertical90 = false;
        this.isVertical270 = false;
      }
      if (document.getElementById('normalRadioDefault3').checked) {
        this.isNormal = true
      } else {
        this.isNormal = false;
      }
    },
    getItems() {
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
          "dijitType=" + this.barcode.dijitType + "\n" +
          "dijitXpozisyonu=" + this.barcodeStats.dijitXPozisyonu + "\n" +
          "dijitYpozisyonu=" + this.barcodeStats.dijitYPozisyonu + "\n" +
          "dijitYuksekligi=" + this.barcodeStats.dijitYuksekligi + "\n" +
          "dijitModuleWidth=" + this.barcodeStats.dijitModuleWidth + "\n";
      this.labels.forEach((label) => {
        rtm += label.labelName + "=" + label.labelX + "|" + label.labelY + "|" + label.labelHeight + "|" + label.labelYatayOrDikey + "|" + label.labelNormalOrKalin + "\n";
      });
      rtm += "basimZamani=" + "Basım Zamanı:" + dateTime;
      console.log(this.labels);
      console.log(rtm);
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
          "dijitType=" + this.barcode.dijitType + "\n" +
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
/*
html,
body {
  position: relative;
  margin: 0;
  padding: 0;
  height: 100%;
  letter-spacing: 1px;
}
*/

.page {
  position: relative;
  width: 100%;
  height: 100%;
  /*box-sizing: border-box;*/
}

.container {
  /*position: relative;*/
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.movable {
  width: 50%;
  height: 50%;
  margin-right: auto;
  margin-left: auto;
  /*position: relative;*/
  display: block;
  position: absolute;
}

.boldFont {
  font-weight: bold;
}

.normalFont {
  font-weight: normal;
}

.vertical270 {
  transform: rotate(270deg);
}

.vertical90 {
  transform: rotate(90deg);
}
</style>
