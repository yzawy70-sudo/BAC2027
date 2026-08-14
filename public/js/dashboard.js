// =====================================
// BAC 2027 — Dashboard
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    loadUser();
    startCountdown();
    setupLogout();
    setupMobileMenu();

});


// =====================================
// بيانات الطالب
// =====================================

async function loadUser() {

    try {

        const response = await fetch("/api/me", {
            method: "GET",
            credentials: "same-origin"
        });

        if (!response.ok) {

            window.location.href = "/login";

            return;
        }

        const data = await response.json();

        const user = data.user;

        if (!user) {

            window.location.href = "/login";

            return;
        }


        // الاسم الكامل
        const userName = document.getElementById("userName");
        const welcomeName = document.getElementById("welcomeName");

        if (userName) {
            userName.textContent = user.fullName;
        }

        if (welcomeName) {
            welcomeName.textContent = user.fullName;
        }


        // الحرف الأول من الاسم
        const userAvatar = document.getElementById("userAvatar");

        if (userAvatar) {

            const firstLetter = user.fullName
                .trim()
                .charAt(0)
                .toUpperCase();

            userAvatar.textContent = firstLetter;
        }


    } catch (error) {

        console.error(
            "تعذر تحميل بيانات الطالب:",
            error
        );

        window.location.href = "/login";
    }

}


// =====================================
// العد التنازلي للبكالوريا
// =====================================

function startCountdown() {

    // 7 جوان 2027
    const bacDate = new Date(
        "2027-06-07T08:00:00"
    ).getTime();


    function updateCountdown() {

        const now = Date.now();

        const difference = bacDate - now;


        // انتهى الوقت
        if (difference <= 0) {

            setValue("days", "0");
            setValue("hours", "0");
            setValue("minutes", "0");
            setValue("seconds", "0");

            return;
        }


        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24))
            / (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (difference % (1000 * 60 * 60))
            / (1000 * 60)
        );

        const seconds = Math.floor(
            (difference % (1000 * 60))
            / 1000
        );


        setValue("days", days);
        setValue("hours", hours);
        setValue("minutes", minutes);
        setValue("seconds", seconds);

    }


    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );

}


// =====================================
// تحديث عناصر HTML
// =====================================

function setValue(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


// =====================================
// تسجيل الخروج
// =====================================

function setupLogout() {

    const logoutButton =
        document.getElementById("logoutButton");


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                logoutButton.disabled = true;

                const response = await fetch(
                    "/api/logout",
                    {
                        method: "POST",
                        credentials: "same-origin"
                    }
                );


                if (response.ok) {

                    window.location.href = "/login";

                    return;
                }


                console.error(
                    "فشل تسجيل الخروج"
                );

                logoutButton.disabled = false;


            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );

                logoutButton.disabled = false;
            }

        }
    );

}


// =====================================
// القائمة في الهاتف
// =====================================

function setupMobileMenu() {

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.querySelector(".sidebar");


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle("open");

        }
    );


    // إغلاق القائمة عند الضغط على رابط
    const navItems =
        sidebar.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                sidebar.classList.remove(
                    "open"
                );

            }
        );

    });

}