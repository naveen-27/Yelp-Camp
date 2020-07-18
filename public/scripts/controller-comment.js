var btn = document.querySelector(".title button");
btn.addEventListener("click", () => {
    document.querySelector("#new-comment").classList.toggle("hide-addComment");
    btn.textContent = btn.textContent == "Leave a Review" ? "Collapse" : "Leave a Review";
});