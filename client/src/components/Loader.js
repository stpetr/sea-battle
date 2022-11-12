import React from 'react'

const LOADER_TIMEOUT = 500
const LOADER_DOTS_NUM = 3

export class Loader extends React.Component {
  constructor() {
    super()

    this.state = {
      dots: '',
      timer: null,
    }
  }

  componentDidMount() {
    const timer = setInterval(() => {
      let dots = this.state.dots
      if (dots.length >= LOADER_DOTS_NUM) {
        dots = ''
      } else {
        dots += '.'
      }
      this.setState({ dots })
    }, LOADER_TIMEOUT)

    this.setState({ timer })
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  render() {
    return (
      <div className="loader">
        <span className="loader__text">Loading<span className="loader__text-dots">{this.state.dots}</span></span>
      </div>
    )
  }
}

export default Loader
