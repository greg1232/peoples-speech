import React from 'react';

import { LineChart, Line, XAxis, Tooltip, CartesianGrid, Brush, ReferenceLine } from 'recharts';

export default class ThresholdChart extends React.Component {
    static displayName = "ThresholdChart";

    getAudioData() {
        let buckets = {};

        for (const audio of this.props.audios) {
            if (!(audio.label in buckets)) {
                buckets[audio.label] = {};
            }
            let bucket = Math.round(audio.score * this.props.buckets);
            if (!(bucket in buckets[audio.label])) {
                buckets[audio.label][bucket] = 0;
            }
            ++buckets[audio.label][bucket];
        }

        let data = [];

        for (var i = 0; i < this.props.buckets; ++i) {
            let bucket = i * (1.0 / this.props.buckets);
            let entry = {threshold: bucket};
            for (const concept of this.props.concepts) {
                entry[concept] = 0;
                if (concept in buckets) {
                    if (i in buckets[concept]) {
                        entry[concept] = buckets[concept][i];
                    }
                }
            }
            data.push(entry);
        }

        console.log(data);

        return data;
    }

    render() {
        let data = this.getAudioData();

        return (
            <div className="line-charts">

                <p>Threshold Chart</p>

                <div className="line-chart-wrapper" style={{ padding: 40 }}>
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{top: 10, bottom: 10, left: 30, right: 30}}
                    >
                        <XAxis dataKey="threshold" type="number" />

                        <CartesianGrid stroke="#f5f5f5"/>
                        <Brush />
                        <Tooltip filterNull={false} />
                        <Line type="monotone" key="0" dataKey="none" stroke="red" strokeWidth={5} yAxisId={0}  />
                        <Line type="monotone" key="2" dataKey="prestamo" stroke="green" yAxisId={1} activeDot={{fill: '#387908', stroke: 'none', r: 6}}/>
                        <ReferenceLine x={this.props.threshold} stroke="black" label="Threshold" />
                    </LineChart>
                </div>
            </div>
        );
    }
}

const audios = [
    { score: 0.1, label : "none" },
    { score: 0.1, label : "none" },
    { score: 0.2, label : "none" },
    { score: 0.3, label : "none" },
    { score: 0.4, label : "none" },
    { score: 0.5, label : "none" },
    { score: 0.9, label : "none" },
    { score: 0.7, label : "prestamo" },
    { score: 0.77, label : "prestamo" },
    { score: 0.8, label : "prestamo" },
];

ThresholdChart.defaultProps = {
    audios: audios,
    threshold: 0.3,
    buckets: 20,
    concepts: ["none", "prestamo"]
};

