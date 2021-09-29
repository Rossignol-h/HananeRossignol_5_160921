//--------------------------  connect to API and get response in JSON ------------
async function getApiProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/cameras")
    const data = await response.json()
    return data
  } catch (error) {
    document.getElementById(
      "catch-error"
    ).innerHTML += `Nous sommes désolés une erreur s'est produite, veuillez rafraichir la page`
    console.error(error)
  }
}
//----------------------------------------------Show product section--------------
const productsContainer = document.getElementById("products-container")
getApiProducts().then((data) => {
  data.forEach((product) => {
    product.price = product.price / 100
    productsContainer.innerHTML += `<div class="col">
    <div id="index-card" class="product card border-0 w-100 h-100">
      <img src=${product.imageUrl} class="index-img card-img-top"
        alt="appareil photo"
      />
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <p class="price card-text">${product.price.toLocaleString("fr-FR")} €</p>
      <a href="product.html?id=${product._id}">
      <button class="btn-detail btn-lg" data-id=${product._id}>
        Détails
      </button></a>
    </div>
  </div>
</div>`
  })
})
