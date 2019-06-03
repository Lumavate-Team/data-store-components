
import { Component, Prop, State, Element, Event, EventEmitter, Method, Listen } from "@stencil/core";

@Component({
  tag: 'data-store-edit-schema',
  styleUrl: 'data-store-edit-schema.scss',
  shadow: true
})
export class EditSchema {

  parent
  repeaterOldColumns
  repeaterNewColumns
  cancelbtn
  savebtn
  headerInput
  addbtn
  selectMenu
  optionsInput
  invalidInput = false
  url = '/ic/data-store/manage/'
  body
  oldColumnOffset

  @Element() el: HTMLElement

  @State() tableName
  @State() columns = [{ 'columnName': '', 'type': '', 'devName': '', 'options': '', 'active': true, newColumn: true }]

  @Prop() header: boolean = false
  @Prop({ mutable: true }) schema

  @Event({ eventName: 'update', composed: true, bubbles: true, cancelable: false }) addSchemaEvent: EventEmitter

  componentWillLoad() {
    this.body = document.querySelector('body')
  }

  componentWillUpdate() {
    this.headerInput.shadowRoot.querySelector('#input_edit-schema-header').pattern = '^[a-zA-Z1-9-]+$'
  }

  @Listen('lumaInput')
  handleInput(event) {
    if (event.srcElement.tagName == 'DATA-STORE-EDIT-SCHEMA') {
      let inputElId = event.detail.lumaElement.id
      if (inputElId == 'edit-schema-header') {
        this.tableName = event.detail.value
      } else {
        let repeaterId = event.path[4].id
        let lumaRowIndex = parseInt(event.path[0].getAttribute('luma-row-index'))
        let rowKey = event.path[0].getAttribute('row-key')
        if (repeaterId == 'edit-schema-repeater-old') {
          this.columns[lumaRowIndex][rowKey] = event.detail.value
          if (rowKey == 'columnName') {
            this.repeaterOldColumns.getItem(lumaRowIndex).then((rsp) => {
              let devNameInput = rsp.rowEl.children[2]
              if (this.columns[lumaRowIndex]['newColumn'] == true) {
                devNameInput.value = this.camelCase(event.detail.value)
                this.columns[lumaRowIndex]['devName'] = this.camelCase(event.detail.value)
              }
            })
          }
        } else {
          this.columns[lumaRowIndex + this.oldColumnOffset][rowKey] = event.detail.value
          if (rowKey == 'columnName') {
            this.repeaterNewColumns.getItem(lumaRowIndex).then((rsp) => {
              let devNameInput = rsp.rowEl.children[2]
              if (this.columns[lumaRowIndex + this.oldColumnOffset]['newColumn'] == true) {
                devNameInput.value = this.camelCase(event.detail.value)
                this.columns[lumaRowIndex + this.oldColumnOffset]['devName'] = this.camelCase(event.detail.value)
              }
            })
          }
        }
      }
    }
  }

  @Listen('lumaChange')
  handleChange(event) {
    let repeaterId = event.path[4].id
    if (event.srcElement.tagName == 'DATA-STORE-EDIT-SCHEMA') {
      let lumaRowIndex = parseInt(event.path[0].getAttribute('luma-row-index'))
      let rowKey = event.path[0].getAttribute('row-key')
      if (rowKey == 'type') {
        let optionsInput = null
        if (repeaterId == 'edit-schema-repeater-old') {
          this.columns[lumaRowIndex][rowKey] = event.detail.value
          if (event.detail.value == 'Dropdown') {
            this.repeaterOldColumns.getItem(lumaRowIndex).then((rsp) => {
              optionsInput = rsp.rowEl.children[3]
              optionsInput.disabled = false
              optionsInput.required = true
              optionsInput.placeholder = 'Options'
            })
          } else {
            this.repeaterOldColumns.getItem(lumaRowIndex).then((rsp) => {
              optionsInput = rsp.rowEl.children[3]
              optionsInput.value = ''
              optionsInput.disabled = true
              optionsInput.required = false
              optionsInput.placeholder = ''
              this.columns[lumaRowIndex]['options'] = ''
              setTimeout(() => {
                optionsInput.getInputData()
              }, 25);
            })
          }
        } else {
          this.columns[lumaRowIndex + this.oldColumnOffset][rowKey] = event.detail.value
          if (event.detail.value == 'Dropdown') {
            this.repeaterNewColumns.getItem(lumaRowIndex).then((rsp) => {
              optionsInput = rsp.rowEl.children[3]
              optionsInput.disabled = false
              optionsInput.required = true
              optionsInput.placeholder = 'Options'
            })
          } else {
            this.repeaterNewColumns.getItem(lumaRowIndex).then((rsp) => {
              optionsInput = rsp.rowEl.children[3]
              optionsInput.value = ''
              optionsInput.disabled = true
              optionsInput.required = false
              optionsInput.placeholder = ''
              this.columns[lumaRowIndex]['options'] = ''
              setTimeout(() => {
                optionsInput.getInputData()
              }, 25);
            })
          }
        }
      }
      if (rowKey == 'active') {
        this.columns[lumaRowIndex][rowKey] = event.detail.value
      }
    }
  }

