
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("birthday-form");
    const welcomeScreen = document.getElementById("welcome-screen");
    const surprise = document.getElementById("surprise");
    const nameInput = document.getElementById("name");
    const dobInput = document.getElementById("dob");
    const displayName = document.getElementById("display-name");
    const ageOutput = document.getElementById("age");
    const photo = document.getElementById("birthday-photo");
    const photoHint = document.getElementById("photo-hint");
    const song = document.getElementById("birthday-song");
    const songError = document.getElementById("song-error");
    const backButton = document.getElementById("back-btn");
    const heartsContainer = document.getElementById("hearts-container");

    // Prevent selecting a future date of birth.
    const now = new Date();
    const todayString = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");

    dobInput.max = todayString;

    // Calculate the age using the birthday month and day.
    function calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        const birthdayStillComing =
            today.getMonth() < birthDate.getMonth() ||
            (
                today.getMonth() === birthDate.getMonth() &&
                today.getDate() < birthDate.getDate()
            );

        if (birthdayStillComing) {
            age--;
        }

        return age;
    }

    // Show a floating heart now and then.
    function createHeart() {
        const heart = document.createElement("span");
        const symbols = ["💗", "💕", "💖", "💓", "❤️"];

        heart.className = "heart";
        heart.textContent = symbols[
            Math.floor(Math.random() * symbols.length)
        ];

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = (14 + Math.random() * 20) + "px";
        heart.style.animationDuration = (5 + Math.random() * 5) + "s";

        heartsContainer.appendChild(heart);

        heart.addEventListener("animationend", function () {
            heart.remove();
        });
    }

    // Start the heart animation.
    createHeart();
    window.setInterval(createHeart, 900);

    // Handle a missing photo without breaking the page.
    photo.addEventListener("error", function () {
        photo.hidden = true;
        photoHint.hidden = false;
    });

    song.addEventListener("error", function () {
        songError.hidden = false;
    });

    // Reveal the birthday surprise when the form is submitted.
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const dobValue = dobInput.value;

        if (name === "" || dobValue === "") {
            alert("Please enter your name and date of birth.");
            return;
        }

        const parts = dobValue.split("-").map(Number);
        const birthDate = new Date(parts[0], parts[1] - 1, parts[2]);

        // Validate the entered date.
        if (
            Number.isNaN(birthDate.getTime()) ||
            birthDate.getFullYear() !== parts[0] ||
            birthDate.getMonth() !== parts[1] - 1 ||
            birthDate.getDate() !== parts[2] ||
            birthDate > new Date(now.getFullYear(), now.getMonth(), now.getDate())
        ) {
            alert("Please enter a valid date of birth that is not in the future.");
            return;
        }

        const age = calculateAge(birthDate);

        displayName.textContent = name;
        ageOutput.textContent = age;

        welcomeScreen.hidden = true;
        surprise.hidden = false;
        song.load();

        // Bring the revealed surprise into view.
        surprise.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // Allow the visitor to return to the beginning.
    backButton.addEventListener("click", function () {
        song.pause();
        song.currentTime = 0;

        surprise.hidden = true;
        welcomeScreen.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});