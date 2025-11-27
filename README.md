# 🚀 Scalable Starter App – Build Faster

A production-ready starter application featuring complete authentication, payment system, profile handling, chatbot integration, and more. Designed so you can directly start building your product without setting up the basics.

---

## 📌 Features

| Feature | Description |
|--------|-------------|
| 🔐 **Auth System** | Signup with OTP, email login, forgot password |
| 🌐 **OAuth** | Google & GitHub login |
| 📸 **Profile Upload** | Image upload support |
| 💬 **Chatbot** | In-built customizable chatbot |
| 💳 **Stripe Integration** | Access premium pages/features |
| 🖥️ **Responsive Frontend** | Landing page with Reviews, FAQ, Features |
| 🛢️ **Database** | Prisma ORM + MySQL |
| 🚀 **Scalable Structure** | Modular design with best practices |

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React / CSS |
| Backend  | Node.js / Express.js |
| Database | MySQL (Prisma ORM) |
| Auth     | JWT / OAuth / OTP |
| Payments | Stripe |
| Others   | Cloudinary(profile upload), NodeMailer, chatbot service |

---

## 📦 Installation & Setup


🔧 Environment Setup (Important)

Create a .env file inside the Backend folder.

Add all required environment variables (e.g., database, authentication, payment, etc.).
Create a .env file inside the Frontend as well if needed (for SERVER URL, Stripe public key, etc.).
Please ensure that all sensitive values are correctly configured; otherwise, the application will not run properly.
Do not commit the .env file to GitHub — keep it private.

## Example variables (Backend):
DATABASE_URL=
JWT_SECRET=
OTP_SERVICE_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASSWORD=

Example variables (Frontend):
REACT_APP_BACKEND_URL=
REACT_APP_STRIPE_PUBLIC_KEY=

```bash
git clone https://github.com/TEJASS-PATELL/skeleton_application
cd skeleton_application

cd Frontend
npm install
npm run dev

cd..

cd Backend
npm install
npm run dev