  @Listen('lumaClick')
  handleClick(event) {
    if (event.detail.element.id == 'button_delete-row') {
      this.columns.splice(event.detail.rowIndex + this.oldColumnOffset, 1)
      let newColumns = this.columns.filter((_, index) => index > this.oldColumnOffset - 1)
      this.repeaterNewColumns.setData(newColumns)
      if (this.columns.length == this.oldColumnOffset) {
        this.repeaterNewColumns.style.display = 'none'
      }
    }
  }

  @Method()
  updateColumns(tableName, columns) {
    this.cancelbtn.style.width = ''
    this.cancelbtn.style.paddingRight = '10px'
    this.savebtn.style.width = ''
    this.addbtn.style.width = ''
    this.headerInput.style.width = '100%'
    this.repeaterOldColumns.style.width = '100%'
    this.repeaterNewColumns.style.display = 'none'
    this.tableName = tableName
    this.columns = columns
    this.oldColumnOffset = this.columns.length
    this.columns.forEach((column) => {
      this.repeaterOldColumns.addItem(column)
    })
  }

  addColumn() {
    this.columns = [...this.columns, { columnName: '', type: '', devName: '', options: '', 'active': true, newColumn: true }]
    this.repeaterNewColumns.addItem({ columnName: '', 'type': '', 'devName': '', 'options': '', 'active': true, newColumn: true })
    this.repeaterNewColumns.style.display = 'inline'
  }
  camelCase(str) {
    return str.replace(/[-]/g, ' ') // convert hyphens to spaces
      .replace(/\s[a-z]/g, this.upperCase)//uppercase first letter of words
      .replace(/\s+/g, '') // remove spaces
      .replace(/^[A-Z]/g, this.lowerCase)// lowercase first letter
  }

  upperCase(str) {
    return str.toUpperCase()
  }

  lowerCase(str) {
    return str.toLowerCase()
  }

  handleHeaderInput(event) {
    this.tableName = event.target.value
  }
  cancel() {
    this.el.style.display = 'none'
    this.columns = []
    this.repeaterOldColumns.setData(this.columns)
    this.repeaterNewColumns.setData(this.columns)
    this.tableName = ''
  }

