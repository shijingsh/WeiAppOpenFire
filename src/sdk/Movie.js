class Movie {
  constructor(url){
    this.url = url
  }
  getMoviewData () {
    console.log(this.url)
  }
}

module.exports = Movie