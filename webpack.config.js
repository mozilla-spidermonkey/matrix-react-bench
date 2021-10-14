module.exports = {
    mode: "development",
    devtool: false,

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
            }
        ]
    }
};
