/* 
    Declaration
    Define all variables used in the program
*/
let burgerNavigation = null;
let burgerButton = null;
let addPostsButton = null;
let addCommentsButton = null;
let cardButton = null;
let clicked = true;
let articleClickedId = 0;
let isArticleClicked = false;
let oldEvent = null;
let articleTitle = "";
//

/* 
    Functions
    Define all functions used in the progam
*/

/**
    * Function to set burger menu
*/
const initNavigation = () => {
    // Bind HTML tag
    burgerNavigation = document.querySelector('.navbar-menu');
    burgerButton = document.querySelector('.navbar-burger');

    // Bind click event on burger button
    burgerButton.addEventListener('click', () => {
        burgerNavigation.classList.toggle('is-active');
        burgerButton.classList.toggle('is-active');
    })
}

/**
 * Return the data
 * @param {String} dataType
 * @param {String} HttpVerb
 * @param {String} id
 * @param {Object} dataObject
 */
const loadData = (dataType, httpVerb, id = null, dataObject = null) => {

    let url = `http://localhost:3000/${dataType.toLowerCase()}`;

    if (httpVerb.toUpperCase() === 'POST') {
        ASYNCfetch(url, httpVerb.toUpperCase(), dataObject)
            .then(fetchSuccess => {
                console.log('[DEBUG] ASYNCFetch Success', fetchSuccess);
                getFetchDecision(dataType.toLowerCase(), fetchSuccess, null, httpVerb.toUpperCase());
            })
            .catch(fetchError => {
                console.log('[DEBUG] ASYNCFetch Error', fetchError);
            });
    } else {
        ASYNCfetch(url, httpVerb.toUpperCase())
            .then(fetchSuccess => {
                console.log('[DEBUG] ASYNCFetch Success', fetchSuccess);
                getFetchDecision(dataType.toLowerCase(), fetchSuccess, id ? id : null, httpVerb.toUpperCase());
            })
            .catch(err => {
                console.log('[DEBUG] Error : ', err);
            })
    }
}

/**
 * Return the fonction of the type we need (Posts, Comments, etc)
 * @param {string} dataType
 * @param fetchSuccess
 * @param {number} id
 */
const getFetchDecision = (dataType, fetchSuccess, id = null, httpVerb = null) => {
    switch (dataType) {
        case 'posts':
            if (httpVerb === 'POST') {
                loadData(dataType, 'get', null, null)
            } else {
                if (id) {
                    isArticleExistByIsPartOf(fetchSuccess, id);
                } else {
                    loadPostsData(fetchSuccess);
                }
            }
            break;

        case 'comments':
            isContentExistByArticleId(fetchSuccess, id);
            break;

        default:
            break;
    }
}

/** 
 * LoadPostsData
 * Keep on date the 'ul' tag & create each card :
 */
const loadPostsData = (articles) => {
    const ul = document.querySelector('.post-list');

    while (ul.firstChild) {
        ul.firstChild.remove();
    }

    if (articles) {
        for (const article of articles) {
            // Create the list item element :
            const li = document.createElement('li');
            li.className = 'p-2';

            // Generate the card with values :
            li.innerHTML = getCardSkeletton(article);

            // Append list item in the 'ul' tag :
            ul.appendChild(li);
            // Bind each click with his own card
            bindCard(article.id);
        }
        document.querySelector('#post-list').append(ul);
    }
}

const isArticleExistByIsPartOf = (articles, isPartOf) => {
    if (articles) {
        for (const article of articles) {
            if (article.id === isPartOf) {
                console.log(`[DEBUG] isArticleExistByIsPartOf Article finded`, article.title);
                articleTitle = article.title;
            }
        }
    }
}


/**
 * Return true or false if the comment exist or not
 * @param {number} articleId - the article's ID
 */
const isContentExistByArticleId = (comments, articleId) => {
    let commentObjectList = []
    numberOfComments = 0;
    if (comments) {
        for (const comment of comments) {
            if (comment.isPartOf === articleId) {
                // There we have a comment linked to an article
                commentObjectList.push(
                    {
                        id: comment.id,
                        isPartOf: comment.isPartOf,
                        comment: comment.comment
                    }
                )
                numberOfComments++;
            }
        }

        console.log(`[DEBUG] isContentExistByArticleId : Comments detected : ${numberOfComments}`, commentObjectList);

        if (numberOfComments !== 0) {
            // So, populate the Comments's section with the linked comments :
            loadCommentsData(commentObjectList);
            document.querySelector('.no-comment').classList.toggle('is-hidden');
            if (clicked) {
            } else {
                removeComments();
            }
            clicked = !clicked
        }
    }
}

const removeComments = () => {
    const ul = document.querySelector('.comments-list');

    while (ul.firstChild) {
        ul.firstChild.remove();
    }
}

/**
 * Return all comments of the article 
 */
