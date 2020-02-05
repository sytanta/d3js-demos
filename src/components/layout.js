import React from "react"

import { rhythm } from "../utils/typography"

import HeaderMain from "./header-main"
import Header from "./header"

class Layout extends React.Component {
  render() {
    const { location, pageTitle, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    const isRootPath = location.pathname === rootPath

    const mainSectionStyle = isRootPath
      ? {}
      : {
          display: `flex`,
          justifyContent: `center`,
          alignContent: `center`,
        }

    const header = isRootPath ? <HeaderMain /> : <Header title={pageTitle} />

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(42),
          padding: `0 0.8rem`,
          position: `relative`,
        }}
      >
        <header>{header}</header>
        <main style={mainSectionStyle}>{children}</main>
        <footer style={{ paddingTop: "2rem" }}>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a> and
          {` `}
          <a href="https://d3js.org/">D3.js</a>
        </footer>
      </div>
    )
  }
}

export default Layout
