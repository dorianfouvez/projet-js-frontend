import { setTitle } from "../utils/render.js";

let contactPage = `
<section class="mb-4">

    <!--Section heading-->
    <h2 class="h1-responsive font-weight-bold text-center my-4">Contactez nous </h2>
    <!--Section description-->
    <p class="text-center w-responsive mx-auto mb-5">vous avez des question ou des réclamation par rapport a notre jeux ? </p>

    <div class="row">

        <!--Grid column-->
        <div class="col-md-2 mb-md-0 mb-2">
        </div>
        <br>
        <br>
        <br>
        <div class="col-md-9 mb-md-0 mb-5">
            <form id="contact-form" name="contact-form" action="mail.php" method="POST">

                <!--Grid row-->
                <div class="row">

                    <!--Grid column-->
                    <div class="col-md-6">
                        <div class="md-form mb-0">
                             <label for="name" class="">votre nom</label>
                            <input type="text" id="name" name="name" class="form-control">
                        </div>
                    </div>
                    <!--Grid column-->

                    <!--Grid column-->
                    <div class="col-md-6">
                        <div class="md-form mb-0">
                            <label for="email" class="">votre mail </label>
                            <input type="text" id="email" name="email" class="form-control">
                        </div>
                    </div>
                    <!--Grid column-->

                </div>
                <!--Grid row-->

                <!--Grid row-->
                <div class="row">
                    <div class="col-md-12">
                        <div class="md-form mb-0">
                            <label for="subject" class="">Objet du message</label>
                            <input type="text" id="subject" name="subject" class="form-control">
                        </div>
                    </div>
                </div>
                <!--Grid row-->

                <!--Grid row-->
                <div class="row">

                    <!--Grid column-->
                    <div class="col-md-12">

                        <div class="md-form">
                             <label for="message">Message</label>
                            <textarea type="text" id="message" name="message" rows="5" class="form-control md-textarea"></textarea>
                        </div>

                    </div>
                </div>
                <!--Grid row-->

            </form>
            <br>
            <div class="text-center text-md-left">
                <a class="btn btn-primary" onclick="document.getElementById('contact-form').submit();">Envoyer</a>
            </div>
            <div class="status"></div>
        </div>

    </div>

</section>
`;

const ContactPage = () => {
    setTitle("");
    let page = document.querySelector("#page");
    return (page.innerHTML = contactPage);
}

export default ContactPage;