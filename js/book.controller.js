'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderModalByQueryStringParams()
    renderBooks()
    renderPageButtons()
}

function renderBooks() {
    const elBooksTableHeader = document.querySelector('.books-table-header')
    elBooksTableHeader.classList.remove('hide')
    var books = getBooks()
    if (!books || !books.length) {
        flashMsg(`There are no books that match this criteria.`)
        elBooksTableHeader.classList.add('hide')
    }
    var strHTMLs = books.map(book => `
    <tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.price}</td>
        <td>
            <button onclick="onReadBook('${book.id}')">Details</button>
            <button onclick="onUpdateBook('${book.id}')">Reprice</button>
            <button onclick="onDeleteBook('${book.id}')">Delete</button>
        </td>
    </tr>
    `
    )

    const elBooksTableBody = document.querySelector('.books-table-body')
    elBooksTableBody.innerHTML = strHTMLs.join('')
}

function renderReadModal(book) {
    const elReadModal = document.querySelector('.read-modal')
    elReadModal.classList.remove('hide')
    var strHTML = `
    <button class="close-btn" onClick="onCloseModal()">X</button>
        <img onerror="this.src='img/covers/default.jpg'" src="${book.imgUrl}" alt="${book.title} cover">
        <h2 class="title">${book.title}</h2>
        <h3 class="author">${(book.author) ? book.author : ''}</h3>
        <ul>
            <li>
            <span>Price:</span>
             $${book.price}  
            </li>
            <li>
            <span class="rating-container">
                <span class="rating-title">Rating: </span>
                <span class="rating-filled">${getRatingString(book)}</span><span class="rating-unfilled">${getUnfilledRatingString(book)}</span>
                    <span class ="rating-controller">
                        <button class="rating-btn" onclick="onChangeRating('${book.id}',false)">-</button> 
                        ${book.rating}  
                        <button class="rating-btn" onclick="onChangeRating('${book.id}',true)">+</button>
                    </span>
            </span>
            </li>
            
            <li class="summary">
            <span> Summary: </span>
             
                <article class="summary-txt">
                    ${book.summary}
                </article>
                
            </li>
        </ul>
    `
    elReadModal.innerHTML = strHTML
}

function renderPageButtons() {
    const elPageNumbersContainer = document.querySelector('.page-numbers-container')
    const numberOfPages = getNumberOfPages()
    const currentPageIdx = getPageIdx()
    var strHTML = ''
    for (var i = 0; i < numberOfPages; i++) {
        var currPage = (i === currentPageIdx) ? 'curr-page' : ''
        strHTML += `
        <button class="page-btn ${i + 1} ${currPage}" onclick="onMoveToPage(${i})">${i + 1}</button>
        `
    }
    elPageNumbersContainer.innerHTML = strHTML

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        price: queryStringParams.get('max-price') || 0,
        rating: +queryStringParams.get('min-rating') || 0
    }

    if (!filterBy.price && !filterBy.rating) return

    document.querySelector('#number-price').value = filterBy.price
    document.querySelector('#number-rating').value = filterBy.rating
    setBooksFilter(filterBy)
    // getUrl()

    console.log('filterBy.price: ', filterBy.price)
    console.log('filterBy.rating: ', filterBy.rating)
    if (filterBy.price !== 1000) document.querySelector('#number-price').classList.remove('hide')
    if (filterBy.rating) document.querySelector('#number-rating').classList.remove('hide')
}


function renderModalByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const title = queryStringParams.get('book-details')
    if (!title) return
    var bookTitle = title.replaceAll('-', ' ')
    var book = getBookByTitle(bookTitle)
    renderReadModal(book)
}

function flashMsg(msg, isTimed = true) {
    console.log('flashing')
    console.log('isTimed: ', isTimed)
    const elMsg = document.querySelector('.user-msg')
    elMsg.innerHTML = msg
    elMsg.classList.add('open')
    if (isTimed) {
        setTimeout(() => {
            elMsg.classList.remove('open')
        }, 4000)
    } 
}




