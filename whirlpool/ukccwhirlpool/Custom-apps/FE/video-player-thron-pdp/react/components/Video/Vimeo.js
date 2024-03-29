import React, { Component } from 'react'
import PropTypes from 'prop-types'
import xss from 'xss'

class Vimeo extends Component {
  constructor(props) {
    super(props)

    this.state = { iframe: {} }

    const { loop, autoplay, width, height, showTitle, url } = this.props
    const params = `autoplay=${autoplay}&loop=${loop}&title=${showTitle}&width=${width}&height=${height}`
    const getUrl = `https://vimeo.com/api/oembed.json?url=${url}&${params}`

    this.iframeRef = React.createRef()

    fetch(getUrl)
      .then(response => response.json())
      .then(response => {
        const { height: heightDiv, width: widthDiv, html, title } = response

        const thumbUrl = Vimeo.thumbUrlFromResp(response, props.thumbWidth)

        props.setThumb && props.setThumb(thumbUrl, title)

        const [, src] = html.match(/src= *" *([^"]*) *"/) // Get url from response
				let cleansrc = xss(src)
        this.setState({
          iframe: {
            divStyle: { padding: `${(100 * heightDiv) / widthDiv}% 0 0 0` },
            cleansrc,
          },
        })
      })
  }

  static getThumbUrl = url => {
    const getUrl = `https://vimeo.com/api/oembed.json?url=${url}`

    return fetch(getUrl)
      .then(response => response.json())
      .then(response => response.thumbnail_url)
  }

  static thumbUrlFromResp(response, thumbWidth) {
    const { height, width } = response
    const thumb = response.thumbnail_url_with_play_button

    thumbWidth = thumbWidth || response.thumbnail_width
    const thumbHeight = Math.ceil((thumbWidth * height) / width)

    return thumb.replace(
      /_[0123456789]*x[0123456789]*./,
      `_${thumbWidth}x${thumbHeight}.`
    )
  }

  executeCommand = command => () => {
    if (!this.frameReady) return

    const vimeoCommand = JSON.stringify({ method: command })

    this.iframeRef.contentWindow.postMessage(
      vimeoCommand,
      'https://player.vimeo.com'
    )
  }

  render() {
    const { iframe } = this.state
    const { className, id, cssHandles } = this.props

    this.props.playing
      ? this.executeCommand('play')()
      : this.executeCommand('pause')()

    return (
      <div
        style={iframe.divStyle}
        className={`relative ${className} ${cssHandles.videoContainer}`}
      >
        <iframe
          ref={this.iframeRef}
          title={id}
          className={`${cssHandles.video} absolute top-0 left-0 w-100 h-100`}
          src={xss(iframe.src)}
          frameBorder="0"
          allowFullScreen
          allow="autoplay"
        />
      </div>
    )
  }
}

Vimeo.propTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired, // Unique ID for iframe title
  setThumb: PropTypes.func,
  thumbWidth: PropTypes.number,
  className: PropTypes.string,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  showTitle: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  playing: PropTypes.bool,
  cssHandles: PropTypes.shape({
    video: PropTypes.string.isRequired,
    videoContainer: PropTypes.string.isRequired,
  }).isRequired,
}

Vimeo.defaultProps = {
  loop: true,
  autoplay: false,
  width: null,
  height: null,
  showTitle: false,
  className: '',
}

export default Vimeo
