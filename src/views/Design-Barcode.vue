<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="position-relative">
          <VueDragResize class="pageClass"
                         :w="sayfaGenisligi" :h="sayfaYuksekligi"
                         :minw="300" :minh="300"
                         :parentW="700" :parentH="620" :parentLimitation="true"
                         @resizing="pageResize" :isDraggable="false" style="border: 1px solid red; position: absolute">
            <!-- barcode section -->
            <Moveable class="movable"
                      v-bind="movable"
                      @dragStart="handleDragStart(101)"
                      @drag="handleDrag"
                      @dragEnd="handleDragEnd"
                      @resizeStart="handleResizeStart(101)"
                      @resize="handleResize"
                      @rotate="handleRotate"
                      v-bind:style="{width: barcodeStats.dijitModuleWidth + 'px', height: barcodeStats.dijitYuksekligi + 'px'}">
              <div
                  v-bind:style="{width: barcodeStats.dijitModuleWidth + 'px', height: barcodeStats.dijitYuksekligi + 'px'}"
                  style="border: 1px solid #e00d0d;">
                <img v-if="isBarcode" :src="barcode"
                     v-bind:style="{width: barcodeStats.dijitModuleWidth + 'px', height: barcodeStats.dijitYuksekligi + 'px'}"/>
                <img v-if="!isBarcode" :src="qrcode"
                     v-bind:style="{width: barcodeStats.dijitModuleWidth + 'px', height: barcodeStats.dijitYuksekligi + 'px'}"/>
                W : {{ barcodeStats.dijitModuleWidth }} - H : {{ barcodeStats.dijitYuksekligi }}<br>
                X : {{ barcodeStats.dijitXPozisyonu }} - Y : {{ barcodeStats.dijitYPozisyonu }}
              </div>
            </Moveable>
            <!-- label section-->
            <Moveable v-for="(label, labelIndex) in labels" :key="label.label"
                      class="movable"
                      v-bind:class="{vertical90: label.isLabelVertical90, vertical270: label.isLabelVertical270}"
                      v-bind="movable"
                      @dragStart="handleDragStart(101)"
                      @drag="handleDrag"
                      @dragEnd="handleDragEnd"
                      @resizeStart="handleResizeStart(101)"
                      @resize="handleResize"
                      @rotate="handleRotate"
                      v-bind:style="{width: label.labelWidth + 'px', height: label.labelHeight + 'px'}">
              <div style="border: 1px solid #e00d0d;"
                   v-bind:style="{width: label.labelWidth + 'px', height: label.labelHeight + 'px'}">
                <span v-bind:class="{boldFont: !label.isLabelNormal, normalFont: label.isLabelNormal}">
                  {{ label.labelName }}<br>
                  W : {{ label.labelWidth }} - H : {{ label.labelHeight }}<br>
                  X : {{ label.labelX }} - Y : {{ label.labelY }}
                </span>
                <span>{{ label.labelContent }}</span>
                <a href="#" class="action-button text-danger position-absolute bottom-0"
                   @click.prevent="deleteLabel(labelIndex)">
                  <span class="fa fa-trash"></span>
                </a>
              </div>
            </Moveable>
            <div class="position-absolute bottom-0 end-0">
              <p>barcode label W : {{ sayfaGenisligi }} - barcode label H : {{ sayfaYuksekligi }}</p>
            </div>
          </VueDragResize>
        </div>
      </div>
      <div class="col">
        <div class="container position-relative" style="border: 1px solid #dddddd;">
          <div class="ms-4 me-4">
            <input class="form-control mb-2 mt-2" type="text" placeholder="Label Name" v-model="tempLabelName">
            <input class="form-control" type="text" placeholder="Label Content" v-model="tempLabelContent">
            <div>
              <input value="Yatay" class="form-check-input" type="radio" name="flexRadioDefault"
                     id="yatayRadioDefault1" checked>
              <label class="form-check-label me-2" for="yatayRadioDefault1">
                Yatay
              </label>
              <input value="Dikey" class="form-check-input ms-1" type="radio" name="flexRadioDefault"
                     id="dikeyRadioDefault90">
              <label class="form-check-label" for="dikeyRadioDefault90">
                Dikey 90°
              </label>
              <input value="Dikey" class="form-check-input ms-1" type="radio" name="flexRadioDefault"
                     id="dikeyRadioDefault270">
              <label class="form-check-label" for="dikeyRadioDefault270">
                Dikey 270°
              </label>
            </div>
            <div>
              <input value="Normal" class="form-check-input" type="radio" name="flexRadioDefault2"
                     id="normalRadioDefault3" checked>
              <label class="form-check-label me-2" for="normalRadioDefault3">
                Normal
              </label>
              <input value="Kalın" class="form-check-input" type="radio" name="flexRadioDefault2"
                     id="kalinRadioDefault4">
              <label class="form-check-label" for="kalinRadioDefault4">
                Kalın
              </label>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button class="d-block btn btn-primary d-inline mb-2" @click="changeDigitType()">
                Use Barcode/QR
              </button>
              <button class="d-block btn btn-primary mb-2" @click="showHideOrigin()">
                Show/Hide Origin
              </button>
            </div>
            <div class="col">
              <input class="btn btn-primary mt-3 align-self-center" type="button" value="Ekle" @click="addLabel()">
            </div>
            <div class="col mt-3">
              <button class="d-inline align-self-center btn btn-primary me-2" @click="getItems()">Get Itemlist</button>
              <button class="d-inline align-self-center btn btn-primary me-2" @click="createText()">Yazdır</button>
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
        origin: true,
        keepRatio: false,
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
    showHideOrigin() {
      this.movable.origin = !this.movable.origin;
    },
    handleDragStart(id) {
      this.selectedLabelId = id;
      console.log(id);
    },
    handleDrag(newTransformedObj) { // x - y
      newTransformedObj.target.style.transform = newTransformedObj.transform;
    },
    handleDragEnd(obj) {
      if (this.selectedLabelId === 101) {
        this.barcodeStats.dijitXPozisyonu += obj.lastEvent.left;
        this.barcodeStats.dijitYPozisyonu += obj.lastEvent.top;
      } else {
        for (let i = 0; i < this.labels.length; i += 1) {
          if (this.selectedLabelId === this.labels[i].labelId) {
            this.labels[i].labelX += obj.lastEvent.left;
            this.labels[i].labelY += obj.lastEvent.top;
          }
        }
      }
      console.log(obj.lastEvent.left);
      console.log(obj.lastEvent.top);
    },
    handleResizeStart(id) {
      this.selectedLabelId = id;
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
    handleRotate(newTransformedObj) {
      newTransformedObj.target.style.transform = newTransformedObj.transform;
    },
    // handleScale(newTransformedObj) {
    //   console.log(newTransformedObj)
    //   newTransformedObj.target.style.transform = newTransformedObj.transform;
    // },

    addLabel() {
      if (document.getElementById('yatayRadioDefault1').checked) {
        this.tempLabelYatayOrDikey = "Y";
        this.isVertical90 = false;
        this.isVertical270 = false;
      } else {
        this.tempLabelYatayOrDikey = "D";
        if (document.getElementById('dikeyRadioDefault90').checked) {
          this.isVertical90 = true;
          this.isVertical270 = false;
        } else {
          this.isVertical270 = true;
          this.isVertical90 = false;
        }
      }
      if (document.getElementById('normalRadioDefault3').checked) {
        this.tempLabelNormalOrKalin = "N";
        this.isNormal = true;
      } else {
        this.tempLabelNormalOrKalin = "K";
        this.isNormal = false;
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
        isLabelNormal: this.isNormal,
        isLabelVertical90: this.isVertical90,
        isLabelVertical270: this.isVertical270,
      });
      this.labelId += 1;
    },
    deleteLabel(labelIndex) {
      this.labels.splice(labelIndex, 1);
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
          "dijitType=" + this.barcodeStats.dijitType + "\n" +
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
          "dijitType=" + this.barcodeStats.dijitType + "\n" +
          "dijitXpozisyonu=" + this.barcodeStats.dijitXPozisyonu + "\n" +
          "dijitYpozisyonu=" + this.barcodeStats.dijitYPozisyonu + "\n" +
          "dijitYuksekligi=" + this.barcodeStats.dijitYuksekligi + "\n" +
          "dijitModuleWidth=" + this.barcodeStats.dijitModuleWidth + "\n";
      this.labels.forEach((label) => {
        rtm += label.labelName + "=" + label.labelX + "|" + label.labelY + "|" + label.labelHeight + "|" + label.labelYatayOrDikey + "|" + label.labelNormalOrKalin + "\n";
      });
      rtm += "basimZamani=" + "Basım Zamanı:" + dateTime;
      console.log("labels: " + this.labels);
      console.log(rtm);
    },
  }
}
</script>

<style>

/*
html,
body {
  position: relative;
  margin: 0;
  padding: 0;
  height: 100%;
  letter-spacing: 1px;
}


.page {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}*/

/*.container {*/
/*  !*position: relative;*!*/
/*  top: 50%;*/
/*  left: 50%;*/
/*  transform: translate(-50%, -50%);*/
/*}*/

.movable {
  /*display: block;*/
  text-align: center;
  margin: 0 auto;
  position: absolute;
}

.movable span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.movable div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
