/**
 * @author Snowsdy
 * Date : 13/10/2022, 20h52
 */

/**
 * Variables
*/
/**/

/**
 * CRUD Funtions
 */

/**
 * Function which return all of the object in the database.
 * @param {string} url - the URL of the API. Ex : http://localhost/posts
 */
const getAll = (url) => {
    getFetch(
        url,
        'get'
    )
        .then((fetchSuccess) => {
            console.log('[DEBUG] getFetch Success', fetchSuccess);
            // TODO : ?
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
    getFetch(
        url,
        'get',
        {
            id: dataId
        }
    )
        .then((fetchSuccess) => {
            console.log('[DEBUG] getFetch Success', fetchSuccess);
            // TODO : ?
        }, (fetchError) => {
            console.log('[DEBUG] ASYNCFetch Error', fetchError);
        });
}

/**
 * Function which update the article thanks to the provided data.
 * @param {string} url - the URL of the API. Ex : http://localhost/posts
 * @param {Object} dataObject
 * 
 * POSTS : {id,title,category,content}
 * 
 * COMMENTS : {id,isPartOf,content}
 */
const updateById = (url, dataObject) => {
    getFetch(
        url,
        'put',
        dataObject
    )
        .then((fetchSuccess) => {
            console.log('[DEBUG] getFetch Success', fetchSuccess);
            // TODO : ?
        }, (fetchError) => {
            console.log('[DEBUG] ASYNCFetch Error', fetchError);
        });
}

/**
 * Function which add in the database the new post.
 * @param {string} url - the URL of the API. Ex : http://localhost/posts
 * @param {string} dataTitle - The title of the article
 * @param {string} dataCategory - The category of the article
 * @param {string} dataContent - The content of the article
 */
const create = (url, dataTitle, dataCategory, dataContent) => {
    getFetch(
        url,
        'post',
        {
            title: dataTitle,
            category: dataCategory,
            content: dataContent
        }
    )
        .then((fetchSuccess) => {
            console.log('[DEBUG] getFetch Success', fetchSuccess);
            // TODO : ?
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
            // TODO : ?
        }, (fetchError) => {
            console.log('[DEBUG] ASYNCFetch Error', fetchError);
        });
}
/**/

/**
 * Global Functions
 */

/**
 * This function make the link between the burger button in
 * the navbar.
 */
const initNavigation = () => {
    // Bind HTML tag
    burgerNavigation = document.querySelector('.navbar-menu');
    burgerButton = document.querySelector('.navbar-burger');

    // Bind click event on burger button
    burgerButton.addEventListener('click', () => {
        burgerNavigation.classList.toggle('is-active');
        burgerButton.classList.toggle('is-active');
    });
}
/**/

/**
 * Wait for DOMContentLoaded :
 */
document.addEventListener('DOMContentLoaded', async ev => {
    console.log('[DEBUG] DOM is loaded');

    // ALL WORKED WELLLLLLL
    // getAll('http://localhost:3000/comments');
    // getById('http://localhost:3000/comments', 1);
    // updateById('http://localhost:3000/comments', {
    //     id: 1,
    //     isPartOf: 1,
    //     content: `J'ai réussi à te modifier !!!`
    // });
})
/**/