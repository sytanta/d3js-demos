import React from "react"
import { Link } from "gatsby"

const Header = ({ title }) => (
  <h3 style={{ fontFamily: `Montserrat, sans-serif`, margin: "1.5rem" }}>
    <Link
      style={{
        boxShadow: `none`,
        textDecoration: `none`,
        color: `inherit`,
      }}
      to={`/`}
    >
      Home
    </Link>{` `}
    > {title}
  </h3>
)

export default Header
