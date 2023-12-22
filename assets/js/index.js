const loader = document.getElementById('loader');
const productsContainer = document.getElementById('productContainer');
const search = document.getElementById('search');
const list = document.getElementById('list')
const grid = document.getElementById('grid');
let fetchedData;

function toggleListDesign(designType){
    let productCards = document.querySelectorAll('.product-card');
    if(designType=='grid'){
        productCards.forEach(each=>{
            each.classList.add('card-grid')
        })
        productsContainer.classList.add('grid')
    }
    else{
        productsContainer.classList.remove('grid')
        productCards.forEach(each=>{
            each.classList.remove('card-grid')
        })
    }
}

list.addEventListener('click',function(){
    toggleListDesign('list')
})
grid.addEventListener('click',function(){
    toggleListDesign('grid');
})
search.addEventListener('input',function(event){
    let searchValue = event.target.value;
    searchVariants(fetchedData,searchValue);
})
function findTheRelavantVariant(searchValue){
    const colorVariants = document.querySelectorAll('[data-color-variant]');
    colorVariants.forEach(element=>{
        let dataValue = element.dataset.colorVariant.toLowerCase();
        // console.log(dataValue);
        if(searchValue!=='' && dataValue.includes(searchValue.toLowerCase())){
            element.classList.add('search-active');
        }
        else{
            element.classList.remove('search-active');
        }
    })
}
function searchVariants(fetchedData,searchValue){
    fetchedData.forEach(element=>{
        let productVariants = element.product_variants;
        productVariants.forEach(element=>{
            let variantValue = (element['v1'] || element['v2'] || element['v3']).toLowerCase();
            if(variantValue.includes(searchValue)){
                findTheRelavantVariant(searchValue)
            }
        })
    })
}

function productCard(product){
    const card = document.createElement('div');
    card.classList.add('product-card');

    const imageContainer = document.createElement('div');
    const image = document.createElement('img');
    image.alt = 'product-img'
    image.src = product.product_image;

    imageContainer.appendChild(image);
    card.appendChild(imageContainer);

    const descriptionContainer = document.createElement('div');
    const title = document.createElement('h1');
    descriptionContainer.appendChild(title);
    title.textContent = product.product_title;
    product.product_variants.forEach(element=>{
        let paragraph = document.createElement('p');
        paragraph.textContent = element['v1'] || element['v2'] || element['v3'];
        paragraph.dataset.colorVariant = element['v1'] || element['v2'] || element['v3'];
        descriptionContainer.appendChild(paragraph);
    })

    card.appendChild(descriptionContainer)
    

    productsContainer.appendChild(card);
}

function generateProductCards(data){
    data.forEach(element => {
        productCard(element)
    });
    loader.classList.remove('active');
}

async function getProductData(){
    const url = 'https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093'
    const response = await fetch(url);
    const jsonData = await response.json();
    let data = jsonData.data;
    generateProductCards(data);
    fetchedData = data;
    let colorVariants = document.querySelectorAll('[data-color-variant]');
}

loader.classList.add('active');
//gettting data after 3 seconds to show loader
setTimeout(function(){
    getProductData();
},3000)