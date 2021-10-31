const axios = require('axios');
const { TRACKER_API, TRACKER_ID, GITHUB_API, REPOSITORY_URL } = require('./config.js');

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

const getTagsDiff = async (prevTag, lastTag) => {
    const result = [];

    await axios({
        method: 'GET',
        url: `${GITHUB_API}/repos/${REPOSITORY_URL}/compare/${prevTag}...${lastTag}`
    })
        .then(res => {
            result.push(...res.data.commits);
        })
        .catch(e => console.log(e));

    return result.map(commit => ({
        author: commit.commit.author,
        message: commit.commit.message,
        url: commit.html_url
    }));
}

const createRelease = async () => {
    const tags = await getTags();

    if (!tags || !tags.length) return;
    const lastTag = tags[tags.length - 1];
    const prevTag = tags.length < 2 ? lastTag : tags[tags.length - 2];
    const diff = await getTagsDiff(prevTag.ref, lastTag.ref);

    console.log('diff: ', diff);
}

createRelease();