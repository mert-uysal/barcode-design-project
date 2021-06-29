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
            <VueResizable class="vueDragResize resizable"
                          :width="dijitModuleWidth" :height="dijitYuksekligi"
                          :left="dijitXPozisyonu" :top="dijitYPozisyonu"
                          :max-width="maxW" :max-height="maxH"
                          :min-width="minW" :min-height="minH"
                          :drag-selector="dragArea"
                          :fit-parent="true"
                          @resize:move="dijitDragResize" @drag:move="dijitDragResize">
              <div class="draggable"
                   v-bind:style="{width: dijitModuleWidth + 'px', height: dijitYuksekligi + 'px'}">
                <img v-if="isBarcode" :src="barcode"
                     v-bind:style="{width: dijitModuleWidth + 'px', height: dijitYuksekligi + 'px'}" alt="barcode"/>
                <img v-if="!isBarcode" :src="qrcode"
                     v-bind:style="{width: dijitModuleWidth + 'px', height: dijitYuksekligi + 'px'}" alt="qrcode"/>
                <p> X : {{ dijitXPozisyonu }} - Y : {{ dijitYPozisyonu }} </p>
                <p> W : {{ dijitModuleWidth }} - H : {{ dijitYuksekligi }}</p>
              </div>
            </VueResizable>
            <VueDragResize v-for="(label, labelIndex) in labels" :key="label.labelId"
                           class="vueDragResize resizable"
                           v-bind:class="{vertical90: label.isLabelVertical90, vertical270: label.isLabelVertical270}"
                           :w="label.labelWidth" :h="label.labelHeight"
                           :x="label.labelX" :y="label.labelY"
                           :minw="minW" :minh="minH"
                           :parentLimitation="true"
                           v-on:resizing="labelDragResizeStart(label.labelId)"
                           v-on:resizestop="labelDragResizeOnMove"
                           v-on:dragging="labelDragResizeStart(label.labelId)"
                           v-on:dragstop="labelDragResizeOnMove"
                           :isActive="true">
              <div class="position-relative draggable"
                   style="border: 1px solid #e00d0d;"
                   v-bind:style="{width: label.labelWidth + 'px', height: label.labelHeight + 'px'}">
                <span v-bind:class="{boldFont: !label.isLabelNormal, normalFont: label.isLabelNormal}">
                  {{ label.labelName }}<br>{{ label.labelContent }}
                </span>
                <div class="container position-absolute bottom-0">
                  <div class="row">
                    <div class="col">
                      <a href="#" class="action-button text-danger position-absolute start-0"
                         @click.prevent="deleteLabel(labelIndex)">
                        <i class="fa fa-trash"></i>
                      </a>
                    </div>
                    <div class="col">
                      <a class="btn-outline-secondary" href="#"  @click="changeFont(labelIndex)"
                         v-bind:class="{active: !label.isLabelNormal}">
                        <i class="fas fa-bold"></i>
                      </a>
                    </div>
                    <div class="col">
                      <a href="#" class="action-button position-absolute end-0"
                         @click="rotate(labelIndex)">
                        <i class="fas fa-redo"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </VueDragResize>
            <!--            <VueResizable v-for="(label, labelIndex) in labels" :key="label.labelId"-->
            <!--                          class="vueDragResize resizable"-->
            <!--                          v-bind:class="{vertical90: label.isLabelVertical90, vertical270: label.isLabelVertical270}"-->
            <!--                          :width="label.labelWidth" :height="label.labelHeight"-->
            <!--                          :left="label.labelX" :top="label.labelY"-->
            <!--                          :max-width="maxW" :max-height="maxH"-->
            <!--                          :min-width="minW" :min-height="minH"-->
            <!--                          :drag-selector="dragArea"-->
            <!--                          :fit-parent="true"-->
            <!--                          @resize:start="labelDragResizeStart(label.labelId)"-->
            <!--                          @resize:move="labelDragResizeOnMove"-->
            <!--                          @resize:end="labelDragResizeEnd"-->
            <!--                          @drag:start="labelDragResizeStart(label.labelId)"-->
            <!--                          @drag:move="labelDragResizeOnMove"-->
            <!--                          @drag:end="labelDragResizeEnd">-->
            <!--              <div class="draggable position-relative"-->
            <!--                   style="border: 1px solid #e00d0d;"-->
            <!--                   v-bind:style="{width: label.labelWidth + 'px', height: label.labelHeight + 'px'}">-->
            <!--                <span v-bind:class="{boldFont: !label.isLabelNormal, normalFont: label.isLabelNormal}">-->
            <!--                  {{ label.labelName }}<br>{{ label.labelContent }}-->
            <!--                </span>-->
            <!--                <a href="#" class="action-button text-danger position-absolute bottom-0 start-0"-->
            <!--                   @click.prevent="deleteLabel(labelIndex)">-->
            <!--                  <span class="fa fa-trash"></span>-->
            <!--                </a>-->
            <!--              </div>-->
            <!--            </VueResizable>-->
            <div class="position-absolute bottom-0 end-0">
              <p>page W : {{ sayfaGenisligi }} - page H : {{ sayfaYuksekligi }}</p>
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
import VueResizable from "vue-resizable";
import VueDragResize from 'vue-drag-resize';
import {saveAs} from 'file-saver';
import barcodeimage from "../assets/barcode.png"
import qrcode from "../assets/qrcode.png";

