import React from "react"

const Footer = ({ title }) => (
  <footer style={{ display: "flex", justifyContent: "space-between", padding: "2rem 1rem" }}>
    <div>
      © {new Date().getFullYear()}, Built with
      {` `}
      <a href="https://www.gatsbyjs.org">Gatsby</a> and
      {` `}
      <a href="https://d3js.org/">D3.js</a>
    </div>
    <div></div>
  </footer>
)

export default Footer
