'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 5
const gRatingStar = '&#9733;'
const gUnfilledRatingStar = '&#9734;'

var gTitles = [
    'A Conpiracy of Kings',
    'A Monster Calls',
    'Emma',
    'Hell Bent',
    'Jade City',
    'Jade Legacy',
    'Jade War',
    'Jane Eyre',
    'Monsters of Men',
    'Ninth House',
    'Oathbringer',
    'Pride And Prejudice',
    'Return of The Thief',
    'Rhythm of War',
    'The Burning God',
    'The Dragon Republic',
    'The Final Empire',
    'The Hero of Ages',
    'The King of Attolia',
    'The Poppy War',
    'The Queen of Attolia',
    'The Thief',
    'The Way of Kings',
    'The Well of Ascension',
    'Thick As Thieves',
    'What Moves The Dead',
    'Words of Radiance']

var gBooks
var gPageIdx = 0
var gSortDirection = -1 //descending
var gSortBy = 'title'
var gFilterBy = { price: 1000, rating: 0 }

var gStringParams = { filtering: '', readModal: '' }
var gNextIdx = 100



_createBooks()
_storeInitialStringParams()


function getBooks() {
    const books = filterBooks(gBooks)
    const startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}
 
function getPageIdx() {
    return gPageIdx
}

function getNumberOfPages() {
    return Math.ceil(gBooks.length / PAGE_SIZE)
}

function movePage(direction) {
    var lastPage = getNumberOfPages()-1
    if (direction) {
        if (gPageIdx === lastPage) return
        gPageIdx++
    } else {
        if (gPageIdx === 0) return
        gPageIdx--
    }
}

function setPageIdx(pageIdx) {
    gPageIdx = pageIdx
}

function getBookById(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    return gBooks[bookIdx]
}

function getBookByTitle(bookTitle) {
    const bookIdx = gBooks.findIndex(book => bookTitle === book.title)
    return gBooks[bookIdx]
}

function addBook(title, price) {
    const book = _createBook(title, price)

    gBooks.unshift(book)
    _saveBooksToStorage()
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, bookPrice) {
    console.log('bookPrice: ', bookPrice)
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    const book = gBooks[bookIdx]
    book.price = bookPrice
    _saveBooksToStorage()
}

function getRatingString(book) {
    if (!book.rating) return ''
    var ratingString = gRatingStar.repeat(book.rating)
    return ratingString
}

function getUnfilledRatingString(book) {
    if (book.rating === 10) return ''
    if (!book.rating || book.rating < 0) book.rating = 0
    var unfilledRatingString = gUnfilledRatingStar.repeat(10 - book.rating)
    return unfilledRatingString
}

function getBookImgUrl(title) {
    var imgName = title.replaceAll(' ', '-')
    var imgUrl = `img/covers/${imgName}.jpg`
    return imgUrl
}

function changeRating(book, isIncrease) {
    if (isIncrease && book.rating === 10) return
    if (!isIncrease && book.rating === 0) return
    if (isIncrease) book.rating++
    else book.rating--
    _saveBooksToStorage()
}

function setSortDirection(isAscending) {
    gSortDirection = isAscending
    _saveFilteringToStorage()
}

function setSortBy(sortBy) {
    gSortBy = sortBy
    _saveFilteringToStorage()
}

function sortBooks(books) {
    if (gSortBy === 'title' || gSortBy === 'author') {
        books.sort((a, b) => a[gSortBy].localeCompare(b[gSortBy]) * gSortDirection)
    } else {
        books.sort((a, b) => a[gSortBy] - b[gSortBy] * gSortDirection)
    }
}


function setBooksFilter(filterBy) {
    if (filterBy.price !== undefined) gFilterBy.price = +filterBy.price
    if (filterBy.rating !== undefined) gFilterBy.rating = +filterBy.rating
    _saveFilteringToStorage()
    return gFilterBy
}

function filterBooks(books) {
    return books.filter(book => (book.price <= +gFilterBy.price) && (book.rating >= +gFilterBy.rating))
}

function setStringParams(paramObj) {
    var currUrlParams = loadFromStorage('currUrlParams')
    var filteringParam = (paramObj['filtering']) ? paramObj['filtering'] : (currUrlParams['filtering']) 
     
    var readModalParam = (paramObj['readModal']) ? paramObj['readModal'] : (currUrlParams['readModal']) 
    
    gStringParams = { filtering: filteringParam, readModal: readModalParam }
    saveToStorage('currUrlParams', gStringParams)

}

function getStringParams() {
    return gStringParams
}

function getNextIdx() {
    return gNextIdx++
}

// Private Functions

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = gTitles.map(title => _createBook(title, getRandomFloat(1, 25)))
    }
    gBooks = books
    _saveBooksToStorage()
}

function _createBook(title, price) {
    return {
        id: makeId(),
        rating: 1,
        title,
        price,
        imgUrl: getBookImgUrl(title),
        summary: getLorem()
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function _saveFilteringToStorage() {
    saveToStorage('filterBy', gFilterBy)
    saveToStorage('sortBy', gSortBy)
    saveToStorage('sortDirection', gSortDirection)
}

function _loadFilteringFromStorage() {
    gFilterBy = loadFromStorage('filterBy')
    gSortBy = loadFromStorage('sortBy')
    gSortDirection = loadFromStorage('sortDirection')
}

function _storeInitialStringParams() {
    if (!localStorage.currUrlParams) {
        saveToStorage('currUrlParams', { filtering: '', readModal: '' })
    }
}