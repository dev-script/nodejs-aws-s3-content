const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'https://elastic:g841Qkh965YrJL+WYM2q@3.98.187.211:9200/' });

const createCmsIndex = async(data) => {
    try {
        const { body: indexExists } = await client.indices.exists({ index: 'knowledge_base' });
        if (!indexExists) {
            const result = await client.indices.create({index: 'knowledge_base', body: data});
            return { status: 1, data: result };
        } else {
            const esData = await client.search({ index: 'knowledge_base', query: {"match": {"hash_url_link": data['hash_url_link']}}});
            if (!esData || !esData?.hits || !esData?.hits?.hits || !esData?.hits?.hits.length) {
                const result = await client.index({
                    index: "knowledge_base",
                    document: data,
                });
                return { status: 1, data: result };
            }
        }
    } catch (error) {
        console.log(error)
        throw new Error("Error while creating index of cms data :", error);   
    }
}

const updateFieldsES = async () => {
    try {
        await client.updateByQuery(
            {
                index: "knowledge_base", body: {
                    "query": {
                        "match": { "is_article": 1 },
                        "bool": {
                            "must_not": {
                                "exists": {
                                    "field": "type"
                                }
                            }
                        }
                    },
                    "script": { "inline": "ctx.type = 'article'" }
                }
            });
        await client.updateByQuery(
            {
                index: "knowledge_base", body: {
                    "query": {
                        "bool": {
                            "must_not": [
                                {
                                    "term": {
                                        "is_article": 1
                                    }
                                }
                            ]
                        }
                    },
                    "script": { "inline": "ctx.type = 'other'" }
                }
            });
        return true;
    } catch (error) {
        throw new Error("Error while updating fields :", error);
    }
}

createCmsIndex();
module.exports = {
    createCmsIndex,
    updateFieldsES,
}