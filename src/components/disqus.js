import React, { Component } from "react"

import { DiscussionEmbed } from "disqus-react"

export default class Disqus extends Component {
  render() {
    const { slug, title } = this.props

    const disqusConfig = {
      shortname: process.env.GATSBY_DISQUS_NAME,
      config: { identifier: slug, title: title },
    }

    return (
      <div style={{ marginTop: "1rem" }}>
        <DiscussionEmbed {...disqusConfig} />
      </div>
    )
  }
}
