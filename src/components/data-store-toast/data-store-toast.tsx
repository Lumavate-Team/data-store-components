import { Component, Prop, Element } from '@stencil/core';

@Component({
    tag: 'data-store-toast',
    styleUrl: 'data-store-toast.scss',
    shadow: true
})

export class DataStoreToast {

    @Prop() line1: string = ''
    @Prop() line2: string = ''

    @Element() el: HTMLElement
    toast: HTMLElement

    componentDidLoad() {
        this.toast.style.display = "block"
        this.toast.style.display = "grid"
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