module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // root folder for alias
        alias: {
          '@': './src', 
        },
      },
    ],
  ],
};
