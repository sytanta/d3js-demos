const React = require("react")

exports.onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  setHeadComponents([
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/themes/prism-coy.min.css"
      rel="stylesheet"
    />,
    <script src="https://d3js.org/d3.v5.min.js"></script>,
  ])

  setPostBodyComponents([
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/components/prism-core.min.js" data-manual></script>,
    <script src="/libs/prism-highlight.js"></script>,
  ])
}
