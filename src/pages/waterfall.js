import React, { Component } from "react"
import Rellax from "rellax"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Disqus from "../components/disqus"

import classes from "../styles/post.module.css"
import chartClasses from "../styles/waterfall.module.css"

const initD3 = container => {
  const d3 = window.d3

  const margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width =
      Math.min(document.documentElement.clientWidth, window.innerWidth, 960) -
      margin.left -
      margin.right,
    height =
      Math.min(document.documentElement.clientHeight, window.innerHeight, 500) -
      margin.top -
      margin.bottom,
    padding = 0.3

  const x = d3
    .scaleBand()
    .rangeRound([0, width])
    .padding(padding)

  const y = d3.scaleLinear().range([height, 0])

  const xAxis = d3.axisBottom(x)

  const yAxis = d3.axisLeft(y).tickFormat(d => {
    return dollarFormatter(d)
  })

  const chart = d3
    .select(`#${container}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  d3.csv("/data/waterfall.csv").then(data => {
    // Transform data (i.e., finding cumulative values and total) for easier charting
    let cumulative = 0
    for (let i = 0; i < data.length; i++) {
      data[i].value = +data[i].value
      data[i].start = cumulative
      cumulative += data[i].value
      data[i].end = cumulative

      data[i].class =
        data[i].value >= 0 ? chartClasses.positive : chartClasses.negative
    }
    data.push({
      name: "Total",
      end: cumulative,
      start: 0,
      class: chartClasses.total,
    })

    x.domain(
      data.map(function(d) {
        return d.name
      })
    )
    y.domain([
      0,
      d3.max(data, function(d) {
        return d.end
      }),
    ])

    chart
      .append("g")
      .attr("class", `x ${chartClasses.axis}`)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    chart
      .append("g")
      .attr("class", `y ${chartClasses.axis}`)
      .call(yAxis)

    const bar = chart
      .selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", d => {
        return `${chartClasses.bar} ${d.class}`
      })
      .attr("transform", d => {
        return "translate(" + x(d.name) + ",0)"
      })

    bar
      .append("rect")
      .attr("y", d => {
        return y(Math.max(d.start, d.end))
      })
      .attr("height", d => {
        return Math.abs(y(d.start) - y(d.end))
      })
      .attr("width", x.bandwidth())

    bar
      .append("text")
      .attr("x", x.bandwidth() / 2)
      .attr("y", d => {
        return y(d.end) + 5
      })
      .attr("dy", d => {
        return (d.class === chartClasses.negative ? "-" : "") + ".75em"
      })
      .text(d => {
        return dollarFormatter(d.end - d.start)
      })

    bar
      .filter(d => {
        return d.class !== chartClasses.total
      })
      .append("line")
      .attr("class", chartClasses.connector)
      .attr("x1", x.bandwidth() + 5)
      .attr("y1", d => {
        return y(d.end)
      })
      .attr("x2", x.bandwidth() / (1 - padding) - 5)
      .attr("y2", d => {
        return y(d.end)
      })
  })

  function dollarFormatter(n) {
    n = Math.round(n)
    let result = n

    if (Math.abs(n) > 1000) {
      result = Math.round(n / 1000) + "K"
    }

    return "$" + result
  }
}

class Waterfall extends Component {
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
    const { slug, title } = { slug: "waterfall", title: "Waterfall Chart" }

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
                href="http://bl.ocks.org/chucklam/f3c7b3e3709a0afd5d57"
                target="_blank"
                rel="noopener noreferrer"
              >
                http://bl.ocks.org/chucklam/f3c7b3e3709a0afd5d57
              </a>
            </p>
            <div className={classes.gatsbyHighlight}>
              <pre
                className="language-js"
                data-language="javascript"
                data-src="/libs/prism.js"
              >
                <code className="language-js">{`const initD3 = container => {
  const d3 = window.d3

  const margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width =
      Math.min(document.documentElement.clientWidth, window.innerWidth, 960) -
      margin.left -
      margin.right,
    height =
      Math.min(document.documentElement.clientHeight, window.innerHeight, 500) -
      margin.top -
      margin.bottom,
    padding = 0.3

  const x = d3
    .scaleBand()
    .rangeRound([0, width])
    .padding(padding)

  const y = d3.scaleLinear().range([height, 0])

  const xAxis = d3.axisBottom(x)

  const yAxis = d3.axisLeft(y).tickFormat(d => {
    return dollarFormatter(d)
  })

  const chart = d3
    .select(\`#$\{container}\`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  d3.csv("/data/waterfall.csv").then(data => {
    // Transform data (i.e., finding cumulative values and total) for easier charting
    let cumulative = 0
    for (let i = 0; i < data.length; i++) {
      data[i].value = +data[i].value
      data[i].start = cumulative
      cumulative += data[i].value
      data[i].end = cumulative

      data[i].class =
        data[i].value >= 0 ? chartClasses.positive : chartClasses.negative
    }
    data.push({
      name: "Total",
      end: cumulative,
      start: 0,
      class: chartClasses.total,
    })

    x.domain(
      data.map(function(d) {
        return d.name
      })
    )
    y.domain([
      0,
      d3.max(data, function(d) {
        return d.end
      }),
    ])

    chart
      .append("g")
      .attr("class", \`x $\{chartClasses.axis}\`)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    chart
      .append("g")
      .attr("class", \`y $\{chartClasses.axis}\`)
      .call(yAxis)

    const bar = chart
      .selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", d => {
        return \`$\{chartClasses.bar} $\{d.class}\`
      })
      .attr("transform", d => {
        return "translate(" + x(d.name) + ",0)"
      })

    bar
      .append("rect")
      .attr("y", d => {
        return y(Math.max(d.start, d.end))
      })
      .attr("height", d => {
        return Math.abs(y(d.start) - y(d.end))
      })
      .attr("width", x.bandwidth())

    bar
      .append("text")
      .attr("x", x.bandwidth() / 2)
      .attr("y", d => {
        return y(d.end) + 5
      })
      .attr("dy", d => {
        return (d.class === chartClasses.negative ? "-" : "") + ".75em"
      })
      .text(d => {
        return dollarFormatter(d.end - d.start)
      })

    bar
      .filter(d => {
        return d.class !== chartClasses.total
      })
      .append("line")
      .attr("class", chartClasses.connector)
      .attr("x1", x.bandwidth() + 5)
      .attr("y1", d => {
        return y(d.end)
      })
      .attr("x2", x.bandwidth() / (1 - padding) - 5)
      .attr("y2", d => {
        return y(d.end)
      })
  })

  function dollarFormatter(n) {
    n = Math.round(n)
    let result = n

    if (Math.abs(n) > 1000) {
      result = Math.round(n / 1000) + "K"
    }

    return "$" + result
  }
}`}</code>
              </pre>
            </div>
          </div>
          <Disqus slug={slug} title={title} />
        </div>
      </Layout>
    )
  }
}

export default Waterfall
