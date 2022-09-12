const { override, overrideDevServer, addBabelPreset, addDecoratorsLegacy, addWebpackPlugin } = require('customize-cra');


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
