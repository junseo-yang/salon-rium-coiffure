<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/junseo-yang/salon-rium-coiffure">
    <img src="./docs/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Salon Rium Coiffure</h3>

  <p align="center">
    A hair salon app with AI virtual hairstyle 
    <br />
    <a href="https://github.com/junseo-yang/salon-rium-coiffure"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://salon-rium-coiffure.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/junseo-yang/salon-rium-coiffure/issues">Report Bug</a>
    ·
    <a href="https://github.com/junseo-yang/salon-rium-coiffure/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
[![Product Screenshot Demo][product-screenshot-demo]](https://github.com/junseo-yang/salon-rium-coiffure)

### 🌟 Welcome to Salon Rium Coiffure - Your Ultimate Hair Care Destination! 💇‍♀️
- Experience luxury and convenience like never before with our state-of-the-art online platform, designed to revolutionize your salon experience! Owned by the dynamic duo Marie and Daniel in Montreal, Salon Rium Coiffure is here to redefine beauty and style.

### 📱 Seamless Booking Experience:
- Book your hair services effortlessly with our user-friendly online booking system. No more waiting on the phone or standing in line – your dream hairstyle is just a few clicks away!

### 📅 Appointment Management Made Easy:
- Say goodbye to scheduling hassles! Manage your appointments seamlessly, with options to reschedule or cancel at your convenience. Receive email and text notifications to stay updated every step of the way.

### 💇‍♂️ Tailored Services Just for You:
- Explore our extensive catalogue of hair services, with customizable options to suit your unique needs. From cuts to colors, we've got everything you need to look and feel your best!

### 💳 Secure Payment System:
- Enjoy peace of mind with our secure payment and deposit system. Whether you prefer PayPal or credit/debit card, your transactions are always safe and secure.

### 📅 Sync with Your Schedule:
- Sync your appointments effortlessly with your favorite calendar apps like Google Calendar. Stay organized and never miss a beat with Salon Rium Coiffure!

### 💌 Stay Informed with Notifications:
- Receive timely email and text notifications for appointment reminders and updates. We'll make sure you never miss a beat!

### 💬 24/7 Customer Service Support:
- Need assistance? Our friendly chatbot is here to help! Get quick answers to your questions and enjoy a seamless customer service experience.

### 💫 Discover Your Perfect Look:
- Try on different hairstyles virtually with our AI Virtual Hairstyle feature. Explore endless possibilities and find your perfect look from the comfort of your home!

### 📈 Unlock Salon Insights:
- For our valued salon partners, gain access to our analytics dashboard for valuable insights and performance tracking. Salon management has never been easier!

Ready to elevate your hair care routine? Join Salon Rium Coiffure today and experience the future of beauty! 💖 #SalonRiumCoiffure #HairCareRevolution #BookNow

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With
* [![Next][Next.js]][Next-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![Vercel][Vercel]][Vercel-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* node
    * https://nodejs.org/en
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/junseo-yang/salon-rium-coiffure.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Copy the `.env.example` file with the name `.env`.
   ```sh
   cp .env.exmaple .env
   ```
4. Setup Environment Variables 
   1. `DATABASE_URL`: Refer to https://www.mongodb.com/
   2. `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Refer to https://console.cloud.google.com/
   3. `NEXTAUTH_URL`: https://localhost:3000
   4. `AI_LAB_TOOLS_API_KEY`: Refer to https://www.ailabtools.com/
   5. `SMTP_EMAIL` and `SMTP_PASSWORD`: Refer to the instruction on https://www.gmass.co/blog/gmail-smtp/
   6. `ADMIN_EMAIL`: Provide your admin email. (e.g., admin@google.com)
   7. `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER`: Refer to https://console.twilio.com/
5. Create Database
   ```sh
   npx prisma db push
   ```

### Run Application Locally
1. Run the Application
    ```sh
    npm run dev
    ```
2. Open [http://localhost:3000](http://localhost:3000) with your browser

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [x] Login
- [x] Service Management
- [x] Service/Designer Catalogue
- [x] Appointment Management
- [x] Staff Management
- [x] Break Management
- [x] Google Calendar Sync
- [x] Email/Text Message Notification System
- [x] Pop-Up Management
- [x] Salon Analytics/Management
- [x] AI Virtual Hairstyle
- [ ] Deposit/Payment System
- [ ] Chatbot for Customer Service

See the [open issues](https://github.com/junseo-yang/salon-rium-coiffure/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

**Junseo Yang**
- :briefcase: LinkedIn: https://linkedin.com/in/junseo-yang
- :school_satchel: Website: https://junseo-yang.github.io
- :mailbox: jsy724724@gmail.com

**Jisang Kim**
- :briefcase: LinkedIn: https://www.linkedin.com/in/jisang-kim/
- :school_satchel: Website: https://groundkim.notion.site/Jisang-Kim-3fb2f6ea688841508ee5382633adfd55
- :mailbox: jjoo0815@gmail.com

**Yingqi Xu**
- :briefcase: LinkedIn: https://www.linkedin.com/in/yingqi-xu/
- :school_satchel: Website: https://github.com/Yxu6894
- :mailbox: yxu6894@conestogac.on.ca

Project Link: [https://github.com/junseo-yang/salon-rium-coiffure](https://github.com/junseo-yang/salon-rium-coiffure)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/junseo-yang/salon-rium-coiffure.svg?style=for-the-badge
[contributors-url]: https://github.com/junseo-yang/salon-rium-coiffure/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/junseo-yang/salon-rium-coiffure.svg?style=for-the-badge
[forks-url]: https://github.com/junseo-yang/salon-rium-coiffure/network/members
[stars-shield]: https://img.shields.io/github/stars/junseo-yang/salon-rium-coiffure.svg?style=for-the-badge
[stars-url]: https://github.com/junseo-yang/salon-rium-coiffure/stargazers
[issues-shield]: https://img.shields.io/github/issues/junseo-yang/salon-rium-coiffure.svg?style=for-the-badge
[issues-url]: https://github.com/junseo-yang/salon-rium-coiffure/issues
[license-shield]: https://img.shields.io/github/license/junseo-yang/salon-rium-coiffure.svg?style=for-the-badge
[license-url]: https://github.com/junseo-yang/salon-rium-coiffure/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/junseo-yang
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Vercel]: https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
[product-screenshot-demo]: docs/images/demo.gif