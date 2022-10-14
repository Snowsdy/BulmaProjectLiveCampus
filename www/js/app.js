/**
 * @author Snowsdy
 * Date : 13/10/2022, 20h52
 */

/**
 * Variables
*/
const URL_COMMENTS = 'http://localhost:3000/comments';
const URL_POST = 'http://localhost:3000/posts';

let burgerNavigation = null;
let burgerButton = null;

let addPostLink = null;
let addPostPage = null;

let homeLink = null;
let homePage = null;

let addPostSubmitForm = null;
let addPostNotificationCloseButton = null;

let addCommentSubmitForm = null;

let articleClickedId = 0;
let isArticleClicked = false;
let oldEvent = null;
/**/

/**
 * CRUD Funtions
 */

/**
 * Function which return all of the object in the database.
 * @param {string} url - the URL of the API. Ex : http://localhost/posts
 */
const getAll = (url) => {
    return getFetch(
        url,
        'get'
    )
        .then((fetchSuccess) => {
            console.log('[DEBUG] getFetch Success', fetchSuccess);
            return fetchSuccess;
        }, (fetchError) => {
            console.log('[DEBUG] ASYNCFetch Error', fetchError);
        });
}

/**
 * Function which return the object thanks to the provided Id.
 * @param {string} url - the URL of the API. Ex : http://localhost/posts
 * @param {number} dataId - The Id of the article
 */
const getById = (url, dataId) => {
    return getFetch(
        url,
        'get',
        {
            id: dataId
        }
    )
        .then((fetchSuccess) => {
            console.log('[DEBUG] getFetch Success', fetchSuccess);
            return fetchSuccess;
        }, (fetchError) => {
            console.log('[DEBUG] ASYNCFetch Error', fetchError);
        });
}

/**
 * Function needed in updateById(url, dataObject) to check if we have a POST or a COMMENT.
 * 
 * Only available in a promise.
 */
const checkParams = (dataObject, fetchSuccess) => {
    // Checking params for bots comments & articles.
    if (dataObject.isPartOf === undefined) {
        dataObject.isPartOf = fetchSuccess.isPartOf;
    } else if (dataObject.content === undefined) {
        dataObject.content = fetchSuccess.content;
    } else if (dataObject.category === undefined) {
        dataObject.category = fetchSuccess.category;
    } else if (dataObject.title === undefined) {
        dataObject.title = fetchSuccess.title;
    }
    return dataObject;
}

/**
 * Function which update the article thanks to the provided data.
 * @param {string} url - the URL of the API. Ex : http://localhost/posts
 * @param {Object} dataObject
 * 
 * POSTS : {id(required),title(not necessary),category(not necessary),content(not necessary)}
 * 
 * COMMENTS : {id(required),isPartOf(not necessary),content(not necessary)}
 */
const updateById = (url, dataObject) => {
    const obj = getById(url, dataObject.id);

    obj.then((fetchSuccess) => {
        // Checking
        dataObject = checkParams(dataObject, fetchSuccess);

        return getFetch(
            url,
            'put',
            dataObject
        )
            .then((fetchSuccess) => {
                console.log('[DEBUG] getFetch Success', fetchSuccess);
                return fetchSuccess;
            }, (fetchError) => {
                console.log('[DEBUG] ASYNCFetch Error', fetchError);
            });
    }, (fetchError) => {
        console.log('[DEBUG] ASYNCFetch Error', fetchError);
    });
}

/**
 * Function which add in the database the new post.
 * @param {string} url - the URL of the API. Ex : http://localhost/posts
 * @param {Object} dataObject (Title, Category, Content)
 */
const create = (url, dataObject) => {
    return getFetch(
        url,
        'post',
        dataObject
    )
        .then((fetchSuccess) => {
            console.log('[DEBUG] getFetch Success', fetchSuccess);
            return fetchSuccess;
        }, (fetchError) => {
            console.log('[DEBUG] ASYNCFetch Error', fetchError);
        });
}

/**
 * Function which delete the article from the database thanks to the provided Id.
 * @param {string} url - the URL of the API. Ex : http://localhost/posts
 * @param {number} dataId - The Id of the article
 */
const deleteById = (url, dataId) => {
    getFetch(
        url,
        'delete',
        {
            id: dataId
        }
    )
        .then((fetchSuccess) => {
            console.log('[DEBUG] getFetch Success', fetchSuccess);
            return fetchSuccess;
        }, (fetchError) => {
            console.log('[DEBUG] ASYNCFetch Error', fetchError);
        });
}
/**/

/**
 * Global Functions
 */

/**
 * Function which show all articles & comments from the db.
 */
