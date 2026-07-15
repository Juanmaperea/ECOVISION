# Build en dos etapas: compila con Node y sirve los estáticos con nginx,
# igual al patrón que backend/Dockerfile usa para el backend (build liviano,
# imagen final sin herramientas de desarrollo).

# --- Etapa 1: build ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# VITE_API_URL se hornea en el bundle en tiempo de build (Vite reemplaza
# import.meta.env.VITE_API_URL de forma estática). Si el backend se expone
# en otra URL, pasa --build-arg VITE_API_URL=... al construir la imagen.
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Etapa 2: runtime ---
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
