/**
 * @author Snowsdy
 * Date : 13/10/2022, 20h52
 */

/**
 * Functions
 * Each DataType has its own fetch according to his attributes :
 * COMMENTS --> id, isPartOf (FK), content
 * POSTS --> id, title, category, content
 * USERS --> id, firstname, lastname, email, password (Later =])
 */

/**
 * Function which return all posts.
 * @param {string} url
 * @param {string} requestType - The HTTP Verb (GET/POST/PUT/DELETE)
 * @param {Object} dataObject - Needed if we want to pass more parameters
 */
const getFetch = async (url, requestType, dataObject = null) => {
    console.log('[DEBUG] getFetch Starting...');
    // Définition du header de la requête
    let response = null;
    let requestHeader = {
        method: requestType.toUpperCase(),
        headers: {
            'Content-type': 'application/json'
        }
    };

    // First, look at dataObject if parameters exists :
    if (dataObject) {
        // Parameters exists, so build the new url :
        switch (requestType.toUpperCase()) {
            case 'GET':
                console.log('[DEBUG] Exécution d\'un GetById...');
                // So it's a GetById :
                url += `/${dataObject.id}`;
                break;
            case 'DELETE':
                console.log('[DEBUG] Suppression en cours...');
                // Delete the post
                url += `/${dataObject.id}`;
                break;
            case 'PUT':
                console.log('[DEBUG] Mise à jour ou Ajout en cours...');
                // Update the post :
                url += `/${dataObject.id}`;
            case 'POST':
                requestHeader.body = JSON.stringify(dataObject);
                break;
        }
    } else {
        // Otherwise, it's just a GetAll
        console.log('[DEBUG] Exécution d\'un GetAll...');
    }

    response = await fetch(url, requestHeader);

    // Vérification de la requête
    if (response.ok) {
        // Vérification du status de la requête
        switch (response.status) {
            case 200:
                console.log(`Succès de la requête ${requestType.toUpperCase()}.`);
                // Extraire les données reçus au format JSON
                return Promise.resolve(await response.json());

            case 201:
                console.log(`Succès de la requête ${requestType.toUpperCase()}.`);
                // Extraire les données crées au format JSON
                return Promise.resolve(await response.json());

            default:
                console.log(`Erreur de traitement de la requête ${requestType.toUpperCase()}.`);
                // Renvoyer une Promesse
                return Promise.reject(response);
        };
    } else {
        // Récupérer le code erreur dans une Promesse
        console.log(`Erreur de traitement de la requête ${requestType.toUpperCase()}.`);
        return Promise.reject(response);
    };
}

/**
 * Function which return an objet
 * @param {string} url - The url
 * @param  {...any} params - the parameters you want
 * Example : params = ['id=1', 'isPartOf=2']
 * @returns {Promise}
 */
const getFetchWithParameters = async (url, ...params) => {
    console.log('[DEBUG] getFetchWithParameters Starting...');
    // Définition du header de la requête
    let response = null;
    let requestHeader = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    };

    // Build the url
    for (let index = 0; index < params.length; index++) {
        const param = params[index];
        if (index === 0) {
            url += `?${param}`;
        } else {
            url += `&${param}`;
        }
    }

    response = await fetch(url, requestHeader);

    // Vérification de la requête
    if (response.ok) {
        // Vérification du status de la requête
        switch (response.status) {
            case 200:
                console.log(`Succès de la requête.`);
                // Extraire les données reçus au format JSON
                return Promise.resolve(await response.json());

            case 201:
                console.log(`Succès de la requête.`);
                // Extraire les données crées au format JSON
                return Promise.resolve(await response.json());

            default:
                console.log(`Erreur de traitement de la requête.`);
                // Renvoyer une Promesse
                return Promise.reject(response);
        };
    } else {
        // Récupérer le code erreur dans une Promesse
        console.log(`Erreur de traitement de la requête.`);
        return Promise.reject(response);
    };
}
/**/