const registerForm = document.getElementById("registerForm");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const registerMessage = document.getElementById("registerMessage");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");


// إظهار / إخفاء كلمة المرور
togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.textContent = isPassword ? "🙈" : "👁";
});


// إظهار / إخفاء تأكيد كلمة المرور
toggleConfirmPassword.addEventListener("click", () => {
    const isPassword = confirmPasswordInput.type === "password";

    confirmPasswordInput.type = isPassword ? "text" : "password";

    toggleConfirmPassword.textContent = isPassword ? "🙈" : "👁";
});


// رسالة للمستخدم
function showMessage(message, type = "error") {

    registerMessage.textContent = message;

    registerMessage.className = `message show ${type}`;
}


// إنشاء الحساب
registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;


    // التحقق من الاسم
    if (fullName.length < 3) {

        showMessage("يرجى إدخال الاسم واللقب بشكل صحيح.");

        return;
    }


    // التحقق من البريد
    if (!email) {

        showMessage("يرجى إدخال البريد الإلكتروني.");

        return;
    }


    // التحقق من كلمة المرور
    if (password.length < 6) {

        showMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");

        return;
    }


    // تطابق كلمات المرور
    if (password !== confirmPassword) {

        showMessage("كلمتا المرور غير متطابقتين.");

        return;
    }


    // منع الضغط المتكرر
    const button = registerForm.querySelector("button[type='submit']");

    button.disabled = true;
    button.querySelector("span").textContent = "جارٍ إنشاء الحساب...";


    try {

        const response = await fetch("/api/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullName,
                email,
                password
            })

        });


        const data = await response.json();


        if (!response.ok) {

            showMessage(data.message || "حدث خطأ أثناء إنشاء الحساب.");

            return;
        }


        showMessage("تم إنشاء حسابك بنجاح 🎉", "success");


        // الانتقال لتسجيل الدخول
        setTimeout(() => {

            window.location.href = "/login";

        }, 1200);


    } catch (error) {

        console.error(error);

        showMessage("تعذر الاتصال بالخادم. حاول مرة أخرى.");

    } finally {

        button.disabled = false;
        button.querySelector("span").textContent = "إنشاء الحساب";

    }

});