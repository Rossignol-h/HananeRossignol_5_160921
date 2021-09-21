const productContainer = document.getElementById("product-container")
const lensesChoice = document.getElementById("lenses-choice")
const quantityChoice = document.getElementById("quantity-choice")
const btnAddCart = document.getElementById("btn-add-cart")
const params = new URLSearchParams(window.location.search)
const id = params.get("id")

//--------------------------------- connect to API and get response in JSON ------
async function getProductApi() {
  try {
    const response = await fetch("http://localhost:3000/api/cameras/" + id)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

//-------------------------------------------------- show product section----------
getProductApi().then((product) => {
  productContainer.innerHTML += `
<div class="d-flex card bg-dark" id="card-product">
    <div class="row">
        <div class="col-sm-6">
          <img class="item-img" width="100%" height="100%" 
          src="${product.imageUrl}" alt="Appareil photo">
        </div>
        <div class="col-sm-6">
          <div class="card-body text-center">
            <h1 class="card-title pb-4">${product.name}</h1>
            <p class="card-text">${product.description}</p>
            <p class="card-text lead">${product.price.toFixed(2) / 100} €</p>
          </div>
        </div>          
    </div> 
</div>
`
  //-------------------------------------------- lenses choice --------------------

  for (let i = 0; i < product.lenses.length; i++) {
    let lenses = product.lenses[i]
    lensesChoice.innerHTML +=
      '<option id="lensesChoice" value="' + lenses + '">' + lenses + "</option>"
  }

  //-------------------------------------------- quantity choice ------------------
  for (i = 1; i <= 5; i++) {
    let quantity = [i]
    quantityChoice.innerHTML +=
      '<option id="quantityChoice" value="' +
      quantity +
      '">' +
      quantity +
      "</option>"
  }

  //------------------------------------------ On click define an Object --------

  btnAddCart.addEventListener("click", function () {
    if (0 < quantityChoice.value && quantityChoice.value < 6) {
      const listProduct = {
        id: product._id,
        name: product.name,
        image: product.imageUrl,
        lenses: lensesChoice.value,
        price: product.price / 100,
        quantity: quantityChoice.value,
        total: (product.price * quantityChoice.value) / 100,
      }

      //---------------------------------- Section to deal with local storage -----

      if (typeof localStorage != "undefined") {
        //create const to check if in local storage cartProduct exist
        const checkCart = localStorage.getItem("cartProduct")
        let product

        if (checkCart != null) {
          window.alert("Votre produit a été ajouté")
          product = JSON.parse(checkCart) //send object
        } else {
          window.alert("Premier ajout au panier")
          product = [] //initialize an array
        }
        product.push(listProduct) //add the new product to the array

        //------------------------ Send everything to local storage ------------

        localStorage.setItem("cartProduct", JSON.stringify(product))
      } else {
        window.alert(
          "Une erreur est survenue, merci de renouveller votre achat"
        )
      }
    } else {
      // for quantity check
      window.alert("Merci de selectionner une quantité !")
    }
  })
})
