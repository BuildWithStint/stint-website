module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/models/ContactSettings.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContactSettings",
    ()=>ContactSettings
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const contactSettingsSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [
            /^\S+@\S+\.\S+$/,
            'Please enter a valid email'
        ]
    },
    enquiryEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [
            /^\S+@\S+\.\S+$/,
            'Please enter a valid email'
        ]
    },
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    instagram: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+/,
            'Please enter a valid URL'
        ]
    },
    twitter: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+/,
            'Please enter a valid URL'
        ]
    },
    linkedin: {
        type: String,
        trim: true,
        match: [
            /^https?:\/\/.+/,
            'Please enter a valid URL'
        ]
    },
    gmailUser: {
        type: String,
        trim: true,
        lowercase: true,
        match: [
            /^\S+@gmail\.com$/,
            'Please enter a valid Gmail address'
        ]
    },
    gmailPassword: {
        type: String,
        trim: true,
        minlength: 16,
        maxlength: 16
    },
    updatedBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
const ContactSettings = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('ContactSettings', contactSettingsSchema);
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDatabase",
    ()=>connectDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
let isConnected = false;
const connectDatabase = async ()=>{
    if (isConnected) {
        return;
    }
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(uri);
        isConnected = true;
        console.log('✅ Connected to MongoDB');
        // Initialize default admin user if no users exist
        await initializeDefaultAdmin();
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};
const initializeDefaultAdmin = async ()=>{
    try {
        // Import User model dynamically to avoid circular dependencies
        const { User } = await __turbopack_context__.A("[project]/lib/models/User.ts [app-route] (ecmascript, async loader)");
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const defaultAdmin = new User({
                email: 'admin@stint.com',
                password: 'admin123',
                role: 'admin'
            });
            await defaultAdmin.save();
            console.log('✅ Default admin user created: admin@stint.com');
        }
    } catch (error) {
        console.error('❌ Error initializing default admin:', error);
    }
};
}),
"[project]/lib/middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withAuth",
    ()=>withAuth,
    "withCors",
    ()=>withCors,
    "withDatabase",
    ()=>withDatabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-route] (ecmascript)");
;
;
;
function withAuth(handler) {
    return async (req)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDatabase"])();
            const token = req.headers.get('authorization')?.replace('Bearer ', '');
            if (!token) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'No token provided'
                }, {
                    status: 401
                });
            }
            const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, process.env.JWT_SECRET);
            req.user = {
                id: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
            return handler(req);
        } catch (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid token'
            }, {
                status: 403
            });
        }
    };
}
function withDatabase(handler) {
    return async (req)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDatabase"])();
            return handler(req);
        } catch (error) {
            console.error('Database connection error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Database connection failed'
            }, {
                status: 500
            });
        }
    };
}
function withCors(handler) {
    return async (req)=>{
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
            });
        }
        const response = await handler(req);
        // Add CORS headers to all responses
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    };
}
}),
"[project]/app/api/contact-settings/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ContactSettings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models/ContactSettings.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/middleware.ts [app-route] (ecmascript)");
;
;
;
async function getContactSettingsHandler(req) {
    try {
        // Get the latest contact settings (there should only be one document)
        let settings = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ContactSettings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ContactSettings"].findOne().sort({
            updatedAt: -1
        });
        // If no settings exist, return default empty values
        if (!settings) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                settings: {
                    email: '',
                    enquiryEmail: '',
                    address: '',
                    instagram: '',
                    twitter: '',
                    linkedin: '',
                    gmailUser: '',
                    gmailPassword: ''
                }
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            settings
        });
    } catch (error) {
        console.error('Get contact settings error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function updateContactSettingsHandler(req) {
    try {
        const { email, enquiryEmail, address, instagram, twitter, linkedin, gmailUser, gmailPassword } = await req.json();
        if (!email || !enquiryEmail || !address) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Email, enquiry email, and address are required'
            }, {
                status: 400
            });
        }
        // Find existing settings or create new one
        let settings = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ContactSettings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ContactSettings"].findOne();
        if (settings) {
            // Update existing settings
            settings.email = email;
            settings.enquiryEmail = enquiryEmail;
            settings.address = address;
            settings.instagram = instagram || '';
            settings.twitter = twitter || '';
            settings.linkedin = linkedin || '';
            settings.gmailUser = gmailUser || '';
            settings.gmailPassword = gmailPassword || '';
            settings.updatedBy = req.user?.id;
            await settings.save();
        } else {
            // Create new settings
            settings = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2f$ContactSettings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ContactSettings"]({
                email,
                enquiryEmail,
                address,
                instagram: instagram || '',
                twitter: twitter || '',
                linkedin: linkedin || '',
                gmailUser: gmailUser || '',
                gmailPassword: gmailPassword || '',
                updatedBy: req.user?.id
            });
            await settings.save();
        }
        await settings.populate('updatedBy', 'email');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            settings
        });
    } catch (error) {
        console.error('Update contact settings error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
const GET = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withCors"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDatabase"])(getContactSettingsHandler));
const PUT = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withCors"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAuth"])(updateContactSettingsHandler));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__02cf6u-._.js.map