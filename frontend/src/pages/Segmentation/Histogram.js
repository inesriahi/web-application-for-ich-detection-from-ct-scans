import React from "react";
import Plot from "react-plotly.js";

const Histogram = (props) => {
  console.log(props.data);
  return (
    <Plot
      data={[
        {
          x: props.data[0],
          y: props.data[1],
          type: "bar",
          marker: { color: "white" },
          hovertemplate: "<b>Pixel:</b> %{x}<br><b>Frequency:</b> %{y}",
        },
      ]}
      layout={{
        title: "Distribution Histogram",
        autosize: true,
        margin: {
          t: 30,
          b: 20.5,
          l: 30,
          r: 20.5,
        },
        bargap: 0,
        plot_bgcolor: "#303439",
        paper_bgcolor: "#303439",
        font: {
          color: "white",
          family: "Poppins",
        },
        hovermode: "closest",
        hoverlabel: { bgcolor: "white" },
        xaxis: {
          automargin: true,
          title: { text: "Pixel", standoff: 2 },
          domain: [0, 255],
        },
        yaxis: {
          automargin: true,
          title: { text: "Frequency", standoff: 2 },
        },
      }}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%", padding: "0" }}
    />
  );
};

export default Histogram;
