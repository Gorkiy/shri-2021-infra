const axios = require('axios');
const { textChangeRangeNewSpan } = require('typescript');
const { TRACKER_API, TRACKER_ID, GITHUB_API, REPOSITORY_URL } = require('./config.js');

const getTags = async () => {
    const tags = [];

    await axios({
        method: 'GET',
        url: `${GITHUB_API}/repos/${REPOSITORY_URL}/git/refs/tags`
    })
        .then(res => {
            tags.push(...res.data);
        })
        .catch(e => console.log(e));

    return tags.map(tag => {
        return {
            ref: tag.ref,
            id: tag.ref.split('/')[2],
            url: tag.url,
        }
    }).sort();

}

const createReleaseTicket = async () => {
    await axios({
        url: `${TRACKER_API}/v2/issues`,
        method: 'POST',
        data: {
            queue: 'TMP',
            summary: 'Test task',
            description: '',
            type: 'task'
        },
        headers: {
            Authorization: `OAuth AQAAAAAAqu8IAAd44L0wFjF6Z00rm_33Yz7oltM`,
            OrgId: TRACKER_ID
        }
    }).then(res => console.log(res))
    .catch(e => console.log(e));
}


const createRelease = async () => {
    const tags = await getTags();
    console.log('tags: ', tags);
    await createReleaseTicket();
}

createRelease();