import React from "react"

import classes from "../styles/footer.module.css"

const Footer = () => (
  <footer className={classes.footer}>
    <div>
      © {new Date().getFullYear()}, Built with
      {` `}
      <a href="https://www.gatsbyjs.org">Gatsby</a> and
      {` `}
      <a href="https://d3js.org/">D3.js</a>
    </div>
    <div>
      <a
        href="https://www.linkedin.com/in/tan-sy-688b8a87/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img width="20" src="images/linkedin.png" alt="Contact" />
      </a>
    </div>
  </footer>
)

export default Footer
