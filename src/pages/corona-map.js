import React, { Component } from "react"
import { graphql } from "gatsby"
import * as topojson from "topojson-client"

import Layout from "../components/layout"
import SEO from "../components/seo"

import classes from "./corona-map.module.css"

const initD3 = containerId => {
  const d3 = window.d3

  const width = 960,
    height = 550

  Promise.all([
    d3.json("/data/world-50m.json"),
    d3.json("/data/corona-infection-by-country.json"),
    d3.csv("/data/world-country-names.csv"),
  ]).then(result => {
    makeMap(d3, containerId, width, height, result[0], result[1], result[2])
  })
}

const makeMap = (
  d3,
  containerId,
  width,
  height,
  worldMapData,
  infectionData,
  countryNamesArr
) => {
  const countryNames = {}
  countryNamesArr.forEach(country => {
    countryNames[country.id.replace(/^[0]+/g, "")] = country.name
  })

  const colorScale = d3.scaleSequential(d3.interpolateReds).domain([0, 0.5])
  const noInfectedColor = "rgb(0, 104, 55)"

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", classes.tooltip)
    .style("display", "none")

  const projection = d3
    .geoMercator()
    .scale(width / 2 / Math.PI)
    .translate([0, 0])

  const path = d3.geoPath().projection(projection)

  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([1, 8])
    .on("zoom", () => {
      move(d3, g)
    })

  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .call(zoom)

  svg
    .append("rect")
    .attr("class", classes.overlay)
    .attr("x", -width / 2)
    .attr("y", -height / 2)
    .attr("width", width)
    .attr("height", height)

  const g = svg.append("g")

  g.selectAll("path")
    .data(
      topojson.feature(worldMapData, worldMapData.objects.countries).features
    )
    .enter()
    .append("path")
    .attr("class", classes.land)
    .attr("d", path)
    .style("fill", function(d) {
      const infected = infectionData.data[d.id]
        ? +infectionData.data[d.id].infected
        : 0

      if (infected === 0) {
        return noInfectedColor
      } else {
        return infected > 20 ? "rgb(69, 2, 2)" : colorScale(infected / 20)
      }
    })
    .on("mouseover", function(d) {
      mouseover(tooltip)

      d3.select(this).style("opacity", 0.5)
    })
    .on("mousemove", function(d) {
      mousemove(
        d3,
        tooltip,
        countryNames[d.id],
        infectionData.data[d.id] || { infected: 0 }
      )
    })
    .on("mouseout", function(d) {
      mouseout(tooltip)

      d3.select(this).style("opacity", 1)
    })

  g.append("path")
    .datum(
      topojson.mesh(worldMapData, worldMapData.objects.countries, function(
        a,
        b
      ) {
        return a !== b
      })
    )
    .attr("class", classes.boundary)
    .attr("d", path)

  const labels = [
    `Distribution of 2019-nCoV cases`,
    infectionData.date,
    "Source: WHO",
  ]

  // Legend content
  svg
    .append("rect")
    .attr("x", -width / 2)
    .attr("y", height / 2 - (labels.length + 2) * 20 - 10)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", noInfectedColor)
  svg
    .append("text")
    .attr("class", classes.legend)
    .attr("x", -width / 2 + 30)
    .attr("y", height / 2 - (labels.length + 2) * 20 + 5)
    .style("fill", "black")
    .text("Area without cases")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  svg
    .selectAll("legend")
    .data(labels)
    .enter()
    .append("text")
    .attr("class", classes.legend)
    .attr("x", -width / 2)
    .attr("y", function(d, i) {
      return height / 2 - (labels.length - i) * 20
    })
    .style("fill", "black")
    .text(function(d) {
      return d
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
}

const move = (d3, g) => {
  g.attr("transform", d3.event.transform)
  const t = d3.event.transform,
    s = t.k
  //   d3.event.scale
  //   t.x = Math.min((width / 2) * (s - 1), Math.max((width / 2) * (1 - s), t.x))
  //   t.y = Math.min(
  //     (height / 2) * (s - 1) + 230 * s,
  //     Math.max((height / 2) * (1 - s) - 230 * s, t.y)
  //   )

  g.style("stroke-width", 1 / s).attr(
    "transform",
    "translate(" + [t.x, t.y] + ")scale(" + s + ")"
  )
}

const mouseover = tooltip => {
  tooltip.style("display", "inline")
}

const mousemove = (d3, tooltip, countryName, infectionData) => {
  tooltip
    .html(`<h5>${infectionData.infected}</h5><div>${countryName}</div>`)
    .style("left", d3.event.pageX - 34 + "px")
    .style("top", d3.event.pageY - 62 + "px")
}

const mouseout = tooltip => {
  tooltip.style("display", "none")
}

class coronaMap extends Component {
  componentDidMount() {
    initD3("#d3-container-map")
  }

  render() {
    return (
      <Layout location={this.props.location}>
        <SEO title="2019-nCoV Distribution" />
        <div id="d3-container-map" className={classes.d3Container}></div>
      </Layout>
    )
  }
}

export default coronaMap

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
