module.exports = {
    configureWebpack: config => {
        config.module.rules.push(
            {
                test: require.resolve("threebsp"),
                use: "imports-loader?THREE=three"
            }
        )
    }
}