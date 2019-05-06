
import { Component, Prop, State, Element, Event, EventEmitter, Method, Listen } from '@stencil/core';

@Component({
  tag: 'data-store-add-schema',
  styleUrl: 'data-store-add-schema.scss',
  shadow: true
})
export class AddSchema {

  parent
  repeater
  cancelbtn
  savebtn
  headerInput
  addbtn
  invalidInput = false
  body
  url = '/ic/data-store/manage/'

  @Element() el: HTMLElement

  @State() columns = [{ 'columnName': '', 'type': '', 'devName': '', 'options': '', 'active': true }]
  @State() tableName

  @Prop() header: boolean = false
  @Prop({ mutable: true }) schema

  @Event({ eventName: 'update', composed: true, bubbles: true, cancelable: false }) addSchemaEvent: EventEmitter

  componentWillLoad() {
    this.body = document.querySelector('body')
  }

  @Listen('lumaInput')
  handleInput(event) {
    if (event.srcElement.tagName == 'DATA-STORE-ADD-SCHEMA') {
      let inputElId = event.detail.lumaElement.id
      if (inputElId == 'add-schema-header') {
        this.tableName = event.detail.value
      } else {
        let lumaRowIndex = event.path[0].getAttribute('luma-row-index')
        let rowKey = event.path[0].getAttribute('row-key')
        this.columns[lumaRowIndex][rowKey] = event.detail.value
        if (rowKey == 'columnName') {
          this.repeater.getItem(lumaRowIndex).then((rsp) => {
            let devNameInput = rsp.rowEl.children[2]
            devNameInput.value = this.camelCase(event.detail.value)
            this.columns[lumaRowIndex]['devName'] = this.camelCase(event.detail.value)
          })
        }
      }
    }
  }

  @Listen('lumaChange')
  handleChange(event) {
    if (event.srcElement.tagName == 'DATA-STORE-ADD-SCHEMA') {
      let lumaRowIndex = event.path[0].getAttribute('luma-row-index')
      let rowKey = event.path[0].getAttribute('row-key')
      if (rowKey == 'type') {
        this.columns[lumaRowIndex][rowKey] = event.detail.value
        let optionsInput = null
        if (event.detail.value == 'Dropdown') {
          this.repeater.getItem(lumaRowIndex).then((rsp) => {
            optionsInput = rsp.rowEl.children[3]
            optionsInput.disabled = false
            optionsInput.required = true
            optionsInput.placeholder = 'Options'
          })
        } else {
          this.repeater.getItem(lumaRowIndex).then((rsp) => {
            optionsInput = rsp.rowEl.children[3]
            optionsInput.value = ''
            optionsInput.shadowRoot.childNodes[1].style.backgroundColor = '#f7f7f7'
            optionsInput.disabled = true
            optionsInput.required = false
            optionsInput.placeholder = ''
            setTimeout(() => {
              optionsInput.getInputData()
            }, 25);
          })
        }
      }
      if (rowKey == 'toggle') {
        this.columns[lumaRowIndex][rowKey] = event.detail.value
        let status = event.detail.lumaElement
        if (event.detail.value) {
          status.parentNode.childNodes[1].innerText = 'Active'
        } else {
          status.parentNode.childNodes[1].innerText = 'Inactive'
        }

      }
    }
  }

  @Listen('lumaClick')
  handleClick(event) {
    if (event.detail.element.id == 'button_delete-row') {
      this.columns.splice(event.detail.rowIndex, 1)
      this.repeater.setData(this.columns)
    }
  }

  @Method()
  updateColumns() {
    this.cancelbtn.style.width = ''
    this.cancelbtn.style.paddingRight = '10px'
    this.savebtn.style.width = ''
    this.savebtn.style.flex = ''
    this.addbtn.style.width = ''
    this.addbtn.style.flex = ''
    this.headerInput.style.width = '100%'
    this.repeater.style.width = '100%'
    this.columns = [{ columnName: '', 'type': '', 'devName': '', 'options': '', 'active': true }]
    this.repeater.addItem({ columnName: '', 'type': '', 'devName': '', 'options': '', 'active': true })
  }


  addColumn() {
    this.columns = [...this.columns, { columnName: '', type: '', devName: '', options: '', 'active': true }]
    this.repeater.addItem({ columnName: '', 'type': '', 'devName': '', 'options': '', 'active': true })
  }

  deleteColumn(index) {
    this.columns.splice(index, 1)
    this.columns = [...this.columns]
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
    this.repeater.setData(this.columns)
    this.headerInput.setValue('')
    this.headerInput.setValidationMessage('')
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

  checkInputs() {
    let self = this
    self.invalidInput = false
    this.headerInput.getInputData().then(r => {
      if (r.isValid == false) {
        self.invalidInput = true
      }
    })
    if (this.columns.length == 0) {
      this.invalidInput = true
    }
    return new Promise((resolve) => {
      let promises = []
      self.columns.forEach((_, index) => {
        promises.push(self.repeater.getItem(index))
      });
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

  createTable() {
    let reqHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.getAuthToken()
    })

    let self = this
    this.checkInputs().then(() => {
      if (self.invalidInput) { } else {
        return fetch(self.url + self.tableName + '/schema', {
          headers: reqHeaders,
          method: 'post',
          body: JSON.stringify(self.columns)
        }).then(rsp => {
          return rsp.json()
        }).then((r) => {
          if (r.error) {
            self.initNotification(r.error)
          } else {
            self.addSchemaEvent.emit(self.tableName)
            self.cancel()
          }
        }).catch((err) => {
          console.error('Failed to add schema to table', err);
        })
      }
    })
  }


  initNotification(text) {
    let toast = document.createElement('data-store-toast')
    toast.error = true
    toast.line1 = text
    this.body.appendChild(toast)

  }


  render() {
    let template = `
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
    padding-bottom: 19px;
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

  .delete-row{
    min-width:unset;
    padding-top: 30px;
  }
  `
    return (
      <div id="parent" ref={(el) => this.parent = el as HTMLElement}>
        <div id='wrapper'>
          <luma-input-text id="add-schema-header" class="add-schema-header" placeholder='Table Name' input-style="filled" primary-color="#244862" pattern='^[a-zA-Z1-9-]+$' ref={(el) => this.headerInput = el as HTMLElement} required></luma-input-text>
          <div class='repeater-overflow'>
            <luma-repeater id="add-schema-repeater" class="row-container" template={template} template-css-classes={styles} ref={(el) => this.repeater = el as HTMLElement}></luma-repeater>
          </div>
          <div>
            <luma-button id="add-row" class='add-row' text="Add" icon="control_point" button-type="flat" primary-color="#FFF" onClick={() => this.addColumn()} ref={(el) => this.addbtn = el as HTMLElement}></luma-button>
          </div>
          <div class="edit-schema-footer">
            <div id="bottom-row-spacer"></div>
            <div>
              <luma-button id="cancel-schema" class='cancel-schema' text="Cancel" primary-color="#244862" onClick={() => this.cancel()} ref={(el) => this.cancelbtn = el as HTMLElement}></luma-button>
              <luma-button id="save-schema" text="Create" primary-color="#244862" onClick={() => this.createTable()} ref={(el) => this.savebtn = el as HTMLElement}></luma-button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
