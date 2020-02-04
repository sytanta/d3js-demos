import React from "react"
import { StaticQuery, Link, graphql } from "gatsby"
import Img from "gatsby-image"

const HeaderMain = () => (
  <StaticQuery
    query={graphql`
      query {
        file(relativePath: { eq: "gd3.png" }) {
          childImageSharp {
            fluid(maxWidth: 400, quality: 100) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
      }
    `}
    render={data => (
      <h1 style={{ margin: "1.5rem" }}>
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          <Img
            fluid={data.file.childImageSharp.fluid}
            style={{
              width: "10rem",
              margin: "0 auto",
            }}
            alt="Gatsby D3js"
          />
        </Link>
      </h1>
    )}
  />
)

export default HeaderMain
