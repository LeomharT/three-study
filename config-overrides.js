const { override, overrideDevServer, addBabelPreset, addDecoratorsLegacy, addWebpackPlugin } = require('customize-cra');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    webpack: override(
        (config) =>
        {
            return config;
        },
        addDecoratorsLegacy(),
        addBabelPreset([
            '@babel/preset-typescript',
            /** Allow declare keyword */
            { allowDeclareFields: true }
        ]),
        addWebpackPlugin(new ProgressBarPlugin())
    ),
    devServer: overrideDevServer(config =>
    {
        config.headers = {
            'Access-Control-Allow-Origin': '*',
        };
        config.historyApiFallback = { disableDotRule: true };

        config.client.logging = 'verbose';

        return config;
    })
};