const showArticles = () => {
    // Get Articles
    const promise = getAll(URL_POST);

    // Then, build for each of them the skeleton and add it to the corresponding 'ul' tag.
    promise.then((fetchSuccess) => {
        // Get the corresponding 'ul' tag.
        const ul = document.querySelector('#posts-list');

        // Clear before.
        clearPosts();

        // Check if articles exist.
        if (fetchSuccess) {
            // If so, build the skeleton for each of them.
            for (const article of fetchSuccess) {
                // If so, check comments.
                const promise = getFetchWithParameters(URL_COMMENTS, `isPartOf=${article.id}`);
                promise.then((comments) => {
                    // Create the list item Element.
                    const li = document.createElement('li');
                    li.classList.add('p-2');

                    // Build the skeleton with the data.
                    li.innerHTML = buildPostSkeleton(article, comments);

                    // Finally, add them to the 'ul' tag.
                    ul.append(li);
                    bindCard(article.id);
                    bindAddCommentSubmit(article.id);
                }, (fetchError) => {
                    console.log('[DEBUG] showArticles Error while execution', fetchError);
                });
            }
        }
    }, (fetchError) => {
        console.log('[DEBUG] showArticles Error while execution', fetchError);
    });
}


/**
 * Function which bind the notification when data is created
 */
const bindNotificationClose = () => {
    addPostNotificationCloseButton = document.querySelector('.delete');

    addPostNotificationCloseButton.addEventListener('click', () => {
        addPostNotificationCloseButton.parentNode.classList.toggle('is-hidden');
    })
}

/**
 * Function which bind the submit button of the post's form.
 */
const bindAddPostSubmit = () => {
    // Get the '.add-post-form'
    addPostSubmitForm = document.querySelector('.add-post-form');

    // Add a submit event to add the data in the database.
    // Event is required to avoid the refreshing of the page.
    addPostSubmitForm.addEventListener('submit', (e) => {
        // Avoid refreshing
        e.preventDefault();

        // Create the dataObject.
        let dataObject = {
            title: '',
            category: '',
            content: ''
        };

        for (const target of e.target) {
            // Check value before assignation
            if (target.value) {
                // Assignment & clearing fields.
                switch (target.name) {
                    case 'title':
                        dataObject.title = target.value;
                        target.value = '';
                        break;

                    case 'category':
                        dataObject.category = target.value;
                        target.value = 'html';
                        break;

                    case 'content':
                        dataObject.content = target.value;
                        target.value = '';
                        break;

                    default:
                        break;
                }
            }
        }

        // Send the data
        create(URL_POST, dataObject)
            .then((fetchSuccess) => {
                console.log('[DEBUG] bindAddPostSumbit Success : ', fetchSuccess);
                document.querySelector('.add-post-notification').classList.toggle('is-hidden');
            }, (fetchError) => {
                console.log('[DEBUG] bindAddPostSumbit : Error while execution', fetchError);
            });

    });
}

/**
 * Function which bind the sumbit button of the comment's form.
 */
const bindAddCommentSubmit = (articleId) => {
    // Get the '.add-comment-form'
    addCommentSubmitForm = document.querySelector(`.add-comment-form[data-comment-id="${articleId}"]`);

    addCommentSubmitForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Create the dataObject.
        let dataObject = {
            isPartOf: '',
            content: ''
        };

        for (const target of e.target) {
            // Check value before assignation
            if (target.value) {
                // Assignment & clearing fields.
                switch (target.name) {

                    case 'content':
                        dataObject.content = target.value;
                        target.value = '';
                        break;

                    default:
                        break;
                }
            }
        }

        if (dataObject.isPartOf === '') {
            dataObject.isPartOf = e.target.getAttribute('data-comment-id');
        }

        // Send the data
        create(URL_COMMENTS, dataObject)
            .then((fetchSuccess) => {
                console.log('[DEBUG] bindAddCommentSubmit Success : ', fetchSuccess);
                clearPosts();
                showArticles();
                oldArticleId = articleId;
            }, (fetchError) => {
                console.log('[DEBUG] bindAddCommentSubmit : Error while execution', fetchError);
            });
    });

}

/**
 * Function which bind the post card to show info inside it.
 */
const bindCard = (articleId) => {
    // Show the content of the selected article :
    cardButton = document.querySelector(`.card-header[data-post-id="${articleId}"]`, 'TEST');


    cardButton.addEventListener('click', e => {
        if (!isArticleClicked) {
            articleClickedId = articleId;
            oldEvent = e;
        }

        if (articleClickedId === articleId) {
            isArticleClicked = !isArticleClicked;
            e.target.offsetParent.lastElementChild.classList.toggle('is-hidden');
        } else {
            oldEvent.target.offsetParent.lastElementChild.classList.toggle('is-hidden');
            e.target.offsetParent.lastElementChild.classList.toggle('is-hidden');
            articleClickedId = articleId;
            oldEvent = e
        }
    });
}

