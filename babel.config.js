module.exports = {
    plugins: [
        '@babel/plugin-transform-react-jsx'
    ],
    presets: [
        '@babel/preset-react',
        ['@babel/preset-env', { targets: { node: 'current' } }],
    ]
};
