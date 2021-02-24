
import React, { Component } from "react";

export default class IFrameWebView extends Component {
    constructor () {
        super()
    }

    componentDidMount () {
        console.log(this.frame.contentWindow);
        const $doc = this.frame.contentWindow.document;

        let injection = $doc.createElement('script')
        injection.innerHTML = `Object.defineProperty(window.top, 'location', { value: window.location })`;

        $doc.querySelector("body").appendChild(injection);
    }

    render () {
        const { source, style } = this.props;

        return <iframe
                    ref={c => this.frame = c}
                    id="id"
                    style={{
                        position: "absolute",
                        marginTop: '-200px',
                        background: "#ffffff"
                    }}
                    frameBorder={0}
                    width="100%"
                    height="600px"
                    src={source.uri} />
    }
}
