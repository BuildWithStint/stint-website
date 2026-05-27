(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authAPI",
    ()=>authAPI,
    "contactFormAPI",
    ()=>contactFormAPI,
    "contactSettingsAPI",
    ()=>contactSettingsAPI,
    "default",
    ()=>__TURBOPACK__default__export__,
    "feedbackAPI",
    ()=>feedbackAPI,
    "projectsAPI",
    ()=>projectsAPI,
    "teamAPI",
    ()=>teamAPI,
    "usersAPI",
    ()=>usersAPI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3000/api") || '/api';
// Create axios instance
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Request interceptor to add auth token
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor to handle token refresh
api.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken
                });
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                // Retry original request with new token
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${accessToken}`
                };
                return api(originalRequest);
            }
        } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = '/admin/login';
            }
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
const authAPI = {
    login: async (email, password)=>{
        const response = await api.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },
    getProfile: async ()=>{
        const response = await api.get('/auth/profile');
        return response.data;
    },
    refreshToken: async (refreshToken)=>{
        const response = await api.post('/auth/refresh', {
            refreshToken
        });
        return response.data;
    }
};
const usersAPI = {
    getUsers: async ()=>{
        const response = await api.get('/users');
        return response.data;
    },
    createUser: async (userData)=>{
        const response = await api.post('/users', userData);
        return response.data;
    },
    deleteUser: async (userId)=>{
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    }
};
const projectsAPI = {
    getProjects: async ()=>{
        const response = await api.get('/projects');
        return response.data;
    },
    createProject: async (projectData)=>{
        const response = await api.post('/projects', projectData);
        return response.data;
    },
    updateProject: async (projectId, projectData)=>{
        const response = await api.put(`/projects/${projectId}`, projectData);
        return response.data;
    },
    deleteProject: async (projectId)=>{
        const response = await api.delete(`/projects/${projectId}`);
        return response.data;
    }
};
const teamAPI = {
    getTeamMembers: async ()=>{
        const response = await api.get('/team');
        return response.data;
    },
    createTeamMember: async (memberData)=>{
        const response = await api.post('/team', memberData);
        return response.data;
    },
    updateTeamMember: async (memberId, memberData)=>{
        const response = await api.put(`/team/${memberId}`, memberData);
        return response.data;
    },
    deleteTeamMember: async (memberId)=>{
        const response = await api.delete(`/team/${memberId}`);
        return response.data;
    }
};
const feedbackAPI = {
    getFeedbacks: async ()=>{
        const response = await api.get('/feedback');
        return response.data;
    },
    getAllFeedbacks: async ()=>{
        const response = await api.get('/feedback/all');
        return response.data;
    },
    createFeedback: async (feedbackData)=>{
        const response = await api.post('/feedback', feedbackData);
        return response.data;
    },
    updateFeedback: async (feedbackId, feedbackData)=>{
        const response = await api.put(`/feedback/${feedbackId}`, feedbackData);
        return response.data;
    },
    deleteFeedback: async (feedbackId)=>{
        const response = await api.delete(`/feedback/${feedbackId}`);
        return response.data;
    }
};
const contactSettingsAPI = {
    getContactSettings: async ()=>{
        const response = await api.get('/contact-settings');
        return response.data;
    },
    updateContactSettings: async (settingsData)=>{
        const response = await api.put('/contact-settings', settingsData);
        return response.data;
    }
};
const contactFormAPI = {
    submitForm: async (formData)=>{
        const response = await api.post('/contact/submit', formData);
        return response.data;
    }
};
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Check for existing token on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const token = localStorage.getItem('accessToken');
            if (token) {
                // Verify token and get user info from API
                verifyToken();
            } else {
                setIsLoading(false);
            }
        }
    }["AuthProvider.useEffect"], []);
    const verifyToken = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authAPI"].getProfile();
            if (response.success) {
                setUser({
                    id: response.user.id,
                    email: response.user.email,
                    role: response.user.role
                });
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
        } finally{
            setIsLoading(false);
        }
    };
    const login = async (email, password)=>{
        try {
            setIsLoading(true);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authAPI"].login(email, password);
            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                setUser({
                    id: response.user.id,
                    email: response.user.email,
                    role: response.user.role
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        } finally{
            setIsLoading(false);
        }
    };
    const logout = ()=>{
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };
    const refreshToken = async ()=>{
        try {
            const refreshTokenValue = localStorage.getItem('refreshToken');
            if (!refreshTokenValue) return false;
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authAPI"].refreshToken(refreshTokenValue);
            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return false;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            login,
            logout,
            isLoading,
            refreshToken
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "YajQB7LURzRD+QP5gw0+K2TZIWA=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/TeamContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TeamProvider",
    ()=>TeamProvider,
    "useTeam",
    ()=>useTeam
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const TeamContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useTeam() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TeamContext);
    if (!context) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
}
_s(useTeam, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function TeamProvider({ children }) {
    _s1();
    const [teamMembers, setTeamMembers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load from API on initial render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TeamProvider.useEffect": ()=>{
            loadTeamMembers();
        }
    }["TeamProvider.useEffect"], []);
    const loadTeamMembers = async ()=>{
        try {
            setIsLoading(true);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["teamAPI"].getTeamMembers();
            if (response.success) {
                // Map _id to id for frontend compatibility
                const members = response.teamMembers.map((m)=>({
                        ...m,
                        id: m._id
                    }));
                setTeamMembers(members);
            }
        } catch (error) {
            console.error('Failed to load team members:', error);
        } finally{
            setIsLoading(false);
        }
    };
    const addTeamMember = async (member)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["teamAPI"].createTeamMember(member);
            if (response.success) {
                const newMember = {
                    ...response.teamMember,
                    id: response.teamMember._id
                };
                setTeamMembers((prev)=>[
                        ...prev,
                        newMember
                    ]);
            }
        } catch (error) {
            console.error('Failed to add team member:', error);
            throw error;
        }
    };
    const updateTeamMember = async (id, member)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["teamAPI"].updateTeamMember(id, member);
            if (response.success) {
                const updated = {
                    ...response.teamMember,
                    id: response.teamMember._id
                };
                setTeamMembers((prev)=>prev.map((m)=>m.id === id ? updated : m));
            }
        } catch (error) {
            console.error('Failed to update team member:', error);
            throw error;
        }
    };
    const deleteTeamMember = async (id)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["teamAPI"].deleteTeamMember(id);
            if (response.success) {
                setTeamMembers((prev)=>prev.filter((m)=>m.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete team member:', error);
            throw error;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TeamContext.Provider, {
        value: {
            teamMembers,
            addTeamMember,
            updateTeamMember,
            deleteTeamMember,
            isLoading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/TeamContext.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s1(TeamProvider, "FTbD2MCZxRLGzJwzkTE/04iJQ9w=");
_c = TeamProvider;
var _c;
__turbopack_context__.k.register(_c, "TeamProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0p7df2c._.js.map