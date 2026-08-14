const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const session = require("express-session");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

// =====================================
// إعدادات البيانات
// =====================================

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// إنشاء مجلد data
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// إنشاء ملف المستخدمين
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
}


// =====================================
// Middleware
// =====================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// نظام الجلسات
// =====================================

app.use(
    session({
        secret: process.env.SESSION_SECRET || "bac2027-secret-change-this",
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);

app.use(express.static(path.join(__dirname, "public")));


// =====================================
// صفحات الموقع
// =====================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/dashboard", (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "public", "dashboard.html")
    );

});
app.get("/subjects", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "subjects.html")
    );
});
// =====================================
// API — إنشاء حساب
// =====================================

app.post("/api/register", async (req, res) => {

    try {

        const { fullName, email, password } = req.body;

        // التحقق من البيانات
        if (!fullName || !email || !password) {

            return res.status(400).json({
                message: "يرجى ملء جميع الحقول."
            });

        }

        const cleanName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();

        // التحقق من الاسم
        if (cleanName.length < 3) {

            return res.status(400).json({
                message: "الاسم واللقب غير صالحين."
            });

        }

        // التحقق من كلمة المرور
        if (password.length < 6) {

            return res.status(400).json({
                message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل."
            });

        }

        // قراءة المستخدمين
        const users = JSON.parse(
            fs.readFileSync(USERS_FILE, "utf8")
        );

        // التحقق من البريد
        const existingUser = users.find(
            user => user.email === cleanEmail
        );

        if (existingUser) {

            return res.status(409).json({
                message: "هذا البريد الإلكتروني مستخدم بالفعل."
            });

        }

        // إنشاء Hash لكلمة المرور
        const passwordHash = await bcrypt.hash(password, 12);

        // إنشاء المستخدم
        const newUser = {
            id: Date.now().toString(),
            fullName: cleanName,
            email: cleanEmail,
            passwordHash,
            createdAt: new Date().toISOString()
        };

        // إضافة المستخدم
        users.push(newUser);

        // حفظ المستخدمين
        fs.writeFileSync(
            USERS_FILE,
            JSON.stringify(users, null, 2),
            "utf8"
        );

        // نجاح
        return res.status(201).json({
            message: "تم إنشاء الحساب بنجاح."
        });

    } catch (error) {

        console.error("Register Error:", error);

        return res.status(500).json({
            message: "حدث خطأ في الخادم."
        });

    }

});


// =====================================
// API — تسجيل الدخول
// =====================================

app.post("/api/login", async (req, res) => {
// =====================================
// API — بيانات الطالب الحالي
// =====================================

app.get("/api/me", (req, res) => {

    if (!req.session.user) {

        return res.status(401).json({
            message: "غير مسجل الدخول."
        });

    }

    return res.status(200).json({
        user: req.session.user
    });

});
    try {

        const { email, password } = req.body;
// =====================================
// API — تسجيل الخروج
// =====================================

app.post("/api/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error("Logout Error:", error);

            return res.status(500).json({
                message: "تعذر تسجيل الخروج."
            });

        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            message: "تم تسجيل الخروج."
        });

    });

});
        // التحقق من البيانات
        if (!email || !password) {

            return res.status(400).json({
                message: "يرجى إدخال البريد الإلكتروني وكلمة المرور."
            });

        }

        const cleanEmail = email.trim().toLowerCase();

        // قراءة المستخدمين
        const users = JSON.parse(
            fs.readFileSync(USERS_FILE, "utf8")
        );

        // البحث عن المستخدم
        const user = users.find(
            user => user.email === cleanEmail
        );

        if (!user) {

            return res.status(401).json({
                message: "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            });

        }

        // مقارنة كلمة المرور
        const passwordCorrect = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordCorrect) {

            return res.status(401).json({
                message: "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            });

        }

    
       // إنشاء جلسة للطالب
req.session.user = {
    id: user.id,
    fullName: user.fullName,
    email: user.email
};

return res.status(200).json({

    message: "تم تسجيل الدخول بنجاح.",

    user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
    }

});

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            message: "حدث خطأ في الخادم."
        });

    }

});


// =====================================
// تشغيل السيرفر
// =====================================

app.listen(PORT, "0.0.0.0", () => {

    console.log("=================================");
    console.log("        BAC 2027 SERVER");
    console.log("=================================");
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);

});