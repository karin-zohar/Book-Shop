'use strict'

var gTrans = {
    title: {
        en: 'a bookish dream',
        he: 'חלום ספרותי'
    },
    'add-book-label': {
        en: 'Add book:',
        he: 'הוספת ספר:'
    },
    'add-book-title-label': {
        en: 'Book title:',
        he: 'כותרת הספר:'
    },
    'add-book-title-input': {
        en: 'Enter book title',
        he: 'הכניסו כותרת'
    },
    'add-book-price-label': {
        en: 'Book Price:' ,
        he: 'מחיר הספר:'
    },
    'add-book-btn': {
        en: 'Add',
        he: 'הוספה'
    },
    'sort-by-label': {
        en: 'Sort by:',
        he: 'מיון לפי:'
    },
    'sort-option-title': {
        en: 'Title',
        he: 'כותרת'
    },
    'sort-option-author': {
        en: 'Author',
        he: 'מחבר.ת'
    },
    'sort-option-price': {
        en: 'Price',
        he: 'מחיר'
    },
    'sort-option-rating': {
        en: 'Rating',
        he: 'דירוג'
    },
    'filter-by-title': {
        en: 'Filter By',
        he: 'סינון לפי:'
    },
    'checkbox-price-label': {
        en: 'Maximum Price',
        he: 'מחיר עד'
    },
    'checkbox-rating-label': {
        en: 'Minimum rating',
        he: 'דירוג מינימלי'
    },
    'filter-btn': {
        en: 'Filter',
        he: 'סינון'
    },
    'th-id': {
        en: 'ID',
        he: 'מק"ט'
    },
    'th-title': {
        en: 'Title',
        he: 'כותרת'
    },
    'th-price': {
        en: 'Price ($)',
        he: 'מחיר (ש"ח)'
    },
    'th-actions': {
        en: 'Actions',
        he: 'פעולות'
    },
    'delete-btn': {
        en: 'Delete',
        he: 'מחיקה'
    },
    'update-btn': {
        en: 'Reprice',
        he: 'עדכון'
    },
    'details-btn': {
        en: 'Details',
        he: 'פרטים'
    },
    'price-title': {
        en: 'Price:',
        he: 'מחיר:'
    },
    'rating-title': {
        en: 'Rating:',
        he: 'דירוג:'
    },
    'summary-title': {
        en: 'Summary:',
        he: 'תקציר:'
    }


}

var gCurrLang = 'en'


function getTrans(transKey) {
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'
    let transTxt = transMap[gCurrLang]
    if (!transTxt) transTxt = transMap.en
    return transTxt
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const transTxt = getTrans(transKey)
        //support placeholder
        if (el.placeholder) el.placeholder = transTxt
        else el.innerText = transTxt
    })
}

function setLang(lang) {
    gCurrLang = lang
}
