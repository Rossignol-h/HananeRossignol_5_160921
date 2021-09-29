//--------------------------------------------------- const declaration ----------
const storageProducts = JSON.parse(localStorage.getItem("cartProduct"))
  ? JSON.parse(localStorage.getItem("cartProduct"))
  : []
const cartContainer = document.getElementById("cart-container")
const oneRow = document.getElementById("one-row")
const priceContent = document.getElementsByClassName("price-content")
const deleteText = document.getElementById("delete-text")
const deleteCart = document.getElementById("delete-cart")
const totalContent = document.getElementById("total-content")
const formContainer = document.getElementById("form-container")

//--------------------------------------- loop for display products ---------------

storageProducts.forEach((product, i) => {
  oneRow.innerHTML += `
  <tr data-id=${product.id}>
    <th id="th" scope="row">
    <div>${product.name}</div>
      <img class="cart-img" width="100" src="${product.image}" alt="Appareil photo">
    </th>
    <td data-label="Option :">${product.lenses}</td>
    <td data-label="Prix :">${product.price}</td>
    <td data-label="Quantité :">${product.quantity}</td>
    <td data-label="Total :"class="price-content">${product.total} €</td>
    <td data-label="Supprimer :">
        <img class="icon-md bin-one"
          data-id=${product.id}
          src="./public/images/icons/bin.svg"
          alt="icone d'une poubelle"
          aria-hidden="true"
          height="24"
          width="24"
         />
    </td> 
  </tr>`

  //------------------------------------ sum of all prices for final total --------

  let sum = 0
  for (i = 0; i < priceContent.length; i++) {
    sum += parseInt(priceContent[i].textContent)
    totalContent.innerHTML = sum.toLocaleString("fr-FR")
  }

  //-------------------------------------------- delete 1 product from cart -------
  cartContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("bin-one")) {
      let bin = event.target
      bin.parentElement.parentElement.remove()

      //----------------------------------------- Update total display ------------
      let sum = 0
      for (i = 0; i < priceContent.length; i++) {
        sum += parseInt(priceContent[i].innerHTML)
        totalContent.innerHTML = sum.toLocaleString("fr-FR")
      }
      //------------------------------------------ Update cart in local storage ---

      let updateCart = JSON.parse(localStorage.getItem("cartProduct"))
      updateCart.splice(updateCart.indexOf(updateCart[i]), 1)
      localStorage.setItem("cartProduct", JSON.stringify(updateCart))
    }
    if (priceContent.length < 1) {
      deleteText.innerHTML = "Votre panier est vide"
      totalContent.innerHTML = 0
    }
  })
  //------------------------------------------------ Delete all the cart ---------

  deleteCart.addEventListener("click", deleteAllCart)

  function deleteAllCart() {
    if (confirm("Désirez-vous vraiment supprimer tout les produits ?")) {
      cartContainer.remove()
      localStorage.clear()
      window.location.reload()
    }
  }

  //----------------------------------------- form validation order --------------
  formContainer.innerHTML = `
    <h2 class="form-title">Merci de remplir ce formulaire de commande</h2>
    <form id="form">
      <div class="prenom row mt-4">
        <div class="form-group col-auto">
          <label for="prenom">Prénom: </label>
          <input class="form-control" name="prenom" id="prenom" type="text"
            placeholder="Emmanuel"
            required
            pattern="[A-zÀ-ÿ'\s-]{2,25}"
            title="Seulement des lettres merci">
        </div>
        <div class="nom form-group col-auto">
          <label for="nom">Nom: </label>
          <input class="form-control" name="nom" id="nom" type="text"
            placeholder="Macron"
            required
            pattern="[A-zÀ-ÿ'\s-]{2,25}"
            title="Seulement des lettres merci">
        </div>
      </div>
      <div class="adresse form-group mt-4">
        <label for="adresse">Adresse: </label>
        <input class="form-control" name="adresse" id="adresse" type="text"
          placeholder="55 Rue du Faubourg Saint-Honoré"
          pattern="[A-Za-z0-9- éè]{5,40}" required>
      </div>
      <div class="ville row mt-4">
        <div class="form-group col-md-6">
          <label for="ville">Ville: </label>
          <input class="form-control" name="ville" id="ville" type="text"
            placeholder="Paris"
            pattern="[A-zÀ-ÿ'\s-]{1,25}"
            title="Seulement des lettres merci" required>
        </div>
        <div class="form-group col-md-6">
          <label for="email">E-mail : </label>
          <input class="form-control" name="email" id="email" type="text"
            placeholder="e.macron@gmail.com"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$"
            title="Votre email n'est pas valide" required>
        </div>
      </div>
      <button class="btn btn-primary mt-5" type="submit">Commander</button>
    </form>`

  //-------------------------------------------- On submit get all data -----------

  formContainer.addEventListener("submit", function (event) {
    event.preventDefault()
    const firstName = document.getElementById("prenom").value
    const lastName = document.getElementById("nom").value
    const address = document.getElementById("adresse").value
    const city = document.getElementById("ville").value
    const email = document.getElementById("email").value

    //--------------------------------create 2 objects to send to Api-------------
    const contact = {
      // all data from the form
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    }

    const products = storageProducts.map((cart) => {
      return cart.id // all ids product from the cart
    })

    //-----------------------------------------  send to order to Backend ---------
    async function sendToApi() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/cameras/order",
          {
            method: "POST",
            body: JSON.stringify({ contact, products }),
            headers: new Headers({ "Content-Type": "application/json" }),
          }
        )
        const orderData = await response.json()
        return orderData
      } catch (error) {
        console.error(error)
      }
    }
    //---------------------------------- local storage ----------------------------

    sendToApi().then((orderData) => {
      const orderId = orderData.orderId
      const order = { orderId, sum, contact }
      localStorage.clear()
      localStorage.setItem("orderFinal", JSON.stringify(order))

      const okConfirm = localStorage.getItem("orderFinal")
      //-- if order exist in local storage  then redirect to confirm page  ---
      if (okConfirm) {
        window.location = "confirmation.html"
      } else {
        window.alert(
          "Nous sommes desolé votre commande n'a pas pu aboutir, merci de la renouveler"
        )
      }
    })
  })
})
