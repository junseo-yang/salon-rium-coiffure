/* eslint-disable jsx-a11y/label-has-associated-control */
import "./footer.css";
import Image from "next/image";

function FooterNote() {
    return (
        <div className="text-xs">
            <p>© 2023 by Salon Rium Coiffure.</p>
        </div>
    );
}

function Footer() {
    return (
        <footer className="w-fullm-h-56 bg-turquoise-100 leading-7">
            <div className="max-w-full-content mx-auto gap-2 pb-20 pt-11 sm:flex">
                <div className="flex-1">
                    <div className="px-6 sm:pr-0">
                        <div className="header-line"></div>
                        <p className="font-lulo mb-10">Contact</p>
                        <div className="text-sm tracking-wide sm:mb-5">
                            <p>
                                <span>570 Av. du Président-Kennedy</span>
                            </p>

                            <p>
                                <span>Montréal, QC H3A 1J9</span>
                            </p>

                            <p>
                                <span></span>
                            </p>

                            <p>
                                <span>Tel: 514-953-5603</span>
                            </p>

                            <p>
                                <span></span>
                            </p>

                            <p>
                                <span></span>
                            </p>

                            <p>
                                <span>
                                    <a
                                        href="mailto:riumsalon@gmail.com"
                                        target="_self"
                                    >
                                        riumsalon@gmail.com
                                    </a>
                                </span>
                            </p>
                        </div>
                        <div className="mb-16">
                            <ul aria-label="Social Bar" className="flex gap-4">
                                <li>
                                    <a
                                        href="https://www.instagram.com/salonrium/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Image
                                            width={25}
                                            height={25}
                                            src="https://static.wixstatic.com/media/01c3aff52f2a4dffa526d7a9843d46ea.png/v1/fill/w_33,h_33,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/01c3aff52f2a4dffa526d7a9843d46ea.png"
                                            alt="Instagram"
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="mb-16 hidden sm:block">
                            <FooterNote />
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <form>
                        <div className="px-6 sm:pl-0 sm:pr-9">
                            <div className="footer-form-field">
                                <label
                                    htmlFor="contact-form-name"
                                    className="footer-form-label"
                                >
                                    Enter Your Name
                                </label>
                                <input
                                    className="footer-form-input"
                                    id="contact-form-name"
                                    type="text"
                                    name="name"
                                    placeholder=""
                                    aria-required="false"
                                    maxLength={100}
                                />
                            </div>
                            <div className="footer-form-field">
                                <label
                                    htmlFor="contact-form-email"
                                    className="footer-form-label"
                                    aria-required
                                >
                                    Enter Your Email
                                </label>
                                <input
                                    className="footer-form-input"
                                    id="contact-form-email"
                                    type="email"
                                    name="email"
                                    required
                                    aria-required="true"
                                    pattern="^.+@.+\.[a-zA-Z]{2,63}$"
                                    maxLength={250}
                                />
                            </div>
                            <div className="footer-form-field">
                                <label
                                    htmlFor="contact-form-subject"
                                    className="footer-form-label"
                                >
                                    Enter Your Subject
                                </label>
                                <input
                                    className="footer-form-input"
                                    id="contact-form-subject"
                                    type="text"
                                    name="subject"
                                    placeholder=""
                                    aria-required="false"
                                />
                            </div>
                            <div className="footer-form-field">
                                <label
                                    htmlFor="contact-form-message"
                                    className="footer-form-label"
                                >
                                    Message
                                </label>
                                <textarea
                                    className="footer-form-input h-32"
                                    id="contact-form-message"
                                    name="message"
                                    placeholder=""
                                    aria-required="false"
                                />
                            </div>
                            <div
                                aria-disabled="false"
                                className="mb-10 mt-4 flex justify-end"
                            >
                                <button
                                    type="submit"
                                    className="btn-main w-full w-full p-1 sm:w-32"
                                    aria-disabled="false"
                                >
                                    <span>Submit</span>
                                </button>
                            </div>
                            <div className="sm:hidden">
                                <FooterNote />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
