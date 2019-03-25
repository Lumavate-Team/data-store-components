
import { Component, Prop, State, Element, Event, EventEmitter, Method, Listen } from "@stencil/core";

@Component({
  tag: 'data-store-edit-schema',
  styleUrl: 'data-store-edit-schema.scss',
  shadow: true
})
export class EditSchema {

  @Prop() header: boolean = false
  @Prop({ mutable: true }) schema

  @Element() el: HTMLElement
  parent
  repeater
  cancelbtn
  savebtn
  headerInput
  addbtn
  selectMenu
  optionsInput
  @State() tableName
  @State() columns = [{ 'columnName': '', 'type': '', 'devName': '', 'options': '' }]
  @Event({ eventName: 'update', composed: true, bubbles: true, cancelable: false }) addSchemaEvent: EventEmitter

  @Method()
  updateColumns(tableName, columns) {
    this.cancelbtn.style.width = ''
    this.cancelbtn.style.paddingRight = '10px'
    this.savebtn.style.width = ''
    this.addbtn.style.width = ''
    this.headerInput.style.width = '85%'
    this.repeater.style.width = '85%'
    this.tableName = tableName
    this.columns = columns
    this.repeater.setData(this.columns)
    // console.log('1')
    // setTimeout(()=>{
    //   console.log('1')
    //   this.repeater.setData(this.columns)
    // },300)
  }

  addColumn() {
    this.columns = [...this.columns, { columnName: '', 'type': '', 'devName': '', 'options': '' }]
    this.repeater.setData(this.columns)
  }




  @Method()
  componentWillUpdate() {

    this.headerInput.shadowRoot.querySelector('#input_edit-schema-header').pattern = '^[a-zA-Z1-9-]+$'
    // console.log(this.repeater)
    // this.repeater.componentDidUpdate().then(()=>{
    //   debugger
    //   this.columns.forEach((_)=>{
    //     // let row = this.repeater.getItem(index)

    //   })
    // })
  }

  deleteColumn(index) {
    this.columns.splice(index, 1)
    this.columns = [...this.columns]
  }

  @Listen('onTextInput')
  handleInput(event) {
    this.columns[event.detail.lumaRowIndex][event.detail.input.el.getAttribute('row-key')] = event.detail.value

    // if(event.detail.input.el.getAttribute('row-key') == 'columnName'){
    //   this.repeater.getItem(event.detail.lumaRowIndex).then((rsp)=>{
    //     let devNameInput = rsp.rowEl[0].children[0].children[3]
    //     devNameInput.value = this.camelCase(event.detail.value)
    //   })
    // }
    //add update item call to repeater
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

  @Listen('onChange')
  onChangeListener(event) {
    this.columns[event.detail.lumaRowIndex][event.path[0].getAttribute('row-key')] = event.detail.value
    let optionsInput = null
    if (event.detail.value == 'Dropdown') {
      this.repeater.getItem(event.detail.lumaRowIndex).then((rsp) => {
        optionsInput = rsp.rowEl[0].children[0].children[4]
        optionsInput.disabled = false
      })
    } else {
      this.repeater.getItem(event.detail.lumaRowIndex).then((rsp) => {
        optionsInput = rsp.rowEl[0].children[0].children[4]
        optionsInput.value = ''
        optionsInput.disabled = true
      })
    }
  }

  @Listen('onRowPress')
  onRowPress(event) {
    console.log(event)
  }

  saveTable() {
    let reqHeaders = new Headers({
      "Content-Type": "application/json",
    })

    return fetch('http://localhost:5005/ic/hjgkjhg/' + this.tableName + '/schema', {
      headers: reqHeaders,
      method: 'put',
      body: JSON.stringify(this.columns)
    }).then(rsp => {
      return rsp.json()
    }).then(() => {
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
        <luma-input-text id="edit-schema-header" class="edit-schema-header" readonly="true" input-style="filled" value={this.tableName} primary-color="#244862" ref={(el) => this.headerInput = el as HTMLElement}></luma-input-text>
        <luma-repeater id="edit-schema-repeater" class="row-container" template={template} template-css-classes={styles} ref={(el) => this.repeater = el as HTMLElement}></luma-repeater>
        <luma-button id="add-row" class='add-row' text="Add" icon="control_point" button-type="flat" primary-color="#FFF" onClick={() => this.addColumn()} ref={(el) => this.addbtn = el as HTMLElement}></luma-button>
        <div class="edit-schema-footer">
          <div id="bottom-row-spacer"></div>
          <luma-button id="cancel-schema" text="Cancel" primary-color="#244862" onClick={() => this.cancel()} ref={(el) => this.cancelbtn = el as HTMLElement}></luma-button>
          <luma-button id="save-schema" text="Save" primary-color="#244862" onClick={() => this.saveTable()} ref={(el) => this.savebtn = el as HTMLElement}></luma-button>
        </div>
      </div>
    )
  }
}
