const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginMessage = document.getElementById("loginMessage");

const togglePassword = document.getElementById("togglePassword");


// إظهار / إخفاء كلمة المرور
togglePassword.addEventListener("click", () => {

    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.textContent = isPassword ? "🙈" : "👁";

});


// عرض رسالة
function showLoginMessage(message, type = "error") {

    loginMessage.textContent = message;

    loginMessage.className = `message show ${type}`;

}


// تسجيل الدخول
loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;


    if (!email || !password) {

        showLoginMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور.");

        return;
    }


    const button = loginForm.querySelector("button[type='submit']");

    button.disabled = true;

    button.querySelector("span").textContent = "جارٍ تسجيل الدخول...";


    try {

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });


        const data = await response.json();


        if (!response.ok) {

            showLoginMessage(
                data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            );

            return;
        }


        showLoginMessage(
            `مرحبًا ${data.user.fullName} 👋`,
            "success"
        );


        setTimeout(() => {

            window.location.href = "/dashboard";

        }, 800);


    } catch (error) {

        console.error("Login Error:", error);

        showLoginMessage(
            "تعذر الاتصال بالخادم. حاول مرة أخرى."
        );

    } finally {

        button.disabled = false;

        button.querySelector("span").textContent = "تسجيل الدخول";

    }

});