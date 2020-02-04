import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

import applyOnScrollClass from "../libs/applyOnScrollClasses"

import classes from "../styles/index.module.css"

class Index extends React.Component {
  componentDidMount() {
    applyOnScrollClass(classes.post, classes.isVisible)
  }

  render() {
    const { data, location } = this.props

    return (
      <Layout location={location}>
        <SEO title={data.site.siteMetadata.title} />
        <div>
          <p>
            Some D3js demos are written in older versions. I re-write them in
            the latest version for better reference.
          </p>
        </div>
        <div className={classes.container}>
          {data.allPageListJson.edges.map(({ node: page }) => (
            <div key={page.slug} className={classes.post}>
              <p>
                <Link to={`/${page.slug}`}>{page.title}</Link>
              </p>
              <Img
                style={{ maxWidth: "100%", maxHeight: "120px" }}
                fluid={page.fields.postImage.childImageSharp.fluid}
                alt={page.title}
              />
            </div>
          ))}
        </div>
      </Layout>
    )
  }
}

export default Index

export const IndexQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }

    allPageListJson {
      edges {
        node {
          fields {
            postImage {
              childImageSharp {
                fluid(maxWidth: 400, quality: 100) {
                  ...GatsbyImageSharpFluid_tracedSVG
                }
              }
            }
          }
          slug
          title
        }
      }
    }
  }
`
