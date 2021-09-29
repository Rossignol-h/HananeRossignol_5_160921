const getOrder = JSON.parse(localStorage.getItem("orderFinal"))
const orderContainer = document.getElementById("order-container")
orderContainer.innerHTML += `
        <h1>Merci ${getOrder.contact.firstName} ${getOrder.contact.lastName}
        </h1></br></br>
        <p>Votre commande Numéro :<br><strong>${getOrder.orderId}</strong></br>
            D'un montant de : <strong>${getOrder.sum.toLocaleString(
              "fr-FR"
            )} €</strong>
            est en cours de traitement.</br></br></p>
        <p>Dès l'envoi de votre commande, un email vous sera envoyé à l'adresse : </br><strong>${
          getOrder.contact.email
        }</strong> 
        </p>
    `
