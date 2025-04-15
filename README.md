# LexHub

LexHub egy valós idejű ügyvéd–ügyfél kommunikációt támogató platform, ahol a felhasználók mesterséges intelligencia segítségével kereshetnek jogi képviselőt, 
illetve földrajzi és szakterületi szűrők alapján.

---

## 🛠️ Frontend futtatásához szükséges parancsok

A projekt pullolása  után a terminálba következő parancsokat kell írni:

```sh
cd frontend
npm install
npm run dev
```
És már fut is a backend

---

## 🛠️ Backend futtatásához szükséges parancsok

```sh
cd backend
npm install
```

### 🔑 API kulcsok beállítása

A `backend` mappában hozz létre egy `.env` fájlt az alábbi tartalommal:

```env
OPENAI_API_KEY=YOUR_OPENAI_KEY
OPENCAGE_API_KEY=YOUR_OPENCAGE_KEY
```

**API kulcsokat igénylés:**

- 🔗 [OpenAI API Key (chatGPT)](https://platform.openai.com/account/api-keys)
- 🔗 [OpenCage Geocoder API Key](https://opencagedata.com/api)

Ezután futtasd:

```sh
npm run start:dev
```

---

## 📚 API dokumentáció

Az automatikusan generált Swagger API dokumentáció elérhető a backend futtatása után ezen a címen:
```
http://localhost:3001/apidoc#/
```

---

## ✨ Fő funkciók

- 🔍 Ügyvédkereső földrajzi és szakterületi szűrőkkel
- 🤖 AI alapú jogeset határozó (OpenAI integrációval)
- 💬 Valós idejű ügyvéd–ügyfél chat Socket.IO-val
- 🔐 Regisztráció és bejelentkezés kétféle szerepkörrel (seeker, provider)
- 👤 Profilkezelés és ügyvédi szakterületek adminisztrációja
- 📄 Swagger alapú automatikus API dokumentáció

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

## 🔗 Főbb backend csomagok és könyvtárak

| Csomag neve        | Funkció |
|--------------------|---------|
| NestJS             | Backend keretrendszer |
| TypeORM            | ORM – adatbázis-kezelés |
| MySQL2             | MySQL adatbázis driver |
| bcrypt             | Jelszóhashelés |
| axios              | Külső API-hívások (OpenCage) |
| openai             | AI-integráció OpenAI-val |
| socket.io          | Valós idejű chat WebSockettel |
| class-validator    | DTO-validáció |
| @nestjs/swagger    | Swagger API dokumentáció generálás |

---

## 📁 Projekt struktúra

```
LexHub/
├── backend/              # NestJS + TypeORM backend 
│   ├── src/
│   │   ├── aichat        # Jogeset azonosítás OpenAI apival
│   │   ├── auth/         # Authentikáció (seeker + provider)
│   │   ├── chat/         # Chat gateway - sccket.io műveletek
│   │   ├── lawyer-search/      # Ügyvédkereső + szűrés
│   │   ├── location-validator/ # OpenCage város-megye validáció
│   │   └── messages/     # Chat és beszélgetések kezelése
│   └── .env              # API kulcsok (OpenAi + Opencage)
├── frontend/             # React + TailwindCSS frontend
│   ├── src/
│   │   ├── components/   # Felhasználói felület elemei
│   │   ├── context/      # Socket kontextus
│   │   ├── style/        # CSS styleok
│   │   ├── types/        # Interfaces
│   │   └── utils/        # autentikáció kezelés
├── README.md             # Dokumentáció
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