export default {
  name: "test",
  components: {
    VueDragResize,
    VueResizable,
  },
  data() {
    return {
      barcode: barcodeimage,
      qrcode: qrcode,

      sayfaGenisligi: 500,
      sayfaYuksekligi: 500,

      dijitType: "Barcode",
      dijitXPozisyonu: 0,
      dijitYPozisyonu: 0,
      dijitYuksekligi: 150,
      dijitModuleWidth: 200,

      labels: [],

      selectedLabelId: 0,

      labelId: 0,
      tempLabelName: "",
      tempLabelContent: "",
      tempLabelWidth: 50,
      tempLabelHeight: 50,
      tempLabelXpos: 0,
      tempLabelYpos: 0,
      tempLabelYatayOrDikey: "",
      tempLabelNormalOrKalin: "",

      maxW: 300,
      maxH: 200,
      minW: 10,
      minH: 10,
      dragArea: ".draggable",
      isBarcode: true,
      isNormal: true,
      isVertical90: true,
      isVertical270: false,
    };
  },
  methods: {
    pageResize(newPos) {
      this.sayfaGenisligi = newPos.width;
      this.sayfaYuksekligi = newPos.height;
    },
    changeDigitType() {
      this.isBarcode = !this.isBarcode;
      if (this.isBarcode) {
        this.dijitType = "Barcode";
      } else {
        this.dijitType = "QRCode";
      }
    },
    dijitDragResize(newPos) {
      this.dijitYuksekligi = newPos.height;
      this.dijitModuleWidth = newPos.width;
      this.dijitXPozisyonu = newPos.left;
      this.dijitYPozisyonu = newPos.top;
    },
    labelDragResizeStart(id) {
      this.selectedLabelId = id;
    },
    labelDragResizeOnMove(newPos) {
      for (let i = 0; i < this.labels.length; i += 1) {
        if (this.selectedLabelId === this.labels[i].labelId) {
          this.labels[i].labelWidth = newPos.width;
          this.labels[i].labelHeight = newPos.height;
          this.labels[i].labelX = newPos.left;
          this.labels[i].labelY = newPos.top;
        }
      }
    },
    labelDragResizeEnd(newPos) {
      for (let i = 0; i < this.labels.length; i += 1) {
        if (this.selectedLabelId === this.labels[i].labelId) {
          this.labels[i].labelWidth = newPos.width;
          this.labels[i].labelHeight = newPos.height;
          this.labels[i].labelX = newPos.left;
          this.labels[i].labelY = newPos.top;
        }
      }
    },
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
        labelRotateCounter: 0,
      });
      this.labelId += 1;
    },
    deleteLabel(labelIndex) {
      this.labels.splice(labelIndex, 1);
    },
    changeFont(labelIndex) {
      this.labels[labelIndex].isLabelNormal = !this.labels[labelIndex].isLabelNormal;
    },
    rotate(labelIndex) {
      if (this.labels[labelIndex].labelRotateCounter === 0) { // horizontal
        this.labels[labelIndex].isLabelVertical90 = false;
        this.labels[labelIndex].isLabelVertical270 = false;
        this.labels[labelIndex].labelYatayOrDikey = "Y";
        this.labels[labelIndex].labelRotateCounter += 1;
      } else if (this.labels[labelIndex].labelRotateCounter === 1) { //90
        this.labels[labelIndex].isLabelVertical90 = true;
        this.labels[labelIndex].isLabelVertical270 = false;
        this.labels[labelIndex].labelYatayOrDikey = "D";
        this.labels[labelIndex].labelRotateCounter += 1;
      } else { //270
        this.labels[labelIndex].isLabelVertical90 = false;
        this.labels[labelIndex].isLabelVertical270 = true;
        this.labels[labelIndex].labelYatayOrDikey = "D";
        this.labels[labelIndex].labelRotateCounter = 0;
      }
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
          "sayfaYüksekligi=" + this.sayfaYuksekligi + "\n" +
          "dijitType=" + this.dijitType + "\n" +
          "dijitXpozisyonu=" + this.dijitXPozisyonu + "\n" +
          "dijitYpozisyonu=" + this.dijitYPozisyonu + "\n" +
          "dijitYuksekligi=" + this.dijitYuksekligi + "\n" +
          "dijitModuleWidth=" + this.dijitModuleWidth + "\n";
      this.labels.forEach((label) => {
        rtm += label.labelName + "=" + label.labelX + "|" + label.labelY + "|" + label.labelHeight + "|" + label.labelYatayOrDikey + "|" + label.labelNormalOrKalin + "\n";
      });
      rtm += "basimZamani=" + "Basım Zamanı:" + dateTime;

      const blob = new Blob([rtm], {type: "text/plain;charset=utf-8"})
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
          "sayfaYüksekligi=" + this.sayfaYuksekligi + "\n" +
          "dijitType=" + this.dijitType + "\n" +
          "dijitXpozisyonu=" + this.dijitXPozisyonu + "\n" +
          "dijitYpozisyonu=" + this.dijitYPozisyonu + "\n" +
          "dijitYuksekligi=" + this.dijitYuksekligi + "\n" +
          "dijitModuleWidth=" + this.dijitModuleWidth + "\n";
      this.labels.forEach((label) => {
        rtm += label.labelName + "=" + label.labelX + "|" + label.labelY + "|" + label.labelHeight + "|" + label.labelYatayOrDikey + "|" + label.labelNormalOrKalin + "\n";
      });
      rtm += "basimZamani=" + "Basım Zamanı:" + dateTime;
      console.log(rtm);
    },
  }
}
</script>

<style scoped>
.vueDragResize {
  position: absolute;
}

.vueDragResize span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pageClass {
  border: 1px solid red;
}

.draggable {
  cursor: crosshair;
}

.resizable {
  border: 1px solid #003eff;
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
