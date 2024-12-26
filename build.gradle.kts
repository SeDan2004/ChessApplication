plugins {
    java
    id("nu.studer.jooq") version "8.2.1"
    id("org.flywaydb.flyway") version "9.22.3"
    id("org.springframework.boot") version "3.3.2"
    id("io.spring.dependency-management") version "1.1.6"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

flyway {
    url = "jdbc:postgresql://localhost:5432/ChessApplication"
    user = "postgres"
    password = "postgres"
    schemas = arrayOf("public")
}

jooq {
    configurations.apply {
        create("main").apply {
            jooqConfiguration.apply {
                jdbc.apply {
                    driver = "org.postgresql.Driver"
                    url = "jdbc:postgresql://localhost:5432/ChessApplication"
                    user = "postgres"
                    password = "postgres"
                }

                generator.apply {
                    database.apply {
                        name = "org.jooq.meta.postgres.PostgresDatabase"
                        strategy.name = "org.jooq.codegen.example.JPrefixGeneratorStrategy"
                        inputSchema = "public"
                    }

                    generate.apply {
                        isRecords = true
                        isImmutablePojos = true
                    }

                    target.apply {
                        packageName = "ChessApplication"
                        directory = "build/generated-src/main"
                    }
                }
            }
        }
    }
}

dependencies {
    jooqGenerator("org.postgresql:postgresql:42.7.3")
    compileOnly("org.projectlombok:lombok:1.18.24")
    annotationProcessor("org.projectlombok:lombok:1.18.24")
    implementation("org.postgresql:postgresql:42.7.3")
    implementation("org.webjars:sockjs-client:1.0.2")
    implementation("org.webjars:webjars-locator:0.46")
    implementation("org.webjars:stomp-websocket:2.3.3")
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-jooq")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    implementation("org.springframework.mobile:spring-mobile-device:1.1.5.RELEASE")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
