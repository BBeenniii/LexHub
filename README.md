# LexHub

LexHub egy valós idejű ügyvéd–ügyfél kommunikációt támogató platform, ahol a felhasználók mesterséges intelligencia segítségével kérhetnek tanácsot, vagy közvetlenül kereshetnek jogi szakértőt földrajzi és szakterületi szűrők alapján.

---

## 🛠️ Frontend futtatásához szükséges parancsok

Frontend mappában kell lenni a terminálban a parancsok futtatásához. 

```sh
cd frontend
```

A `.env` fájl létrehozása a mappán belül, melynek tartalma:

```sh
OPENCAGE_API_KEY=
```

Npm csomagok letöltése és kód futtatása:

```sh
npm install
npm run dev
```

---

## 🛠️ Backend futtatásához szükséges parancsok

Backend mappában kell lenni a terminálban a parancsok futtatásához. 

```sh
cd backend
```

A `.env` fájl létrehozása a mappán belül, melynek tartalma:

```sh
OPENAI_API_KEY=
OPENCAGE_API_KEY=
```

Npm csomagok letöltése és kód futtatása:

```sh
npm install
npm run start:dev
```

---

## 📚 API dokumentáció

Az API dokumentáció az alábbi linken érhető el:

```
http://localhost:3001/apidoc#/
```

---

## 🧑‍💻 A felhasznált technológiák

- [![React][React.js]][React-url]
- [![Vue][Vue.js]][Vue-url]
- [![Bootstrap][Bootstrap.com]][Bootstrap-url]
- [![NestJS][NestJS-badge]][NestJS-url]
- [![TypeScript][TypeScript-badge]][TypeScript-url]
- [![Socket.IO][SocketIO-badge]][SocketIO-url]
- [![MySQL][MySQL-badge]][MySQL-url]
- [![TailwindCSS][TailwindCSS-badge]][TailwindCSS-url]

---

## ✨ Fő funkciók

- 🔍 Ügyvédkereső földrajzi és szakterületi szűrőkkel
- 🤖 AI alapú jogi tanácsadás (OpenAI integrációval)
- 💬 Valós idejű ügyvéd–ügyfél chat Socket.IO-val
- 🔐 Regisztráció és bejelentkezés kétféle szerepkörrel (seeker, provider)
- 👤 Profilkezelés és ügyvédi szakterületek adminisztrációja
- 📄 Swagger alapú automatikus API dokumentáció

---

## 📁 Projekt struktúra

```
LexHub/
├── Backend/         # NestJS backend API
├── Frontend/        # React frontend (Vite + TailwindCSS)
├── README.md        # Dokumentáció
```

---

<!-- Badge image links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[NestJS-badge]: https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[TypeScript-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[SocketIO-badge]: https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white
[MySQL-badge]: https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white
[TailwindCSS-badge]: https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white

<!-- Badge destination links -->
[React-url]: https://reactjs.org/
[Vue-url]: https://vuejs.org/
[Bootstrap-url]: https://getbootstrap.com/
[NestJS-url]: https://nestjs.com
[TypeScript-url]: https://www.typescriptlang.org
[SocketIO-url]: https://socket.io
[MySQL-url]: https://www.mysql.com
[TailwindCSS-url]: https://tailwindcss.com
