const {
    PORT,
    AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME,
} = process.env;

const constants = {
    PORT,
    AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME,
    SUCCESS: {
        CODE: 200,
    },
    ERROR: {
        BAD_REQUEST: {
            TYPE: 'BAD_REQUEST',
            CODE: 400,
        },
        NOT_FOUND: {
            TYPE: 'NOT_FOUND',
            CODE: 404,
        },
        INTERNAL_SERVER_ERROR: {
            TYPE: 'INTERNAL_SERVER_ERROR',
            CODE: 500,
        },
        UNAUTHORIZED: {
            TYPE: 'UNAUTHORIZED',
            CODE: 403,
        },
        UNAUTHENTICATED: {
            TYPE: 'UNAUTHENTICATED',
            CODE: 401,
        },
    },
    LOGGER_LEVELS : {
    	ERROR: "Error",
    	WARN: "Warning",
    	INFO: "Info",
    	DEBUG: "Debug",
    	MARK: "Mark",
    	FATAL: "Fatal",
    	TRACE: "Trace"
    },
    CATEGORY_ORDER_FOR_ACADEMY_UI: ["mktg_content", "new_tech_career", "product_dev", "sustainability", "fintech_crypto", "people_culture"],
    TAGS_ORDER_FOR_ACADEMY_UI: ["megatrends", "career", "courses"],
    ACADEMY_GRID_TAGS_MAPPING : {
        megatrends: {
            title: "#megatrends",
            grid_type: "video",
            description: "Career progress in culture starts here"
        },
        career: {
            title: "#Careerpaths",
            grid_type: "career_path",
            description: "Careers of the future in this sector"
        },
        courses: {
            title: "#courses to get started",
            grid_type: "course",
            description: "101 courses that will help you get started"
        },
    },
    WEEKS_LIST_MY_ADAPTIV__UI: [
        ["week_1", {
            name: "Week 1",
            icon_image: "https://dl.airtable.com/.attachments/f3fa27f9c1bd26f23a45cffea196f0f1/3e61302a/blockarrow.png"
        }],
        ["week_2", {
            name: "Week 2",
            icon_image: "https://dl.airtable.com/.attachments/9bb18bf9018aa8e4c834236786e67219/9c78d0be/w2.png"
        }],
        ["week_3", {
            name: "Week 3",
            icon_image: "https://dl.airtable.com/.attachments/d62cd86ce15bd1554ffc7844ad241911/6c33a250/blockpipette.png"
        }],
        ["week_4", {
            name: "Week 4",
            icon_image: "https://dl.airtable.com/.attachments/4a7b433bee800fef565c3ca1f5145ac9/5dd412c4/icon2.png"
        }],
        ["week_5", {
            name: "Week 5",
            icon_image: "https://dl.airtable.com/.attachments/acafa92f436367d7469f690136eb3dee/965bf06c/icon4.png"
        }],
        ["week_6", {
            name: "Week 6",
            icon_image: "https://dl.airtable.com/.attachments/f7ec810f5c14228b84ae84d561fea8b3/282022c3/scene7.png"
        }]
    ],
    MY_ADAPTIV_TAGS_MAPPING: {
        day_1: {
            description: "Learn about the future of work",
            grid_type: "course",
        },
        day_2: {
            description: "Discover megatrends shaping the future of work",
            grid_type: "video",
        },
        day_3: {
            description: "Essential skills for the new economy",
            grid_type: "course",
        },
        day_4: {
            description: "Megatrends in the new economy",
            grid_type: "video",
        },
        day_5: {
            description: "Are you truly agile & adaptive?",
            grid_type: "course",
        }
    }
};

module.exports = {
    constants,
};