/**
 * Function which return the skeleton for an article.
 */
const buildPostSkeleton = (article, comments) => {
    const coms = document.createElement('ul');
    for (const comment of comments) {
        const li = document.createElement('li');
        li.classList.add('p-2');

        li.innerHTML = buildCommentSkeleton(comment, article.title);
        coms.append(li);
    }

    const html = `
    <div class="card">
        <section class="card-header" data-post-id="${article.id}">
            <p class="card-header-title">
                <b>${article.title} \
                    <span class="is-size-6 has-background-primary has-text-white p-1 pr-2 pl-2">\
                        ${article.category.toUpperCase()}\
                    </span>
                </b>
            </p>
            <div class="card-header-icon" aria-label="more options">
                <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </div>
        </section>

        <div class="is-hidden container">
            <section class="card-content">
                <p class="content block">
                    ${article.content}
                </p>
            </section>
            <hr />
            <div class="container block comment-form">
                <p class="is-size-5 has-text-centered">Comments</p>
                ${coms.innerHTML}
                ${buildAddCommentForm(article.id)}
            </div>
        </div>
    </div>`;

    return html;
}


/**
 * Function which return the skeleton of a comment.
 */
const buildCommentSkeleton = (comment, articleTitle) => {
    return `
    <!-- COMMENT -->
    <div class="card">
        <section class="card-content">
            <h2 class="size-6"><strong>${articleTitle}</strong></h2>
            <p class="content block">
                ${comment.content}
            </p>
        </section>
    </div>
    <!-- FIN COMMENT -->
    `;
}

/**
 * Function which return the skeleton of the comment form
 */
const buildAddCommentForm = (articleId) => {
    return `
    <div class="container is-max-widescreen mt-3">
        <p class="is-size-4 has-text-centered">Add Comments</p>
        <hr />
        <form action="#" class="add-comment-form p-6" data-comment-id="${articleId}">
        <!-- CONTENT INPUT -->
            <fieldset class="field">
                <label class="label" for="content">Content</label>
                <div class="control">
                    <textarea
                    class="textarea"
                    placeholder="Define Comment content"
                    name="content"
                    id="content"
                    required
                    minlength="2"></textarea>
                </div>
            </fieldset>
        <!-- FIN CONTENT INPUT -->

        <!-- SUBMIT BUTTON -->
            <fieldset class="field">
                <div class="control">
                    <button type="submit" class="button is-primary is-fullwidth">
                        Submit
                    </button>
                </div>
            </fieldset>
        <!-- FIN SUBMIT BUTTON -->
        </form>
    </div>
    `;
}

/**
 * Function which clear the post-list.
 */
const clearPosts = () => {
    const ul = document.querySelector('#posts-list');

    // Remove children if they exist.
    while (ul.firstChild) {
        ul.firstChild.remove();
    }
}

/**
 * This function make the link between the burger button in
 * the navbar.
 */
const initNavigation = () => {
    // Bind HTML tag
    burgerNavigation = document.querySelector('.navbar-menu');
    burgerButton = document.querySelector('.navbar-burger');
    addPostLink = document.querySelector('#add-post-page');
    homeLink = document.querySelector('#home-page');
    addPostPage = document.querySelector('.add-post-page');
    homePage = document.querySelector('.home-page');

    // Bind click event on burger button
    burgerButton.addEventListener('click', () => {
        burgerNavigation.classList.toggle('is-active');
        burgerButton.classList.toggle('is-active');
    });

    // Bind click event on homeLink
    homeLink.addEventListener('click', () => {
        if (homePage.classList.contains('is-hidden')) {
            homePage.classList.toggle('is-hidden');
            addPostPage.classList.toggle('is-hidden');
        }
        clearPosts();
        showArticles();
    });

    // Bind click event on addPostLink
    addPostLink.addEventListener('click', () => {
        if (addPostPage.classList.contains('is-hidden')) {
            homePage.classList.toggle('is-hidden');
            addPostPage.classList.toggle('is-hidden');
        }
    });
}

/**/

/**
 * Wait for DOMContentLoaded :
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('[DEBUG] DOM is loaded');

    //Begin Initialization :
    initNavigation();
    bindAddPostSubmit();
    bindNotificationClose();
    clearPosts();
    showArticles();

    // ALL WORKED WELLLLLLL
    // const promise = getAll('http://localhost:3000/comments');
    // const promise = getById('http://localhost:3000/comments', 1); 
    // const promise = updateById('http://localhost:3000/comments', {
    //     id: 1,
    //     content: `J'ai réussi à te modifier !!!`
    // });
    // const promise = getFetchWithParameters(URL_COMMENTS, 'isPartOf=1');
    // console.log(promise);
})
/**/