
import { Component, Prop, State, Element, Event, EventEmitter, Method, Listen } from '@stencil/core';
// import { MDCTextField } from '@material/textfield';
// import { MDCSelect } from '@material/select';

@Component({
  tag: 'data-store-add-schema',
  styleUrl: 'data-store-add-schema.scss',
  shadow: true
})
export class AddSchema {

  @Prop() header: boolean = false
  @Prop({ mutable: true }) schema

  @Element() el: HTMLElement
  parent
  repeater
  cancelbtn
  savebtn
  headerInput
  addbtn
  @State() tableName
  @State() columns = [{ 'columnName': '', 'type': '', 'devName': '', 'options': '' }]
  @Event({ eventName: 'update', composed: true, bubbles: true, cancelable: false }) addSchemaEvent: EventEmitter

  @Method()
  updateColumns(tableName = '', columns = [{ 'columnName': '', 'type': '', 'devName': '', 'options': '' }]) {
    this.cancelbtn.style.width = ''
    this.cancelbtn.style.paddingRight = '10px'
    this.savebtn.style.width = ''
    this.addbtn.style.width = ''
    this.headerInput.style.width = '85%'
    this.repeater.style.width = '85%'
    this.tableName = tableName
    this.columns = columns
    this.repeater.setData(this.columns)

  }

  componentWillLoad() {
    // this.headerInput.shadowRoot.querySelector('#input_add-schema-header').pattern = '^[a-zA-Z1-9-]+$'
  }

  addColumn() {
    this.columns = [...this.columns, { columnName: '', 'type': '', 'devName': '', 'options': '' }]
    this.repeater.setData(this.columns)
  }

  deleteColumn(index) {
    this.columns.splice(index, 1)
    this.columns = [...this.columns]
  }

  @Listen('onValueChange')
  handleInput(event) {
    if (event.srcElement.tagName == 'DATA-STORE-ADD-SCHEMA') {
      let inputElId = event.detail.inputElement.id
      if (inputElId == 'input_add-schema-header') {
        this.tableName = event.detail.value
      } else {
        let lumaRowIndex = event.path[0].getAttribute('luma-row-index')
        let rowKey = event.path[0].getAttribute('row-key')
        this.columns[lumaRowIndex][rowKey] = event.detail.value
        if (rowKey == 'columnName') {
          this.repeater.getItem(lumaRowIndex).then((rsp) => {
            let devNameInput = rsp.rowEl[0].children[0].children[3]
            devNameInput.value = this.camelCase(event.detail.value)
            this.columns[lumaRowIndex]['devName'] = this.camelCase(event.detail.value)
          })
        }
        if (rowKey == 'type') {
          this.columns[lumaRowIndex][rowKey] = event.detail.value
          let optionsInput = null
          if (event.detail.value == 'Dropdown') {
            this.repeater.getItem(lumaRowIndex).then((rsp) => {
              optionsInput = rsp.rowEl[0].children[0].children[4]
              optionsInput.pattern = '^[a-zA-Z0-9-]+(,[a-zA-Z0-9-]+)*$'
              optionsInput.disabled = false
            })
          } else {
            this.repeater.getItem(lumaRowIndex).then((rsp) => {
              optionsInput = rsp.rowEl[0].children[0].children[4]
              optionsInput.value = ''
              optionsInput.disabled = true
            })
          }
        }
      }
    }
    //add update item call to repeater
  }

  @Listen('onChange')
  onChangeListener(event) {
    if (event.srcElement.tagName == 'DATA-STORE-ADD-SCHEMA') {
      let lumaRowIndex = event.path[5].getAttribute('luma-row-index')
      let rowKey = event.path[0].getAttribute('row-key')
      this.columns[lumaRowIndex][rowKey] = event.detail.value
      let optionsInput = null
      if (event.detail.value == 'Dropdown') {
        this.repeater.getItem(lumaRowIndex).then((rsp) => {
          optionsInput = rsp.rowEl[0].children[0].children[4]
          optionsInput.pattern = '^[a-zA-Z0-9-]+(,[a-zA-Z0-9-]+)*$'
          optionsInput.disabled = false
        })
      } else {
        this.repeater.getItem(lumaRowIndex).then((rsp) => {
          optionsInput = rsp.rowEl[0].children[0].children[4]
          optionsInput.value = ''
          optionsInput.disabled = true
        })
      }
    }
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
    this.columns = [{ 'columnName': '', 'type': '', 'devName': '', 'options': '' }]
    this.tableName = ''
  }

  createTable() {
    let reqHeaders = new Headers({
      "Content-Type": "application/json",
    })

    return fetch('http://localhost:5005/ic/hjgkjhg/' + this.tableName + '/schema', {
      headers: reqHeaders,
      method: 'post',
      body: JSON.stringify(this.columns)
    }).then(rsp => {
      return rsp.json()
    }).then(() => {
      // debugger
      this.addSchemaEvent.emit(this.tableName)
      this.cancel()
    }).catch((err) => {
      console.error('Failed to add schema to table', err);
    })
  }




  render() {
    let template = `<div class="edit-schema-row">
    <div class="edit-schema-spacer"></div>
    <luma-input-text id="columnName" row-key="columnName" class="edit-schema-row-item" primary-color="#244862" placeholder="Column Name" input-style="filled" value={columnName}></luma-input-text>
    <luma-select id="type" row-key="type" class="edit-schema-row-item" primary-color="#244862" option-csv="Text,Numeric,Dropdown,Image" selected-value={type} placeholder="Select Type" select-style="filled"></luma-select>
    <luma-input-text id="devName" row-key="devName" class="edit-schema-row-item" primary-color="#244862" placeholder="Dev Name" input-style="filled" value={devName} readonly="true"></luma-input-text>
    <luma-input-text id="options" row-key="options" class="edit-schema-row-item" primary-color="#244862" placeholder="Options" input-style="filled" value={options} disabled="true"></luma-input-text>
    <luma-toggle id='column-toggle' disabled='false' ></luma-toggle>
    <div class="edit-schema-spacer"></div>
  </div>`

    let styles = `.edit-schema-row{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
    }
    .edit-schema-row-item{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .edit-schema-spacer{
      flex: 1 5%;
      height: 45px;
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
      height: 70px;
      padding:0px;
    }
    #type{
      padding-right: 32px;
    }
    `

    return (
      <div id="parent" ref={(el) => this.parent = el as HTMLElement}>
        <luma-input-text id="add-schema-header" class="add-schema-header" input-style="filled" value={this.tableName} primary-color="#244862" ref={(el) => this.headerInput = el as HTMLElement}></luma-input-text>
        <luma-repeater id="add-schema-repeater" class="row-container" template={template} template-css-classes={styles} ref={(el) => this.repeater = el as HTMLElement}></luma-repeater>
        <luma-button id="add-row" class='add-row' text="Add" icon="control_point" button-type="flat" primary-color="#FFF" onClick={() => this.addColumn()} ref={(el) => this.addbtn = el as HTMLElement}></luma-button>
        <div class="edit-schema-footer">
          <div id="bottom-row-spacer"></div>
          <luma-button id="cancel-schema" text="Cancel" primary-color="#244862" onClick={() => this.cancel()} ref={(el) => this.cancelbtn = el as HTMLElement}></luma-button>
          <luma-button id="save-schema" text="Save" primary-color="#244862" onClick={() => this.createTable()} ref={(el) => this.savebtn = el as HTMLElement}></luma-button>
        </div>
      </div>
    )
  }
}
