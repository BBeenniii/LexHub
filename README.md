# LexHub

LexHub egy valós idejű ügyvéd–ügyfél kommunikációt támogató platform, ahol AI alapú jogeset azonosítás, és hely alapú szűrés alapján kereshetsz jogi képviselőt.
Jogi szolgáltatást/képviseletet nyújtó személyeknek pedig tökéeletes az ügyfelekkel való kapcsolatteremtésre.

---

## 🚀 Projekt indítása

1. Klónozd a repót:

```bash
git clone https://github.com/BBeenniii/LexHub.git
```

2. Frontend futtatása:

```bash
cd frontend
npm install
npm run dev
```

3. Backend futtatása:

```bash
cd backend
npm install
```

`.env` fájl (a backend mappában hozd létre):

```env
OPENAI_API_KEY=YOUR_OPENAI_KEY
OPENCAGE_API_KEY=YOUR_OPENCAGE_KEY
```

🔗 API kulcs igénylés:
- https://platform.openai.com/account/api-keys
- https://opencagedata.com/api

```bash
npm run start:dev
```

---

## ✨ Fő funkciók

- Ügyvédkereső szakterület és hely szerint
- AI alapú jogeset-azonosítás (OpenAI)
- Valós idejű ügyvéd–ügyfél chat (Socket.IO)
- Kétféle regisztráció (seeker, provider)
- Swagger API dokumentáció

---

## 📘 Dokumentáció

- [🧑‍💻 Fejlesztői dokumentáció (GitHub Wiki)](https://github.com/BBeenniii/LexHub/wiki/Fejlesztői-dokumentáció)
- [👥 Végfelhasználói dokumentáció (GitHub Wiki)](https://github.com/BBeenniii/LexHub/wiki/Végfelhasználói-dokumentáció)
