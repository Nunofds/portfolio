/* jQuery pour fermeture bouton collapse, une fois le click effectué sur le lien */
$(function () {
    $(".navbar-nav a").click(function () {
        $(".navbar-collapse").collapse("hide");
    });
});
