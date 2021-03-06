import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { applyGutters, applyMaxWidth, applyNumCols, applySideMargins } from './rules'
import { getGridProperty } from './utils'

const Grid = styled.div`
  display: grid;
  box-sizing: content-box;
  margin: 0 auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.6;
  z-index: 1000;
  pointer-events: none;
  grid-template-columns: repeat(${props => props.cols.singleValue}, 1fr);

  /* Side Margins */
  ${props =>
    props.gutter &&
    props.gutter.singleValue &&
    `
    padding: 0 ${props.gutter.singleValue};
  `};

  ${props =>
    props.gutter &&
    props.gutter.map &&
    `
    ${applySideMargins(props.gutter.map)}
  `};

  /* Gutters */
  ${props =>
    props.gutter &&
    props.gutter.singleValue &&
    `
    column-gap: ${props.gutter.singleValue};
  `};

  ${props =>
    props.gutter &&
    props.gutter.map &&
    `
    ${applyGutters(props.gutter.map)}
  `};

  /* Columns */
  ${props =>
    props.cols &&
    props.cols.map &&
    `
    ${applyNumCols(props.cols.map)}
  `};

  /* Max-Width */
  ${props =>
    props.maxWidth &&
    props.maxWidth.singleValue &&
    `
    max-width: ${props.maxWidth.singleValue};
  `};

  ${props =>
    props.maxWidth &&
    props.maxWidth.map &&
    `
    ${applyMaxWidth(props.maxWidth.map)}
  `};
`

const Col = styled.div`
  width: 100%;
  height: 100vh;
  background: #d8fff7;
  border-left: 1px solid #31ffde;
  border-right: 1px solid #31ffde;

  border-left: 1px solid #31ffde;
  border-right: 1px solid #31ffde;
`

export default class GridDebugger extends Component {
  static propTypes = {
    show: PropTypes.bool,
    gutter: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.string
    ]).isRequired,
    maxWidth: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.string
    ]),
    numCols: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
      PropTypes.array
    ]).isRequired,
    theme: PropTypes.object
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKey)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKey)
  }

  constructor(props) {
    super(props)

    this.state = {
      showGrid: !!props.show
    }
  }

  render() {
    const {
      theme,
      gutter,
      maxWidth,
      numCols
    } = this.props
    const guttersObject = getGridProperty(gutter, this.props.theme)
    const cols = getGridProperty(numCols, theme, 'cols')
    const maxWidthObj = maxWidth
      ? getGridProperty(maxWidth, theme)
      : { singleValue: 'none' }

    return this.state.showGrid ? (
      <Grid
        gutter={guttersObject}
        cols={cols}
        maxWidth={maxWidthObj}
      >
        {Array.from(new Array(cols.singleValue)).map((_, idx) => (
          <Col key={idx} />
        ))}
      </Grid>
    ) : null
  }

  handleKey = ev => {
    if (ev.key === 'g' && ev.ctrlKey) {
      this.setState({
        showGrid: !this.state.showGrid
      })
    }
  }
}
