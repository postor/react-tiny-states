const { join } = require('path')
module.exports = {
  entry: './dist/client.js',
  output: {
    path: join(__dirname, 'public'),
    filename: 'main.js'
  }
}