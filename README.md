# RenderMeter

Платформа для сравнения скорости рендера разных шаблонизаторов (Handlebars и Mustashe)

---

## Требования

- Docker
- Node.js 18+

---

Адреса
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- MongoDB: mongodb://localhost:27017/rendermeter

---

## Быстрый запуск

```bash
docker start mongo >/dev/null 2>&1 || docker run -d --name mongo -p 27017:27017 mongo:7 && \
cd server && npm install && npm run dev & \
cd ../client && npm install && npm run dev