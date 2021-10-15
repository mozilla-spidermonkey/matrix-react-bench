const path = require("path");

module.exports = {
    mode: "development",
    devtool: false,

    module: {
        rules: [
            {
                test: /RecorderWorklet\.ts$/,
                type: "javascript/auto",
                use: [
                    {
                        loader: "worklet-loader",
                    },
                    {
                        loader: "babel-loader",
                    },
                ],
            },
            {
                test: /\.worker\.ts$/,
                loader: "worker-loader",
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,
                loader: "babel-loader",
            },
            {
                test: /\.(png|svg|woff2)$/,
                loader: "file-loader",
            },
            {
                test: /\.(wasm)$/,
                type: "javascript/auto",
                loader: "file-loader",
            },
        ]
    },

    node: {
        fs: "empty",
    },

    output: {
        globalObject: "globalThis"
    },

    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        mainFields: ['matrix_src_browser', 'matrix_src_main', 'browser', 'main'],

        alias: {
            "$webapp": path.resolve(__dirname, 'webapp'),
        }
    }
};
