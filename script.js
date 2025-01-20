//ANIMATE
AOS.init();


const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const closeModalBtn2 = document.getElementById("close-modal-btn2");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const PersonName = document.getElementById("PersonName");
const PersonPhone = document.getElementById("PersonPhone");
const paymentMethod = document.getElementById("paymentMethod");
const deliveryDate= document.getElementById("deliveryDate");


let cart = [];


//Abrir Modal do Carrinho
cartBtn.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'flex'
})

//Fechar o Modal do Carrinho
cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none"

    }

})
closeModalBtn.addEventListener('click', (event) => {
    cartModal.style.display = "none"
})

closeModalBtn2.addEventListener('click', (event) => {
    cartModal.style.display = "none"
})

menu.addEventListener("click", (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }

})


//Função para adicionar ao carrinho

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;

    } else {
     cart.push({
        name,
        price,
        quantity: 1,

        })            
    }

    updateCartModal()
}

//Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemsElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade: 
                    <button class="decrease-quantity-btn bg-red text-white px-2 rounded" data-name="${item.name}">-</button>
                    ${item.quantity}
                    <button class="increase-quantity-btn bg-green text-white px-2 rounded" data-name="${item.name}">+</button>
                </p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="remove-from-cart-btn text-red" data-name="${item.name}">Remover</button>
            </div>
        </div>
        `;
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função para alterar a quantidade do item no carrinho
cartItemsContainer.addEventListener("click", (event) => {
    const name = event.target.getAttribute("data-name");

    if (event.target.classList.contains("increase-quantity-btn")) {
        changeItemQuantity(name, 1);
    } else if (event.target.classList.contains("decrease-quantity-btn")) {
        changeItemQuantity(name, -1);
    } else if (event.target.classList.contains("remove-from-cart-btn")) {
        removeItemCart(name);
    }
});

function changeItemQuantity(name, change) {
    const item = cart.find(item => item.name === name);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeItemCart(name);
        } else {
            updateCartModal();
        }
    }
}

//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click",(event)=>{
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
  const index = cart.findIndex(item=> item.name === name);

  if(index !== -1){
    const item = cart[index];

    if(item.quantity > 1){
        item.quantity -= 1;
        updateCartModal();
        return;
    }
    cart.splice(index,1);
    updateCartModal();
  }
}

addressInput.addEventListener("input",(event)=>{
  let inputValue = event.target.value;

  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")

  }
})

//Finalizar Pedido
checkoutBtn.addEventListener("click",()=>{

 const isOpen = checkRestaurantOpen();
   if(!isOpen){
    Toastify({
        text: "O restaurante está fechado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
    }).showToast();

    return;
}

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api whatsapp
    const initialMessage = `Olá me chamo ${PersonName.value} e gostaria de cotar o seguinte orçamento:\n`;

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity})\n`
        );
    }).join("");

    const message = encodeURIComponent(
        `${initialMessage}\n${cartItems}\nTelefone: ${PersonPhone.value}\nNome: ${PersonName.value}\nEndereço: ${addressInput.value}\nMétodo de Pagamento: ${paymentMethod.value}\nPrazo de recebimento: ${deliveryDate.value}`
    );
    const phone = "5551985434503";


    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

 cart = [];
 updateCartModal();
    
})



function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 18; //true = restaurante esta aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
}