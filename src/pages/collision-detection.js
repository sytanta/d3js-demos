import React, { Component } from "react"
import Rellax from "rellax"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Disqus from "../components/disqus"

import classes from "../styles/post.module.css"

const initD3 = container => {
  const d3 = window.d3

  const width = Math.min(
      document.documentElement.clientWidth,
      window.innerWidth,
      960
    ),
    height = Math.min(
      document.documentElement.clientHeight,
      window.innerHeight,
      500
    )

  const nodes = d3.range(200).map(() => {
      return { radius: Math.random() * 12 + 4 }
    }),
    root = nodes[0],
    color = d3.scaleOrdinal(d3.schemeCategory10)

  root.radius = 0
  root.fixed = true

  const force = d3
    .forceSimulation()
    .velocityDecay(0.2)
    .force("x", d3.forceX(width / 2).strength(0.015))
    .force("y", d3.forceY(height / 2).strength(0.015))
    .force(
      "collide",
      d3
        .forceCollide()
        .radius(d => {
          if (d === root) {
            return Math.random() * 50 + 150
          }
          return d.radius + 0.5
        })
        .iterations(5)
    )
    .nodes(nodes)

  const svg = d3
    .select(`#${container}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  svg
    .selectAll("circle")
    .data(nodes.slice(1))
    .enter()
    .append("circle")
    .attr("r", d => {
      return d.radius
    })
    .style("fill", (d, i) => {
      return color(i % 3)
    })

  force.on("tick", e => {
    let i = 0
    const q = d3.quadtree(nodes),
      n = nodes.length

    while (++i < n) q.visit(collide(nodes[i]))

    svg
      .selectAll("circle")
      .attr("cx", d => {
        return d.x
      })
      .attr("cy", d => {
        return d.y
      })
  })

  svg.on("mousemove", function() {
    const p1 = d3.mouse(this)
    root.fx = p1[0]
    root.fy = p1[1]
    force.alphaTarget(0.3).restart()
  })
}

const collide = node => {
  const r = node.radius + 16,
    nx1 = node.x - r,
    nx2 = node.x + r,
    ny1 = node.y - r,
    ny2 = node.y + r
  return (quad, x1, y1, x2, y2) => {
    if (quad.point && quad.point !== node) {
      let x = node.x - quad.point.x,
        y = node.y - quad.point.y
      let l = Math.sqrt(x * x + y * y)
      const r = node.radius + quad.point.radius
      if (l < r) {
        l = ((l - r) / l) * 0.5
        node.x -= x *= l
        node.y -= y *= l
        quad.point.x += x
        quad.point.y += y
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
  }
}

class CollisionDetection extends Component {
  componentDidMount() {
    initD3("d3-container")

    new Rellax(".rellax", {
      speed: -2,
      center: false,
      wrapper: null,
      round: true,
      vertical: true,
      horizontal: false,
    })

    window.Prism.highlightAll()
  }

  render() {
    const { slug, title } = {
      slug: "collision-detection",
      title: "Collision Detection",
    }

    return (
      <Layout location={this.props.location} pageTitle={title}>
        <SEO title={title} />
        <div className={classes.container}>
          <div id="d3-container" className={classes.mapContainer}></div>
          <div>
            <div className={classes.pContainer}>
              <div
                className={`rellax ${classes.p}`}
                data-rellax-speed="-3"
                data-rellax-xs-speed="-1"
                data-rellax-mobile-speed="-0.6"
                data-rellax-tablet-speed="-2"
                data-rellax-desktop-speed="-3"
              >
                {title}
              </div>
            </div>
            <p>
              Original demo link:{" "}
              <a
                href="https://bl.ocks.org/mbostock/3231298"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://bl.ocks.org/mbostock/3231298
              </a>
            </p>
            <div className={classes.gatsbyHighlight}>
              <pre
                className="language-js"
                data-language="javascript"
                data-src="/libs/prism.js"
              >
                <code className="language-js">
                  {`const initD3 = container => {
  const d3 = window.d3

  const width = Math.min(
      document.documentElement.clientWidth,
      window.innerWidth,
      960
    ),
    height = Math.min(
      document.documentElement.clientHeight,
      window.innerHeight,
      500
    )

  const nodes = d3.range(200).map(() => {
      return { radius: Math.random() * 12 + 4 }
    }),
    root = nodes[0],
    color = d3.scaleOrdinal(d3.schemeCategory10)

  root.radius = 0
  root.fixed = true

  const force = d3
    .forceSimulation()
    .velocityDecay(0.2)
    .force("x", d3.forceX(width / 2).strength(0.015))
    .force("y", d3.forceY(height / 2).strength(0.015))
    .force(
      "collide",
      d3
        .forceCollide()
        .radius(d => {
          if (d === root) {
            return Math.random() * 50 + 150
          }
          return d.radius + 0.5
        })
        .iterations(5)
    )
    .nodes(nodes)

  const svg = d3
    .select(\`#\${container}\`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  svg
    .selectAll("circle")
    .data(nodes.slice(1))
    .enter()
    .append("circle")
    .attr("r", d => {
      return d.radius
    })
    .style("fill", (d, i) => {
      return color(i % 3)
    })

  force.on("tick", e => {
    let i = 0
    const q = d3.quadtree(nodes),
      n = nodes.length

    while (++i < n) q.visit(collide(nodes[i]))

    svg
      .selectAll("circle")
      .attr("cx", d => {
        return d.x
      })
      .attr("cy", d => {
        return d.y
      })
  })

  svg.on("mousemove", function() {
    const p1 = d3.mouse(this)
    root.fx = p1[0]
    root.fy = p1[1]
    force.alphaTarget(0.3).restart()
  })
}

const collide = node => {
  const r = node.radius + 16,
    nx1 = node.x - r,
    nx2 = node.x + r,
    ny1 = node.y - r,
    ny2 = node.y + r
  return (quad, x1, y1, x2, y2) => {
    if (quad.point && quad.point !== node) {
      let x = node.x - quad.point.x,
        y = node.y - quad.point.y
      let l = Math.sqrt(x * x + y * y)
      const r = node.radius + quad.point.radius
      if (l < r) {
        l = ((l - r) / l) * 0.5
        node.x -= x *= l
        node.y -= y *= l
        quad.point.x += x
        quad.point.y += y
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
  }
}`}
                </code>
              </pre>
            </div>
          </div>
          <Disqus slug={slug} title={title} />
        </div>
      </Layout>
    )
  }
}

export default CollisionDetection