const loadCommentsData = (comments) => {
    const ul = document.querySelector('.comments-list');

    const li = document.createElement('li');
    li.className = 'p-2';

    for (const comment of comments) {
        li.innerHTML = getCommentSkeleton(comment);
        ul.appendChild(li)
    }

    document.querySelector('#comments-list').append(ul);
}

/**
 * Function which return the skeleton of the card :
 */
const getCardSkeletton = (article) => {
    return `
    <div class="card">
        <section class="card-header">
            <p class="card-header-title">
                <b>${article.title} \
                    <span class="is-size-6 has-background-primary has-text-white p-1 pr-2 pl-2">\
                        ${article.category.toUpperCase()}\
                    </span>
                </b>
            </p>
            <button class="card-header-icon" aria-label="more options" data-post-id="${article.id}">
                <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </button>
        </section>

        <div class="is-hidden">
            <section class="card-content">
                <p class="content block">
                    ${article.content}
                </p>
            </section>
        </div>
    </div>`;
}

/**
 * Function which return the skeleton of the comment :
 */
const getCommentSkeleton = (comment) => {
    return `
    <div class="card">
        <section class="card-content">
            <h2 class="size-6">${articleTitle}</h2>
            <p class="content block">
                ${comment.comment}
            </p>
        </section>
    </div>`;
}

/**
    * Function to bind post form submit
*/
const bindAddPostSubmit = () => {
    addPostForm = document.querySelector('form');

    addPostForm.addEventListener('submit', (event) => {
        // Stop event default function
        event.preventDefault();


        // Create Object :
        let dataObject = {
            title: '',
            category: '',
            content: ''
        };

        for (const target of event.target) {
            // TODO : check value before create object :
            if (target.value) {
                // Value checked
                console.log('[DEBUG] form value', target.name, target.value)
                target.name === 'title' ? dataObject.title = target.value : "";
                target.name === 'category' ? dataObject.category = target.value : "";
                target.name === 'content' ? dataObject.content = target.value : "";
                target.name === 'category' ? target.value = 'html' : target.value = '';
            }
        }


        // Send fetch request :
        loadData('posts', 'post', null, dataObject)
    })
}

/**
 * Function to bind the button to show the post's form
 */
const bindAddPostButton = () => {
    addPostsButton = document.querySelector('.add-posts');

    addPostsButton.addEventListener('click', e => {
        // First show the form :
        e.target.nextElementSibling.nextElementSibling.classList.toggle('is-hidden')

        // Then, change the button's style :
        if (e.target.innerText === 'Show Add Posts Form') {
            e.target.classList.replace('is-primary', 'is-danger')
            e.target.innerText = 'Hide Add Posts Form'
        } else {
            e.target.classList.replace('is-danger', 'is-primary')
            e.target.innerText = 'Show Add Posts Form'
        }
    })
}

/**
 * Function to bind the button to show the comment's form
 */
const bindAddCommentButton = () => {
    addCommentsButton = document.querySelector('.add-comments');

    addCommentsButton.addEventListener('click', e => {
        console.log(e);
        // First show the form :
        e.target.nextElementSibling.nextElementSibling.classList.toggle('is-hidden')

        // Then, change the button's style :
        if (e.target.innerText === 'Show Add Comments Form') {
            e.target.classList.replace('is-primary', 'is-danger')
            e.target.innerText = 'Hide Add Comments Form'
        } else {
            e.target.classList.replace('is-danger', 'is-primary')
            e.target.innerText = 'Show Add Comments Form'
        }
    })
}

//

/**
 * Function to bind the click to the content & comments of the article in the card :
 * @param {number} articleId
 */
const bindCard = (articleId) => {
    // Show the content of the selected article :
    cardButton = document.querySelector(`[data-post-id="${articleId}"]`);

    cardButton.addEventListener('click', e => {
        if (!isArticleClicked) {
            articleClickedId = articleId;
            oldEvent = e;
        }

        if (articleClickedId === articleId) {
            isArticleClicked = !isArticleClicked;
            e.target.offsetParent.lastElementChild.classList.toggle('is-hidden');
            // Then, we need to check if comments exist, if so, show them :
            loadData('posts', 'get', articleId);
            loadData('comments', 'get', articleId);
        } else {
            oldEvent.target.offsetParent.lastElementChild.classList.toggle('is-hidden');
            // Then, we need to check if comments exist, if so, show them :
            loadData('posts', 'get', articleClickedId);
            loadData('comments', 'get', articleClickedId);

            e.target.offsetParent.lastElementChild.classList.toggle('is-hidden');
            // Then, we need to check if comments exist, if so, show them :
            loadData('posts', 'get', articleId);
            loadData('comments', 'get', articleId);
            articleClickedId = articleId;
            oldEvent = e
        }
    });

}
//

/* 
    Wait for DOM content
*/
document.addEventListener('DOMContentLoaded', e => {
    console.log('DOM is loaded');
    initNavigation();
    bindAddPostButton();
    bindAddCommentButton();
    bindAddPostSubmit();
    loadData('posts', 'get')
});

//