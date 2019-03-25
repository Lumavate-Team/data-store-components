
import { Component, Prop, State, Element, Method } from "@stencil/core";

@Component({
  tag: 'data-store-file-util',
  styleUrl: 'data-store-file-util.scss',
  shadow: true
})
export class FileUtil {

  @Prop() header: boolean = false
  @Prop({ mutable: true }) schema
  @Element() el: HTMLElement
  parent
  cancelbtn
  headerInput
  uploadInput
  apiUrl
  @State() tableName

  @Method()
  openFileUtil(tableName, apiUrl) {
    this.tableName = tableName
    this.apiUrl = apiUrl
  }

  getCSV() {
    return fetch(this.apiUrl + this.tableName + '/batch', {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    }).then(rsp => {
      return rsp.blob()
    }).then(blob => {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = this.tableName + ".csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      this.initNotification(this.tableName + ' records downloaded')
    }).catch((err) => {
      console.error('Could not download data', err);
    })
  }

  uploadCSV(event) {
    let data = event.path[0].files[0];
    if (this.apiUrl == undefined) {
      console.log('apiUrl Undefined')
    }

    if (data) {
      let reqHeaders = new Headers({
        "Content-Type": "application/json",
      })
      fetch(this.apiUrl + this.tableName + '/batch', {
        headers: reqHeaders,
        method: 'post',
        body: data
      }).then(rsp => {
        return rsp.json()
      }).then(data => {
        this.initNotification(data.payload.data, true)
      }).catch((err) => {
        console.error('Could not load data', err);
      })
    }
  }

  clickUpload() {
    this.uploadInput.click()
  }

  cancel() {
    this.el.style.display = 'none'
    this.tableName = ''
  }

  initNotification(text, upload = false) {
    let toast = document.createElement('data-store-toast')
    if (upload) {
      toast.line1 = 'Records added: ' + text.recordsAdded
      toast.line2 = "Records modified: " + text.recordsModified
    } else {
      toast.line1 = text
    }
    this.parent.appendChild(toast)

  }


  render() {
    return (
      <div id="parent" ref={(el) => this.parent = el as HTMLElement}>
        <luma-input-text id="file-util-table" readonly="true" input-style="filled" value={this.tableName} primary-color="#244862" ref={(el) => this.headerInput = el as HTMLElement}></luma-input-text>
        <div id="container">
        <div class='close-row'>
            <i class="material-icons" onClick={() => this.cancel()} >close</i>
          </div>
          <div class='title-row'>
            <div class='title'>Import your csv file</div>
          </div>
          <div class='container-item'>
            <div class='header'>Step 1: Download your Field spreadsheet.</div>
            <div class='instructions'>Make changes and add new records to the spreadsheet</div>
            <luma-button id="export-data" text="Export Data" primary-color="#244862" onClick={() => this.getCSV()} ></luma-button>
          </div>
          <div class='container-item'>
            <div class='header'>Step 2: Import the updated spreadsheet.</div>
            <div class='instructions'>After all changes have been made re-upload for them to take affect </div>
            <luma-button id="import-data" text="Import Data" primary-color="#244862" onClick={() => this.clickUpload()}></luma-button>
          </div>
          <input id="button-input" type="file" accept=".csv" onInput={(event) => this.uploadCSV(event)} ref={(el) => this.uploadInput = el as HTMLElement} hidden />
        </div>
      </div>
    )
  }
}
