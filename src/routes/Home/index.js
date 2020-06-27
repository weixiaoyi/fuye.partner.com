import React, { Component } from "react";
import { Inject } from "../../utils";

@Inject(({ homeStore: model }) => ({
  model
}))
class Home extends Component {
  render(){
    console.log(this.props.model,'----------thius.props')
    return <div>hahhaddddddddddddd</div>
  }
}

export default Home
