//--------------------------  connect to API and get response in JSON ------------
async function getApiProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/cameras")
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
//----------------------------------------------Show product section--------------
const productsContainer = document.getElementById("products-container")
getApiProducts().then((data) => {
  data.forEach((product) => {
    productsContainer.innerHTML += `<div class="col">
          <div id="card-index" class="product card border-0 w-100 h-100">
              <img
                src=${product.imageUrl}
                class="product-img card-img-top"
                alt="appareil photo"
              />
          <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="price card-text">${product.price.toFixed(2) / 100} €</p>
              <a href="product.html?id=${product._id}">
                <button class="btn-detail btn-lg" data-id=${product._id}>
                Détails
                </button>
              </a>
          </div>
        </div>
      </div>`
  })
})
