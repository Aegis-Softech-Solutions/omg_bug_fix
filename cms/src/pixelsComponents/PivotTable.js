import React from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
// import Plot from "react-plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";

import { Radio } from "antd";
//create Plotly React component via dependency injection
const Plot = createPlotlyComponent(window.Plotly);
// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

// see documentation for supported input formats

class PivotTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };

    //create data
  }

  onChange = event => {
    this.props.changeToNormalView();

    // let checked = event.target.checked
    // console.log("checked", checked);
  };

  render() {
    const data = [this.props.pivotColumns, ...this.props.pivotData];
    return (
      <div className="card-container" style={{ overflowY: "scroll", height: "65vh" }}>
        <Radio.Group
          style={{ float: "right" }}
          defaultValue={this.state.isPivotViewChecked}
          buttonStyle="solid"
          onChange={e => this.onChange(e)}
        >
          <Radio.Button value={0}>Normal View</Radio.Button>
          <Radio.Button value={1}>Pivot View</Radio.Button>
        </Radio.Group>
        <br />
        <br />
        <br />

        <PivotTableUI
          data={data}
          onChange={s => this.setState(s)}
          renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
          // renderers={Object.assign({}, TableRenderers)}
          {...this.state}
        />
      </div>
    );
  }
}

export default PivotTable;