  getAuthToken() {
    var cookies = document.cookie.split(";")
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i].split("=")
      if (cookie[0].trim() == "pwa_jwt") {
        return cookie[1].trim()
      }
    }
  }

  checkOldInputs() {
    let self = this
    self.invalidInput = false
    this.headerInput.getInputData().then(r => {
      if (r.isValid == false) {
        self.invalidInput = true
      }
    })
    return new Promise((resolve) => {
      let promises = []
      for (let index = 0; index < self.oldColumnOffset; index++) {
        promises.push(self.repeaterOldColumns.getItem(index))
      }
      return Promise.all(promises).then(rsp => {
        let childPromises = []
        rsp.forEach((row) => {
          row.rowEl.childNodes.forEach((child) => {
            childPromises.push(child.getInputData())
          })
        })
        return Promise.all(childPromises);
      }).then(r => {
        r.forEach(inputField => {
          if (inputField.isValid == false) {
            self.invalidInput = true
          }
        })
        resolve()
      })
    })
  }

  checkNewInputs() {
    let self = this
    self.invalidInput = false

    if (this.columns.length != this.oldColumnOffset) {
      return new Promise((resolve) => {
        let promises = []
        for (let index = 0; index < self.columns.length - self.oldColumnOffset; index++) {
          promises.push(self.repeaterNewColumns.getItem(index))
        }
        return Promise.all(promises).then(rsp => {
          let childPromises = []
          rsp.forEach((row) => {
            row.rowEl.childNodes.forEach((child) => {
              childPromises.push(child.getInputData())
            })
          })
          return Promise.all(childPromises);
        }).then(r => {
          r.forEach(inputField => {
            if (inputField.isValid == false) {
              self.invalidInput = true
            }
          })
          resolve()
        })
      })
    } else {
      return new Promise((resolve) => {
        resolve()
      })
    }
  }

  saveTable() {
    let reqHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.getAuthToken()
    })

    this.checkOldInputs().then(() => {
      this.checkNewInputs().then(() => {
        if (this.invalidInput) { } else {
          return fetch(this.url + this.tableName + '/schema', {
            headers: reqHeaders,
            method: 'put',
            body: JSON.stringify(this.columns)
          }).then(rsp => {
            return rsp.json()
          }).then((r) => {
            if (r.error) {
              this.initNotification(r.error)
            } else {
              this.addSchemaEvent.emit(this.tableName)
              this.cancel()
            }
          }).catch((err) => {
            console.error('Failed to add schema to table', err);
          })
        }
      })
    }
    )
  }

  initNotification(text) {
    let toast = document.createElement('data-store-toast')
    toast.error = true
    toast.line1 = text
    this.body.appendChild(toast)
  }

  render() {
    let templateExistingRows = `
      <luma-input-text id="columnName" row-key="columnName" class="edit-schema-row-item" primary-color="#244862" placeholder="Column Name" input-style="filled" value={columnName} required></luma-input-text>
      <luma-select id="type" row-key="type" class="edit-schema-row-item" primary-color="#244862" option-csv="Text,Numeric,Dropdown,Image" selected-value={type} placeholder="Select Type" select-style="filled" required></luma-select>
      <luma-input-text id="devName" row-key="devName" class="edit-schema-row-item" primary-color="#244862" placeholder="Dev Name" input-style="filled" value={devName} readonly="true"></luma-input-text>
      <luma-input-text id="options" row-key="options" class="edit-schema-row-item" primary-color="#244862" pattern='^[a-zA-Z0-9-]+(,[a-zA-Z0-9-]+)*$' input-style="filled" value={options} disabled="true"></luma-input-text>
      <luma-toggle id='column-toggle' class='column-toggle' row-key="active" secondary-color='#244862' value={active} ></luma-toggle>`

    let templateNewRows = `
      <luma-input-text id="columnName" row-key="columnName" class="edit-schema-row-item" primary-color="#244862" placeholder="Column Name" input-style="filled" value={columnName} required></luma-input-text>
      <luma-select id="type" row-key="type" class="edit-schema-row-item" primary-color="#244862" option-csv="Text,Numeric,Dropdown,Image" selected-value={type} placeholder="Select Type" select-style="filled" required></luma-select>
      <luma-input-text id="devName" row-key="devName" class="edit-schema-row-item" primary-color="#244862" placeholder="Dev Name" input-style="filled" value={devName} readonly="true"></luma-input-text>
      <luma-input-text id="options" row-key="options" class="edit-schema-row-item" primary-color="#244862" pattern='^[a-zA-Z0-9-]+(,[a-zA-Z0-9-]+)*$' input-style="filled" value={options} disabled="true"></luma-input-text>
      <luma-button id="delete-row" class='delete-row' icon="remove_circle_outline" button-type="flat" primary-color="#f7f7f7"></luma-button>`
    let styles = `
    .edit-schema-row-item{
      padding-right: 32px;
      font-family: 'Roboto', sans-serif;
    }

    .options{
      padding-right: 10px;
      font-family: 'Roboto', sans-serif;
    }

    .mdc-list{
      margin: 0px;
      padding: 0px;
      width: 100%;
    }
    .mdc-list-item{
      margin: 0px;
      padding: 0px;
    }

    .mdc-list .mdc-list-item{
      height: auto;
      padding:0px;
    }

    #column-toggle{
      width: unset !important;
      padding-top: 33px;
      padding-right: 9px;
    }

    :host .repeater-item{
      height: 100px;
      padding:0px;
      margin: 5px;
      display:flex;
    }

    :host{
      height: unset;
      overflow-x: unset;
      overflow-y: unset;
    }

    .row-toggle{
      display:flex;
      flex-direction: column;
      align-items:center;
      justify-content: flex-start;
      width: 75px;
      height:75px;
    }

    .repeater{
      width:100%;
      background-color: #f7f7f7;
    }

    .test{
      width: 45px;
    }

    .delete-row{
      min-width:unset;
      padding-top: 30px;
    }
    `

    return (
      <div id="parent" ref={(el) => this.parent = el as HTMLElement}>
        <div id='wrapper'>
          <luma-input-text id="edit-schema-header" class="edit-schema-header" readonly="true" input-style="filled" value={this.tableName} primary-color="#244862" ref={(el) => this.headerInput = el as HTMLElement}></luma-input-text>
          <div class='repeater-overflow'>
            <luma-repeater id="edit-schema-repeater-old" class="row-container" template={templateExistingRows} template-css-classes={styles} ref={(el) => this.repeaterOldColumns = el as HTMLElement}></luma-repeater>
            <luma-repeater id="edit-schema-repeater-new" class="row-container" template={templateNewRows} template-css-classes={styles} template-no-data='' ref={(el) => this.repeaterNewColumns = el as HTMLElement}></luma-repeater>
          </div>
          <div>
            <luma-button id="add-row" class='add-row' text="Add" icon="control_point" button-type="flat" primary-color="#FFF" onClick={() => this.addColumn()} ref={(el) => this.addbtn = el as HTMLElement}></luma-button>
          </div>
          <div class="edit-schema-footer">
            <div id="bottom-row-spacer"></div>
            <div>
              <luma-button id="cancel-schema" class='cancel-schema' text="Cancel" primary-color="#244862" onClick={() => this.cancel()} ref={(el) => this.cancelbtn = el as HTMLElement}></luma-button>
              <luma-button id="save-schema" text="Save" primary-color="#244862" onClick={() => this.saveTable()} ref={(el) => this.savebtn = el as HTMLElement}></luma-button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
