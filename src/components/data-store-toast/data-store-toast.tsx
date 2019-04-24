import { Component, Prop, Element } from '@stencil/core';

@Component({
    tag: 'data-store-toast',
    styleUrl: 'data-store-toast.scss',
    shadow: true
})

export class DataStoreToast {

    toast: HTMLElement

    @Element() el: HTMLElement

    @Prop() line1: string = ''
    @Prop() line2: string = ''
    @Prop() line3: string = ''
    @Prop() error: boolean = false


    componentDidLoad() {
        this.toast.style.display = "block"
        this.toast.style.display = "grid"
        if(this.error){
            this.toast.style.backgroundColor ='#F44336'
        }
        var self = this
        setTimeout(function () {
            setTimeout(() => { self.el.parentElement.removeChild(self.el) }, 8000)
        }, 2000)
    }

    render() {
        if (this.line2 != '') {
            return (
                <div id="toast" ref={(el) => this.toast = el as HTMLElement}>
                    {this.line1}<br/>
                    {this.line2}<br/>
                    {this.line3}<br/>
                </div>
            )
        } else {
            return (
                <div id="toast" ref={(el) => this.toast = el as HTMLElement}>
                    {this.line1}
                </div>
            )
        }
    }
}