FROM eclipse-temurin:21-alpine

COPY .mvn/ .mvn
COPY tsconfig.json tsconfig.json
COPY global.d.ts global.d.ts
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY mvnw pom.xml ./
COPY src ./src

RUN ./mvnw clean package -P production

EXPOSE 8080

CMD ["./mvnw", "spring-boot:run"]