function onAddBook(ev) {
    ev.preventDefault()

    const elTitleInput = document.querySelector('.title-input')
    var title = elTitleInput.value
    const elPriceInput = document.querySelector('.price-input')
    var price = +elPriceInput.value
    price = price.toFixed(2)
    addBook(title, price)

    elTitleInput.value = ''
    elPriceInput.value = 0.00
    flashMsg(`${title} was added!`)
    renderBooks()
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    flashMsg('Deleted Book')
}

function onUpdateBook(bookId) {
    var strHTML = `
    <label for="book-price">Book Price:</label>
    <input class="price-input" name="book-price" id="book-reprice" type="number" step=".01" placeholder="0.00">
    <button onclick="onUpdateBtn('${bookId}')">Update</button>
    `
    flashMsg(strHTML, false)
    
    
}

function onUpdateBtn(bookId) {
    const elNewInput = document.querySelector(`#book-reprice`)
    var bookPrice = +elNewInput.value
    bookPrice = bookPrice.toFixed(2)
    updateBook(bookId, bookPrice)
    renderBooks()
    flashMsg('Successfully updated price!')
}


function onReadBook(bookId) {
    const book = getBookById(bookId)
    renderReadModal(book)
    openModal()
    var addressTitle = book.title.replaceAll(' ', '-')
    const queryStringParams = `book-details=${addressTitle}`
    setStringParams({ readModal: queryStringParams })
    getUrl()
}

function onCloseModal() {
    const elReadModal = document.querySelector('.read-modal')
    elReadModal.classList.add('hide')
    setStringParams({ readModal: '' })
}

function openModal() {
    const elReadModal = document.querySelector('.read-modal')
    elReadModal.classList.remove('hide')
}

function onChangeRating(bookId, isIncrease) {
    const book = getBookById(bookId)
    changeRating(book, isIncrease)
    renderReadModal(book)
}

function onSortDirection(isAscending) {
    setSortDirection(isAscending)
    const elSortSelect = document.querySelector('.sort-select')
    setSortBy(elSortSelect.value)
    renderBooks()
}

function showNumInput(checkValue) {
    console.log('showing num input')
    const elNumInput = document.querySelector(`#number-${checkValue.value}`)
    console.log('elNumInput: ', elNumInput)
    elNumInput.classList.toggle('hide')
    elNumInput.classList.toggle('active')
}

function restoreDefaultValue(checkValue) {
    const defaultValues = { price: 1000, rating: 0 }
    const elNumInput = document.querySelector(`#number-${checkValue.value}`)
    const classes = [...elNumInput.classList]
    if (classes.includes('active')) elNumInput.value = defaultValues[checkValue]
}

function onSetFilterBy(ev) {
    ev.preventDefault()
    const filterOptions = ['price', 'rating']
    var filterValues = filterOptions.map(filterOption => document.querySelector(`#number-${filterOption}`).value)
    const filterBy = {}
    filterOptions.forEach((option, idx) => {
        filterBy[option] = filterValues[idx]
    })

    setBooksFilter(filterBy)
    renderBooks()

    const queryStringParams = `max-price=${filterBy.price}&min-rating=${filterBy.rating}`
    setStringParams({ filtering: queryStringParams })
    getUrl()
}

function getUrl() {
    const stringParamsObj = getStringParams()
    var connector = (stringParamsObj['filtering']) ? '&' : ''
    var CombinedQueryStringParams = stringParamsObj['filtering'] + `${connector}` + stringParamsObj['readModal']


    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + CombinedQueryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)


}

function onNav(direction) {
    movePage(direction)
    renderBooks()
    renderPageButtons()
    handleNavArrows()
}

function handleNavArrows() {
    const currPage = getPageIdx()
    const lastPage = getNumberOfPages() - 1
    const elArrowRight = document.querySelector('.nav-right')
    const elArrowLeft = document.querySelector('.nav-left')
    if (currPage === 0) {
        elArrowLeft.classList.add('disabled')
    } else {
        elArrowLeft.classList.remove('disabled')
    }
    if (currPage === lastPage) {
        elArrowRight.classList.add('disabled')
    } else {
        elArrowRight.classList.remove('disabled')
    }
}

function onMoveToPage(pageIdx) {
    setPageIdx(pageIdx)
    renderBooks()
    renderPageButtons()
    handleNavArrows()
} 