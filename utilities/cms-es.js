const mongoose = require('mongoose');
const crypto = require('crypto');
const { Courses, Content } = require('../db/models');
const { lookupMethod } = require('../db/controllers');
const { createCmsIndex, updateFieldsES } = require('./es');

const connectToMongoDb = (uri) => {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.on('connected', () => {
        console.log('MongoDb connected on port 27017');
    });
    mongoose.connection.on('error', (err) => {
        console.log(`An error occurred. ERROR: ${err}`);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('Mongodb disconnected!');
    });
};



const indexCourses = async () => {
    try {
        const courseCount = await Courses.count({});
        const limit = 2;
        const iterations = Math.ceil(courseCount / limit);
        for (let page = 0; page < iterations; page = page + 1) {

            let matchObj = {};

            let paginationObj = [];

            if (page && limit) paginationObj = [{ $skip: page * limit }, { $limit: limit }];
            if (page && !limit) paginationObj = [{ $skip: 0 }];

            const sort = { 'created_at': -1 };

            const lookupObj = [
                {
                    "$unwind": {
                        "path": "$skill_categories",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$lookup": {
                        "from": "SkillCategories",
                        "localField": "skill_categories.id",
                        "foreignField": "skill_category_id",
                        "as": "skill_categories"
                    }
                },
                {
                    "$project": {
                        "sub_title": 1,
                        "description": 1,
                        "image": 1,
                        "name": 1,
                        "course_id": 1,
                        "tags": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "skill_categories": 1,
                    }
                }
            ];

            const courses = await lookupMethod(Courses, lookupObj, matchObj, sort, paginationObj, true);
            const knowledgeBaseCourses = await knowledgeBaseCourseFormatting(courses);
            for (const course of knowledgeBaseCourses) {
                await createCmsIndex(course);
            }
        }
    } catch (error) {
        throw new Error("Error while creating course index :", error);
    }
}

const knowledgeBaseCourseFormatting = (courses) => {
    try {
        const formattedCourses = courses.map((course) => {
            const {
                sub_title = '',
                description = '',
                image = '',
                created_at,
                updated_at,
                name = '',
                course_id,
                tags = [],
                skill_categories = [] } = course;
            let type;
            tags.includes('career') ? type = 'career' : type = 'course';
            const hash_url_link = crypto.createHash('sha256').update(course_id).digest('hex');
            return {
                hash_url_link,
                text: sub_title + description,
                images: [image],
                pub_data: created_at,
                url: course_id,
                title: name,
                image,
                summary: description,
                modified_data: updated_at,
                tags,
                type,
                skill_categories,
            }
        })
        return formattedCourses;
    } catch (error) {
        throw new Error("Error while formatting courses to index in knowledge_base :", error);
    }
}

const indexContents = async () => {
    try {
        const contentCount = await Content.count({ type: { "$ne": "quiz" } });
        const limit = 2;
        const iterations = Math.ceil(contentCount / limit);
        for (let page = 0; page < iterations; page = page + 1) {

            let matchObj = {};

            let paginationObj = [];

            if (page && limit) paginationObj = [{ $skip: page * limit }, { $limit: limit }];
            if (page && !limit) paginationObj = [{ $skip: 0 }];

            const sort = { 'created_at': -1 };

            const lookupObj = [
                {
                    "$unwind": {
                        "path": "$skill_categories",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$lookup": {
                        "from": "SkillCategories",
                        "localField": "skill_categories.id",
                        "foreignField": "skill_category_id",
                        "as": "skill_categories"
                    }
                },
                {
                    "$project": {
                        "content": 1,
                        "cover": 1,
                        "image": 1,
                        "title": 1,
                        "type": 1,
                        "tags": 1,
                        "created_at": 1,
                        "updated_at": 1,
                        "skill_categories": 1,
                    }
                }
            ];

            const contents = await lookupMethod(Content, lookupObj, matchObj, sort, paginationObj, true);
            const knowledgeBaseContents = await knowledgeBaseContentFormatting(contents);
            for (const content of knowledgeBaseContents) {
                await createCmsIndex(content);
            }
        }
    } catch (error) {
        throw new Error("Error while creating content index :", error);
    }
}

const knowledgeBaseContentFormatting = (contents) => {
    try {
        const formattedContents = contents.map((cont) => {
            const {
                _id,
                content = '',
                cover,
                image,
                title,
                created_at,
                updated_at,
                type,
                tags = [],
                skill_categories = [] } = cont;
            const hash_url_link = crypto.createHash('sha256').update(_id).digest('hex');
            return {
                hash_url_link,
                text: content,
                images: [...(cover?.image ? [cover.image] : []), ...(image ? [image] : [])],
                pub_data: created_at,
                url: _id,
                title: (title) ? (title) : ((cover && cover.title) ? (cover.title) : ('')),
                image: cover && cover.image ? cover.image : '',
                summary: content,
                modified_data: updated_at,
                tags,
                type,
                skill_categories,
            }
        })
        return formattedContents;
    } catch (error) {
        throw new Error("Error while formatting contents to index in knowledge_base :", error);
    }
}

const main = async () => {
    try {
        // Establish mongodb connection
        await connectToMongoDb('mongodb://localhost:27017/adaptivCMS');
        await updateFieldsES();
        await indexCourses();
        await indexContents();
    } catch (error) {
        throw new Error("Error in main while creating course/content index :", error);
    }
}

main();