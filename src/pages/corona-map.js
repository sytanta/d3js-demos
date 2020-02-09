import React, { Component } from "react"
import Rellax from "rellax"
import * as topojson from "topojson-client"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Disqus from "../components/disqus"

import classes from "../styles/post.module.css"
import classesMap from "../styles/corona-map.module.css"

const initD3 = containerId => {
  const d3 = window.d3

  const docWidth = Math.min(
      document.documentElement.clientWidth,
      window.innerWidth
    ),
    width = Math.min(docWidth, 960),
    height = Math.min(
      document.documentElement.clientHeight,
      window.innerHeight,
      Math.floor(width * 0.6)
    )

  const mapContainerWidth = document.getElementById(`${containerId}`)
    .offsetWidth

  Promise.all([
    d3.json("/data/world-50m.json"),
    d3.json("/data/corona-infection-by-country.json"),
    d3.csv("/data/world-country-names.csv"),
  ]).then(result => {
    makeMap(
      d3,
      containerId,
      width,
      height,
      docWidth,
      mapContainerWidth,
      result[0],
      result[1],
      result[2]
    )
  })
}

const makeMap = (
  d3,
  containerId,
  width,
  height,
  docWidth,
  mapContainerWidth,
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
    .select(`#${containerId}`)
    .append("div")
    .attr("class", classesMap.tooltip)
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
    .select(`#${containerId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .call(zoom)

  svg
    .append("rect")
    .attr("class", classesMap.overlay)
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
    .attr("class", classesMap.land)
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
        docWidth,
        mapContainerWidth,
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
    .attr("class", classesMap.boundary)
    .attr("d", path)

  // Legend content
  svg
    .append("rect")
    .attr("x", -width / 2 + 10)
    .attr("y", height / 2 - 25)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", noInfectedColor)
  svg
    .append("text")
    .attr("class", classesMap.legend)
    .attr("x", -width / 2 + 40)
    .attr("y", height / 2 - 10)
    .style("fill", "black")
    .text("Area without cases")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  // svg
  //   .selectAll("legend")
  //   .data(labels)
  //   .enter()
  //   .append("text")
  //   .attr("class", classesMap.legend)
  //   .attr("x", -width / 2)
  //   .attr("y", function(d, i) {
  //     return height / 2 - (labels.length - i) * 20
  //   })
  //   .style("fill", "black")
  //   .text(function(d) {
  //     return d
  //   })
  //   .attr("text-anchor", "left")
  //   .style("alignment-baseline", "middle")
}

const move = (d3, g) => {
  g.attr("transform", d3.event.transform)
  const t = d3.event.transform,
    s = t.k

  g.style("stroke-width", 1 / s).attr(
    "transform",
    `translate(${t.x},${t.y})scale(${s})`
  )
}

const mouseover = tooltip => {
  tooltip.style("display", "inline")
}

const mousemove = (
  d3,
  docWidth,
  mapContainerWidth,
  tooltip,
  countryName,
  infectionData
) => {
  const x = d3.event.pageX - (docWidth - mapContainerWidth) / 2

  tooltip
    .html(`<h5>${infectionData.infected}</h5><div>${countryName}</div>`)
    .style("left", `${x}px`)
    .style("top", `${d3.event.pageY - 62}px`)
}

const mouseout = tooltip => {
  tooltip.style("display", "none")
}

class CoronaMap extends Component {
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
      slug: "corona-map",
      title: "Jan 2019 nCoV Distribution",
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
            <div>
              Distribution of 2019-nCoV cases
              <br />
              29 January 2020
              <br />
              Source: WHO
            </div>
            <div className={classes.gatsbyHighlight}>
              <pre
                className="language-js"
                data-language="javascript"
                data-src="/libs/prism.js"
              >
                <code className="language-js">
                  {`const initD3 = containerId => {
  const d3 = window.d3

  const docWidth = Math.min(
      document.documentElement.clientWidth,
      window.innerWidth
    ),
    width = Math.min(docWidth, 960),
    height = Math.min(
      document.documentElement.clientHeight,
      window.innerHeight,
      Math.floor(width * 0.6)
    )

  const mapContainerWidth = document.getElementById(\`$\{containerId}\`)
    .offsetWidth

  Promise.all([
    d3.json("/data/world-50m.json"),
    d3.json("/data/corona-infection-by-country.json"),
    d3.csv("/data/world-country-names.csv"),
  ]).then(result => {
    makeMap(
      d3,
      containerId,
      width,
      height,
      docWidth,
      mapContainerWidth,
      result[0],
      result[1],
      result[2]
    )
  })
}

const makeMap = (
  d3,
  containerId,
  width,
  height,
  docWidth,
  mapContainerWidth,
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
    .select(\`#$\{containerId}\`)
    .append("div")
    .attr("class", classesMap.tooltip)
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
    .select(\`#$\{containerId}\`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", \`translate($\{width / 2},$\{height / 2})\`)
    .call(zoom)

  svg
    .append("rect")
    .attr("class", classesMap.overlay)
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
    .attr("class", classesMap.land)
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
        docWidth,
        mapContainerWidth,
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
    .attr("class", classesMap.boundary)
    .attr("d", path)

  // Legend content
  svg
    .append("rect")
    .attr("x", -width / 2 + 10)
    .attr("y", height / 2 - 25)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", noInfectedColor)
  svg
    .append("text")
    .attr("class", classesMap.legend)
    .attr("x", -width / 2 + 40)
    .attr("y", height / 2 - 10)
    .style("fill", "black")
    .text("Area without cases")
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
}

const move = (d3, g) => {
  g.attr("transform", d3.event.transform)
  const t = d3.event.transform,
    s = t.k

  g.style("stroke-width", 1 / s).attr(
    "transform",
    \`translate($\{t.x},$\{t.y})scale($\{s})\`
  )
}

const mouseover = tooltip => {
  tooltip.style("display", "inline")
}

const mousemove = (
  d3,
  docWidth,
  mapContainerWidth,
  tooltip,
  countryName,
  infectionData
) => {
  const x = d3.event.pageX - (docWidth - mapContainerWidth) / 2

  tooltip
    .html(\`<h5>$\{infectionData.infected}</h5><div>$\{countryName}</div>\`)
    .style("left", \`$\{x}px\`)
    .style("top", \`$\{d3.event.pageY - 62}px\`)
}

const mouseout = tooltip => {
  tooltip.style("display", "none")
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

export default CoronaMap
