const DEFAULTS = {
    siteName: "MY CREW",
    heroEyebrow: "WELCOME TO",
    heroTitleLine1: "MY",
    heroTitleLine2: "CREW.",
    heroSubtitle: "One crew. One team. One family.",
    bannerOpacity: 35,
    member1Name: "Matthew",
    member1Role: "Founder / Leader",
    member2Name: "FRIEND #2",
    member2Role: "The Chaos Coordinator",
    member3Name: "Jared C. Summerlin",
    member3Role: "Professional Pigeon Racer",
    member4Name: "FRIEND #4",
    member4Role: "Designated Driver",
    member5Name: "FRIEND #5",
    member5Role: "Member",
    member6Name: "FRIEND #6",
    member6Role: "Member",
    member7Name: "FRIEND #7",
    member7Role: "Member",
    member8Name: "FRIEND #8",
    member8Role: "Member",
    member9Name: "FRIEND #9",
    member9Role: "Member",
    aboutTitle: "MORE THAN<br>JUST FRIENDS.",
    aboutText1: "We're a group of friends who somehow ended up becoming a crew.",
    aboutText2: "From random adventures to completely terrible decisions, this is where we keep track of it all.",
    contactButton: "CONTACT THE CREW",
    footerText: "BUILT BY THE CREW."
};

/*
    IMPORTANT:
    This password is only a basic static-site lock.
    Because GitHub Pages serves the JavaScript publicly,
    it is NOT suitable for protecting sensitive information.
*/
const PASSWORD = "crew123";

const mainMembers = [
    ["member1Name", "member1Role"],
    ["member2Name", "member2Role"],
    ["member3Name", "member3Role"],
    ["member4Name", "member4Role"],
    ["member5Name", "member5Role"]
];

const smallMembers = [
    ["member6Name", "member6Role"],
    ["member7Name", "member7Role"],
    ["member8Name", "member8Role"],
    ["member9Name", "member9Role"]
];

const savedSettings = JSON.parse(localStorage.getItem("myCrewSettings") || "{}");
let settings = { ...DEFAULTS, ...savedSettings };

const loginScreen = document.getElementById("login-screen");
const settingsApp = document.getElementById("settings-app");

function isUnlocked() {
    return sessionStorage.getItem("myCrewUnlocked") === "true";
}

function showApp() {
    loginScreen.classList.add("hidden");
    settingsApp.classList.remove("hidden");
    populateForm();
}

function showLogin() {
    loginScreen.classList.remove("hidden");
    settingsApp.classList.add("hidden");
}

if (isUnlocked()) {
    showApp();
}

document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const entered = document.getElementById("password").value;
    const error = document.getElementById("login-error");

    if (entered === PASSWORD) {
        sessionStorage.setItem("myCrewUnlocked", "true");
        error.textContent = "";
        showApp();
    } else {
        error.textContent = "Incorrect password.";
        document.getElementById("password").select();
    }
});

document.getElementById("toggle-password").addEventListener("click", () => {
    const input = document.getElementById("password");
    const button = document.getElementById("toggle-password");

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "HIDE";
    } else {
        input.type = "password";
        button.textContent = "SHOW";
    }
});

document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.removeItem("myCrewUnlocked");
    location.reload();
});

function createMemberEditors(containerId, members, startNumber) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    members.forEach((keys, index) => {
        const number = String(startNumber + index).padStart(2, "0");

        const editor = document.createElement("div");
        editor.className = "member-editor";

        editor.innerHTML = `
            <div class="member-number">${number}</div>
            <div class="field">
                <label for="${keys[0]}">Name</label>
                <input id="${keys[0]}" data-key="${keys[0]}" type="text">
            </div>
            <div class="field">
                <label for="${keys[1]}">Title / role</label>
                <input id="${keys[1]}" data-key="${keys[1]}" type="text">
            </div>
        `;

        container.appendChild(editor);
    });
}

function populateForm() {
    createMemberEditors("main-members", mainMembers, 1);
    createMemberEditors("small-members", smallMembers, 6);

    document.querySelectorAll("[data-key]").forEach(input => {
        const key = input.dataset.key;
        if (settings[key] !== undefined) input.value = settings[key];
    });

    updateOpacity();
    document.getElementById("save-status").textContent = "Saved";
}

function updateOpacity() {
    const slider = document.getElementById("bannerOpacity");
    const output = document.getElementById("opacity-value");

    output.textContent = `${slider.value}%`;
}

document.getElementById("bannerOpacity").addEventListener("input", updateOpacity);

document.getElementById("settings-form").addEventListener("input", () => {
    document.getElementById("save-status").textContent = "Unsaved changes";
});

document.getElementById("settings-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const updated = { ...settings };

    document.querySelectorAll("[data-key]").forEach(input => {
        updated[input.dataset.key] = input.value;
    });

    updated.bannerOpacity = Number(updated.bannerOpacity);

    localStorage.setItem("myCrewSettings", JSON.stringify(updated));
    settings = updated;

    document.getElementById("save-status").textContent = "✓ Changes saved";
});

document.getElementById("reset").addEventListener("click", () => {
    const confirmed = confirm(
        "Reset every custom setting back to the original site text?"
    );

    if (!confirmed) return;

    localStorage.removeItem("myCrewSettings");
    settings = { ...DEFAULTS };
    populateForm();

    document.getElementById("save-status").textContent = "Reset to defaults";
});
